import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Hanmori — Trang chủ">
      <span className="brand-icon">
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="m7 24 17-12 17 12M11 24h26M15 27v13m18-13v13M10 40h28M22 31h5v9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="37" cy="12" r="4" fill="#cc775c" stroke="none" />
        </svg>
      </span>
      <span>
        hanmori<span className="brand-caption">HỌC MỘT CHÚT, NHỚ THẬT LÂU</span>
      </span>
    </Link>
  );
}
export function Motif({
  kind,
  className = "",
}: {
  kind: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {kind === "sun" ? (
        <>
          <circle cx="51" cy="37" r="17" fill="currentColor" opacity=".55" />
          <path
            d="M12 69c13-18 22-18 37 0s24 18 39 0M12 80c13-18 22-18 37 0s24 18 39 0"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M51 9v6M20 24l6 3M77 23l5-3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      ) : kind === "tea" ? (
        <>
          <path
            d="M25 41h46v16a23 23 0 0 1-46 0V41Z"
            fill="currentColor"
            opacity=".3"
          />
          <path
            d="M25 41h46v16a23 23 0 0 1-46 0V41ZM72 46h5a10 10 0 0 1 0 20h-8M17 83h64M39 31c-9-12 8-12 0-23M55 31c-9-12 8-12 0-23"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      ) : kind === "home" ? (
        <>
          <path d="m10 45 40-27 40 27H10Z" fill="currentColor" opacity=".3" />
          <path
            d="M10 45c15 0 30-9 40-27 10 18 25 27 40 27M18 49h64M27 50v31m46-31v31M19 82h63M41 82V60h18v22M50 60v22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      ) : kind === "flower" ? (
        <>
          <path
            d="M50 72v20M50 78c-17 0-26-6-29-16 17 0 26 6 29 16Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M50 23c-18-26-39-5-22 15-31-1-31 29 0 28-17 24 12 36 22 10 14 28 40 11 22-9 33-1 30-31 1-28C89 16 66 1 50 23Z"
            fill="currentColor"
            opacity=".3"
          />
          <circle cx="50" cy="49" r="9" fill="currentColor" />
        </>
      ) : kind === "book" ? (
        <>
          <path
            d="M17 25c14-6 25-2 33 5 11-8 23-10 34-5v51c-14-6-25-2-34 5-10-7-21-11-33-5V25Z"
            fill="currentColor"
            opacity=".25"
          />
          <path
            d="M17 25c14-6 25-2 33 5 11-8 23-10 34-5v51c-14-6-25-2-34 5-10-7-21-11-33-5V25ZM50 30v51M27 39l13 4M27 49l13 4M61 43l12-4M61 53l12-4"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <circle cx="72" cy="24" r="12" fill="currentColor" opacity=".3" />
          <path
            d="m9 81 27-47 18 25 10-13 28 35H9Z"
            fill="currentColor"
            opacity=".3"
          />
          <path
            d="m9 81 27-47 18 25 10-13 28 35M25 54l11 7 9-13M4 89h92"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}
