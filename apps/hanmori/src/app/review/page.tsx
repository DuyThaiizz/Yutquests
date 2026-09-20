import { Suspense } from "react";
import { Review } from "@/components/Review";
export const metadata = { title: "Ôn tập flashcard" };
export default function Page() {
  return (
    <Suspense fallback={<p className="loading-text">Đang mở flashcard…</p>}>
      <Review />
    </Suspense>
  );
}
