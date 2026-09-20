import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import path from "node:path";
const TENANT_A = "10000000-0000-4000-8000-000000000001",
  TENANT_B = "10000000-0000-4000-8000-000000000002";
const STUDENT = "20000000-0000-4000-8000-000000000001",
  TEACHER = "20000000-0000-4000-8000-000000000002",
  ADMIN = "20000000-0000-4000-8000-000000000003";
const WORD = "30000000-0000-4000-8000-000000000001",
  DRAFT = "30000000-0000-4000-8000-000000000002";
let db: PGlite;
async function asUser<T>(id: string, action: () => Promise<T>): Promise<T> {
  await db.exec("set role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  try {
    return await action();
  } finally {
    await db.exec("reset role");
  }
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`,
  );
  await db.exec(
    readFileSync(
      path.resolve("supabase/migrations/001_hanmori_foundation.sql"),
      "utf8",
    ),
  );
  await db.query("insert into auth.users(id) values($1),($2),($3)", [
    STUDENT,
    TEACHER,
    ADMIN,
  ]);
  await db.query(
    "insert into hanmori_tenants(id,name) values($1,'A'),($2,'B')",
    [TENANT_A, TENANT_B],
  );
  await db.query(
    "insert into hanmori_memberships(tenant_id,user_id,role) values($1,$2,'student'),($1,$3,'teacher'),($1,$4,'admin')",
    [TENANT_A, STUDENT, TEACHER, ADMIN],
  );
  await db.query(
    "insert into hanmori_lessons(tenant_id,id,title,level) values($1,'a','A lesson',1),($2,'b','B lesson',1)",
    [TENANT_A, TENANT_B],
  );
  await db.query(
    "insert into hanmori_vocabulary(tenant_id,id,lesson_id,korean,meaning,status,reviewed_by) values($1,$2,'a','학교','Trường học','published',$4),($1,$3,'a','집','Nhà','draft',null)",
    [TENANT_A, WORD, DRAFT, ADMIN],
  );
  await db.query(
    "insert into hanmori_vocabulary(tenant_id,lesson_id,korean,meaning,status,reviewed_by) values($1,'b','물','Nước','published',$2)",
    [TENANT_B, ADMIN],
  );
}, 30000);
afterAll(async () => {
  await db?.close();
});
describe("PostgreSQL migration and two-tenant RLS", () => {
  it("students can only read their own center’s published vocabulary", async () => {
    await asUser(STUDENT, async () => {
      const { rows } = await db.query<{ id: string }>(
        "select id from hanmori_vocabulary",
      );
      expect(rows.map((row) => row.id)).toEqual([WORD]);
    });
  });
  it("teachers can read drafts but not other centers", async () => {
    await asUser(TEACHER, async () => {
      const { rows } = await db.query("select id from hanmori_vocabulary");
      expect(rows).toHaveLength(2);
    });
  });
  it("students cannot create content", async () => {
    await expect(
      asUser(STUDENT, () =>
        db.query(
          "insert into hanmori_vocabulary(tenant_id,lesson_id,korean,meaning) values($1,'a','차','Trà')",
          [TENANT_A],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
  });
  it("teachers cannot publish their own drafts", async () => {
    await expect(
      asUser(TEACHER, () =>
        db.query(
          "update hanmori_vocabulary set status='published',reviewed_by=$1 where id=$2",
          [TEACHER, DRAFT],
        ),
      ),
    ).rejects.toThrow(/Only center admins/);
  });
  it("a center admin publishes with a recorded reviewer and audit trail", async () => {
    await asUser(ADMIN, async () => {
      await db.query(
        "update hanmori_vocabulary set status='published' where id=$1",
        [DRAFT],
      );
      const { rows } = await db.query<{ reviewed_by: string }>(
        "select reviewed_by from hanmori_vocabulary where id=$1",
        [DRAFT],
      );
      expect(rows[0].reviewed_by).toBe(ADMIN);
      const audit = await db.query(
        "select id from hanmori_audit_log where word_id=$1",
        [DRAFT],
      );
      expect(audit.rows.length).toBeGreaterThan(0);
    });
  });
  it("withdrawing a word removes it from student reads", async () => {
    await asUser(ADMIN, () =>
      db.query("update hanmori_vocabulary set status='archived' where id=$1", [
        DRAFT,
      ]),
    );
    await asUser(STUDENT, async () => {
      expect(
        (
          await db.query("select id from hanmori_vocabulary where id=$1", [
            DRAFT,
          ])
        ).rows,
      ).toHaveLength(0);
    });
  });
  it("composite foreign keys reject lessons from a different tenant", async () => {
    await expect(
      asUser(TEACHER, () =>
        db.query(
          "insert into hanmori_vocabulary(tenant_id,lesson_id,korean,meaning) values($1,'b','차','Trà')",
          [TENANT_A],
        ),
      ),
    ).rejects.toThrow(/foreign key/);
  });
  it("users cannot promote their own membership", async () => {
    await expect(
      asUser(STUDENT, () =>
        db.query(
          "update hanmori_memberships set role='admin' where user_id=$1",
          [STUDENT],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });
  it("review events cannot impersonate another user", async () => {
    await expect(
      asUser(STUDENT, () =>
        db.query(
          "insert into hanmori_review_events(tenant_id,user_id,request_id,word_id,grade) values($1,$2,gen_random_uuid(),$3,'good')",
          [TENANT_A, TEACHER, WORD],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
  });
  it("students cannot consume paid extraction quota", async () => {
    await expect(
      asUser(STUDENT, () =>
        db.query("select hanmori_reserve_extraction($1)", [TENANT_A]),
      ),
    ).rejects.toThrow(/Teacher role required/);
  });
  it("teacher quota cannot be consumed for another tenant", async () => {
    await expect(
      asUser(TEACHER, () =>
        db.query("select hanmori_reserve_extraction($1)", [TENANT_B]),
      ),
    ).rejects.toThrow(/Teacher role required/);
  });
  it("quota allows exactly ten reservations and then rejects", async () => {
    await asUser(TEACHER, async () => {
      for (let i = 0; i < 10; i++) {
        const { rows } = await db.query<{ ok: boolean }>(
          "select hanmori_reserve_extraction($1) as ok",
          [TENANT_A],
        );
        expect(rows[0].ok).toBe(true);
      }
      const { rows } = await db.query<{ ok: boolean }>(
        "select hanmori_reserve_extraction($1) as ok",
        [TENANT_A],
      );
      expect(rows[0].ok).toBe(false);
    });
  });
});
