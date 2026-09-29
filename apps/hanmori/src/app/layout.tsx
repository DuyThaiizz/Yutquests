import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/noto-serif-kr/500.css";
import "@fontsource/dm-serif-display/400.css";
import "./globals.css";
import "./reading.css";
import "./writing.css";
import "./grammar.css";
import "./seoul-home.css";
import { StudyProvider } from "@/components/StudyProvider";
import { Shell } from "@/components/Shell";
import { SelectionNote } from "@/components/SelectionNote";
export const metadata: Metadata = {
  title: {
    default: "Hanmori — Một chút tiếng Hàn mỗi ngày",
    template: "%s · Hanmori",
  },
  description:
    "Khám phá tiếng Hàn qua từng từ mới. Học từ vựng, ôn flashcard và luyện tập theo nhịp riêng của bạn.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <StudyProvider>
          <Shell>{children}</Shell>
          <SelectionNote />
        </StudyProvider>
      </body>
    </html>
  );
}
