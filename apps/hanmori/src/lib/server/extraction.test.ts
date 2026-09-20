import { describe, it, expect, vi } from "vitest";
import { PDFDocument } from "pdf-lib";
import {
  extractionHandler,
  RequestError,
  authorizeTeacher,
  type ExtractionDependencies,
} from "./extraction";
async function pdfRequest(pages = 1) {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < pages; i++) pdf.addPage();
  const form = new FormData();
  form.set(
    "file",
    new File(
      [new Uint8Array(await pdf.save())],
      "sanitized-korean-fixture.pdf",
      { type: "application/pdf" },
    ),
  );
  return new Request("http://localhost/api/extract", {
    method: "POST",
    body: form,
  });
}
const valid = {
  items: [
    {
      korean: "학교",
      meaning: "Trường học",
      romanization: "hakgyo",
      example: "학교에 가요.",
      translation: "Tôi đi đến trường.",
      wordType: "Danh từ",
      sourcePage: 1,
    },
  ],
};
const deps = (): ExtractionDependencies => ({
  authorize: vi.fn(async () => ({ userId: "teacher-a", tenantId: "center-a" })),
  reserve: vi.fn(async () => {}),
  extract: vi.fn(async () => valid),
});
describe("PDF integration boundary with sanitized fixture", () => {
  it("requires a token before accessing account configuration", async () => {
    await expect(
      authorizeTeacher(new Request("http://localhost/api/extract")),
    ).rejects.toMatchObject({ status: 401 });
  });
  it("never reads/sends a document for an unauthorized user", async () => {
    const dependencies = deps();
    dependencies.authorize = async () => {
      throw new RequestError("Forbidden", 403);
    };
    const response = await extractionHandler(dependencies)(await pdfRequest());
    expect(response.status).toBe(403);
    expect(dependencies.extract).not.toHaveBeenCalled();
  });
  it("parses a real sanitized PDF and returns validated draft candidates", async () => {
    const dependencies = deps();
    const response = await extractionHandler(dependencies)(await pdfRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(valid);
    expect(dependencies.reserve).toHaveBeenCalledWith({
      userId: "teacher-a",
      tenantId: "center-a",
    });
  });
  it("rejects an HTML file renamed to PDF before calling AI", async () => {
    const form = new FormData();
    form.set("file", new File(["<script>bad</script>"], "fake.pdf"));
    const dependencies = deps();
    const response = await extractionHandler(dependencies)(
      new Request("http://localhost/api/extract", {
        method: "POST",
        body: form,
      }),
    );
    expect(response.status).toBe(400);
    expect(dependencies.extract).not.toHaveBeenCalled();
  });
  it("enforces page count independently of model limits", async () => {
    const dependencies = deps();
    expect(
      (await extractionHandler(dependencies)(await pdfRequest(31))).status,
    ).toBe(422);
    expect(dependencies.extract).not.toHaveBeenCalled();
  });
  it("rejects excessive declared size before reading body", async () => {
    const dependencies = deps();
    const request = new Request("http://localhost/api/extract", {
      method: "POST",
      headers: { "content-length": String(12 * 1024 * 1024) },
      body: "x",
    });
    expect((await extractionHandler(dependencies)(request)).status).toBe(413);
  });
  it("rejects invalid AI output instead of publishing invented defaults", async () => {
    const dependencies = deps();
    dependencies.extract = async () => ({ items: [{ korean: "학교" }] });
    expect(
      (await extractionHandler(dependencies)(await pdfRequest())).status,
    ).toBe(502);
  });
  it("rejects references to non-existent source pages", async () => {
    const dependencies = deps();
    dependencies.extract = async () => ({
      items: [{ ...valid.items[0], sourcePage: 3 }],
    });
    expect(
      (await extractionHandler(dependencies)(await pdfRequest())).status,
    ).toBe(502);
  });
  it("does not invoke paid AI after quota exhaustion", async () => {
    const dependencies = deps();
    dependencies.reserve = async () => {
      throw new RequestError("Quota", 429);
    };
    expect(
      (await extractionHandler(dependencies)(await pdfRequest())).status,
    ).toBe(429);
    expect(dependencies.extract).not.toHaveBeenCalled();
  });
  it("handles malformed multipart bodies without leaking details", async () => {
    const response = await extractionHandler(deps())(
      new Request("http://localhost/api/extract", {
        method: "POST",
        headers: { "content-type": "multipart/form-data; boundary=no" },
        body: "broken",
      }),
    );
    expect(response.status).toBe(400);
  });
  it("handles a provider timeout without exposing secrets", async () => {
    const dependencies = deps();
    dependencies.extract = async () => {
      throw new Error("secret-key-provider-trace");
    };
    const response = await extractionHandler(dependencies)(await pdfRequest());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("secret-key");
  });
});

it("preserves source English and its language marker during import", async () => {
  const dependencies = deps();
  const original = {
    ...valid.items[0],
    meaning: "school",
    translation: "I go to school.",
    meaningLanguage: "en",
  };
  dependencies.extract = async () => ({ items: [original] });
  const response = await extractionHandler(dependencies)(await pdfRequest());
  expect(await response.json()).toEqual({ items: [original] });
});
