import { Suspense } from "react";
import { Practice } from "@/components/Practice";
export const metadata = { title: "Luyện tập" };
export default function Page() {
  return (
    <Suspense fallback={<p className="loading-text">Đang chuẩn bị bài tập…</p>}>
      <Practice />
    </Suspense>
  );
}
