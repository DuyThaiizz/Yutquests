import { WritingLibrary } from "@/components/WritingLibrary";
import { writingExercises } from "@/lib/server/writing-catalog";
import { publicWritingPrompt } from "@/lib/writing";

export const metadata = { title: "Luyện viết TOPIK câu 51–52" };
export default function Page() {
  return (
    <WritingLibrary exercises={writingExercises.map(publicWritingPrompt)} />
  );
}
