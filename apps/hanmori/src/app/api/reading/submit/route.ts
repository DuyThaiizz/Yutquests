import { submissionSchema, gradeReading } from "@/lib/reading";
import {
  readingAnswerSets,
  readingExplanations,
} from "@/lib/server/reading-catalog";
export async function POST(request: Request) {
  try {
    const oversized = () =>
      Response.json({ error: "Dữ liệu nộp bài quá lớn." }, { status: 413 });
    if (Number(request.headers.get("content-length")) > 8192)
      return oversized();
    const reader = request.body?.getReader();
    if (!reader)
      return Response.json({ error: "Chưa có bài nộp." }, { status: 400 });
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return oversized();
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const parsed = submissionSchema.safeParse(
      JSON.parse(new TextDecoder().decode(bytes)),
    );
    if (!parsed.success)
      return Response.json({ error: "Đáp án không hợp lệ." }, { status: 400 });
    const set = readingAnswerSets.find((s) => s.id === parsed.data.setId);
    if (!set)
      return Response.json(
        { error: "Không tìm thấy bài đọc." },
        { status: 404 },
      );
    if (!set.numbers.length)
      return Response.json(
        { error: "Bài này đang chờ bổ sung đề đúng." },
        { status: 422 },
      );
    const result = gradeReading(
      set,
      parsed.data.answers,
      set.answers,
      readingExplanations,
    );
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Không đọc được bài nộp. Hãy kiểm tra đáp án và thử lại." },
      { status: 400 },
    );
  }
}
