import { z } from "zod";
import { findWritingExercise } from "@/lib/server/writing-catalog";

const submissionSchema = z.object({
  id: z.string().regex(/^(51|52)-\d{1,3}$/),
  answers: z.object({
    ㄱ: z.string().trim().min(1).max(1000),
    ㄴ: z.string().trim().min(1).max(1000),
  }),
});

export async function POST(request: Request) {
  let submission: z.infer<typeof submissionSchema>;
  try {
    submission = submissionSchema.parse(await request.json());
  } catch {
    return Response.json(
      { error: "Bài làm chưa đầy đủ hoặc không hợp lệ." },
      { status: 400 },
    );
  }
  const exercise = findWritingExercise(submission.id);
  if (!exercise) {
    return Response.json(
      { error: "Không tìm thấy bài viết này." },
      { status: 404 },
    );
  }
  return Response.json(
    {
      id: exercise.id,
      answers: exercise.answers,
      explanations: exercise.explanations,
      answerSource: exercise.answerSource || "Lời giải biên soạn từ đề gốc",
      answerPage: exercise.kind === 52 ? exercise.answerPage : undefined,
      answerImage: exercise.kind === 52 ? exercise.answerImage : undefined,
      reviewNote: exercise.reviewNote,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
