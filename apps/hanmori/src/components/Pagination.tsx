"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function usePagination<T>(
  items: T[],
  pageSize: number,
  filterKey: string,
) {
  const [selection, setSelection] = useState({ key: filterKey, page: 1 });
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page =
    selection.key === filterKey ? Math.min(selection.page, pages) : 1;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pages,
    onPage: (next: number) =>
      setSelection({
        key: filterKey,
        page: Math.max(1, Math.min(next, pages)),
      }),
  };
}
export function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        className="button secondary"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft size={16} /> Trước
      </button>
      <span aria-live="polite">
        Trang <strong>{page}</strong> / {pages}
      </span>
      <button
        className="button secondary"
        disabled={page === pages}
        onClick={() => onPage(page + 1)}
      >
        Tiếp <ChevronRight size={16} />
      </button>
    </nav>
  );
}
