# Yutquest

Yutquest là trò chơi học thành ngữ tiếng Hàn dựa trên Yut Nori truyền thống. Repository được tổ chức theo mô hình monorepo:

```text
apps/web             Next.js frontend
apps/server          Game server
packages/yut-engine  Headless game engine
```

## Frontend hiện tại

- `/` — portfolio giới thiệu sản phẩm và vòng lặp học tập `Tung → Học → Tiến`.
- `/game` — prototype tương tác cục bộ: tung Yut, trả lời thẻ và di chuyển quân.
- `/guide` — hướng dẫn luật Yut Nori và cơ chế thẻ học.
- `/cards` — thư viện thành ngữ mẫu, có bộ lọc và phần giải thích mở rộng.

Phòng chơi trực tuyến vẫn đang phát triển. Giao diện không trình bày các thao tác local như một phòng multiplayer thật.

## Chạy frontend

```bash
npm install
npm run dev:web
```

Production build:

```bash
npm run build -w apps/web
npm run start -w apps/web
```

## Kiểm tra gần nhất

- Next.js production build và TypeScript: đạt.
- Các route `/`, `/game`, `/guide`, `/cards`: HTTP 200.
- Responsive 360px: không tràn ngang.
- Gameplay prototype và card filters: hoạt động.
- Browser console và production server: không có warning/error.

## Việc tiếp theo

1. Kết nối UI game với state machine trong `yut-engine`.
2. Kết nối phòng chơi với `apps/server` và xử lý reconnect.
3. Thay bộ thẻ mẫu bằng nội dung đã được kiểm duyệt ngôn ngữ.
4. Thêm kiểm thử tự động cho các luồng UI tương tác.
