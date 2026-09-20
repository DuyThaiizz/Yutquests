import { Suspense } from "react";
import { Library } from "@/components/Library";
export const metadata = { title: "Tủ sách TOPIK II — Từ vựng & ngữ pháp" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; sourcePage?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<p className="loading-text">Đang mở tủ sách…</p>}>
      <Library
        key={`${params.tab ?? "vocabulary"}-${params.sourcePage ?? 0}`}
      />
    </Suspense>
  );
}
