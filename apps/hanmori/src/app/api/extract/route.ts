import { createClient } from "@supabase/supabase-js";
import {
  authorizeTeacher,
  extractionHandler,
  extractWithClaude,
  RequestError,
} from "@/lib/server/extraction";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  return extractionHandler({
    authorize: authorizeTeacher,
    extract: extractWithClaude,
    reserve: async (access) => {
      if (!process.env.ANTHROPIC_API_KEY)
        throw new RequestError(
          "Trung tâm chưa kết nối dịch vụ trích xuất AI. Hãy nhập từ thủ công.",
          503,
        );
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: { Authorization: request.headers.get("authorization")! },
          },
          auth: { persistSession: false },
        },
      );
      const { data, error } = await client.rpc("hanmori_reserve_extraction", {
        target_tenant: access.tenantId,
      });
      if (error)
        throw new RequestError(
          "Chưa kiểm tra được hạn mức. Hãy liên hệ quản trị viên.",
          503,
        );
      if (data !== true)
        throw new RequestError(
          "Đã đạt hạn mức 10 lần trích xuất trong ngày. Hãy tiếp tục vào ngày mai.",
          429,
        );
    },
  })(request);
}
