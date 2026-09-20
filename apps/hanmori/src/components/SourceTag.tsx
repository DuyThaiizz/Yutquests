import Link from "next/link";
import type { Vocabulary } from "@/lib/models";
export function SourceTag({ word }: { word: Vocabulary }) {
  if (!word.sourceId) return null;
  return (
    <Link
      className="source-tag"
      href={`/library?tab=vocabulary&sourcePage=${word.sourcePage}`}
      title="Đối chiếu các mục cùng trang trong tài liệu"
    >
      topik-2662.pdf{" "}
      <span>
        · Trang {word.sourcePage} · #{word.sourceIndex}
      </span>
    </Link>
  );
}
