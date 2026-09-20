# Kiểm chứng Hanmori

Ngày kiểm tra cuối: 20/09/2026. Phạm vi: ứng dụng local `apps/hanmori`, port 3100; không phát hành SaaS trực tuyến.

## Kiểm tra tự động

| Kiểm tra | Đạt | Lỗi | Bỏ qua |
| --- | ---: | ---: | ---: |
| Vitest Hanmori, 6 tệp | 74 | 0 | 0 |
| Vitest yut-engine, 3 tệp | 14 | 0 | 0 |
| HTTP bản production: 143 bài, 143 lượt chấm, 178 ảnh, 5 trang khác, 2 bài không hợp lệ trả 404 | 471 | 0 | 0 |

Các kiểm thử Hanmori gồm 19 kiểm thử lịch ôn/điểm/chuỗi ngày, 12 kiểm thử phân quyền bằng PostgreSQL PGlite, 12 kiểm thử ranh giới nhập PDF, 9 kiểm thử corpus và lưu dữ liệu, 16 kiểm thử đọc hiểu và 6 kiểm thử ghi chú/bộ thẻ cá nhân. Fixture PDF được tạo cục bộ, không gửi tài liệu người dùng ra ngoài. Phản hồi AI và xác thực trong kiểm thử nhập PDF được mô phỏng; không thay cho kiểm thử dịch vụ thật.

Kiểm thử mới bao phủ 396 câu có lời giải, 178 trang có ảnh/bản chữ hợp lệ, bốn câu nguồn lỗi, không truyền đáp án vào dữ liệu công khai, chấm đúng/sai/bỏ trống, khóa câu hỏi và lựa chọn không hợp lệ, API 200/400/404/422/413 và no-store. Ghi chú được kiểm tra trùng từ sau chuẩn hóa, từ chưa có nghĩa, ngôn ngữ nghĩa, lưu/tải lại bộ thẻ, cập nhật từ và lịch ôn. HTTP smoke chạy trên bản build cuối; kết quả ở `tmp/topik-reading/http-smoke.json`.

- `npm run build:hanmori`: đạt; Next.js 16.3.5, 89 trang được tạo, kiểm tra TypeScript tích hợp đạt.
- `npm run typecheck --workspace apps/hanmori`: đạt.
- `npm run build --workspace apps/web`: đạt ngày 19/09, gồm kiểm tra type/lint của ứng dụng Yutquest hiện có; không chạy lại ngày 20/09 vì không sửa mã nguồn ứng dụng này.
- `npm audit --workspace apps/hanmori --json`: 0 lỗ hổng, gồm phụ thuộc development, tại thời điểm kiểm tra.
- `npm ls esbuild --workspace apps/hanmori`: đạt, không còn peer dependency không tương thích.
- `git diff --check`: đạt cho phần thay đổi đã được theo dõi.

Đã nâng Vitest lên 4.1.11, Vite lên 8.3.0 và cung cấp esbuild tương thích riêng cho Hanmori. Không dùng `audit fix --force` để thay đổi hàng loạt ứng dụng khác.

## Kiểm tra trên trình duyệt

Ngày 20/09, đã tương tác với bản đọc hiểu và ghi chú:

1. Từ Tủ sách đến chọn dạng, mở đề; chọn một câu đúng, một câu sai và bỏ trống hai câu, xác nhận nộp thiếu: kết quả 1/4, 25%, đủ bốn lời giải.
2. Tải lại giữ kết quả; làm lại xóa lựa chọn và kết quả của bài.
3. Chuyển sang trang 2 của đề nhiều trang, mở bản chữ nhận dạng và đối chiếu số trang; không có warning/error trong console của lượt kiểm tra này.
4. Bôi đen `방학` trên lớp chữ của ảnh, lưu chưa có nghĩa, bổ sung nghĩa tiếng Việt, tạo bộ thẻ, tải lại rồi ôn đúng thẻ đó; lật thẻ và đánh giá nhớ hoàn tất một từ.
5. Gợi ý nghĩa `가계부` giữ nhãn tiếng Anh; mở liên kết từ điển Hàn–Việt với `방학` có kết quả tra cứu.
6. Hộp sửa ghi chú là dialog modal; Escape đóng và bỏ chỉnh sửa chưa lưu.
7. Chiều rộng 390 px: danh sách dạng, đề phóng to và dialog ghi chú nằm trong màn hình; ảnh 1100 px cuộn trong vùng đề, không làm tràn ngang toàn trang. Bố cục desktop đã kiểm tra bằng ảnh chụp.

Đã chạy bước chuẩn bị lại từ 19 PDF thực, kiểm tra SHA-256 và đủ 178 trang. OCR dùng kết quả nhận dạng cục bộ đã tạo. 396 lời giải được biên soạn dựa trên ảnh và đáp án nguồn; chưa có vòng thẩm định độc lập bởi giáo viên cho toàn bộ lời giải. Bốn câu nguồn thiếu/nhầm được loại khỏi chấm, không tự dựng đề thay thế.

Các luồng nền tảng bên dưới được kiểm tra ngày 19/09:

Đã tương tác trực tiếp qua trình duyệt với các luồng sau trong quá trình triển khai:

1. Tìm mục từ #2662, hiển thị `힘껏`, nghĩa `with all one's strength`, trang 34.
2. Lưu từ nguồn và ngữ pháp #1; tải lại rồi thấy cấu trúc đã lưu trong sổ.
3. Flashcard nguồn #1 hiển thị `household account book` và nguồn trang 1; đánh giá nhớ chuyển sang thẻ #2.
4. Trắc nghiệm nguồn Hàn–Anh chọn `near` cho `가까이`, nhận phản hồi đúng.
5. Điền `이름` cho “Tên”, nhận phản hồi đúng; nhập sai ở câu tiếp theo nhận đáp án `사람`.
6. Tạo fixture giáo viên `검증용`, lưu nháp, xuất bản; chờ thấy từ trong bài Lời chào. Thu hồi rồi xác nhận từ không còn trong bài sau khi tải dữ liệu.
7. Khi sửa nghĩa chưa lưu, nút xuất bản bị khóa; khi trả nội dung về bản đã lưu, nút hoạt động lại.
8. Menu điện thoại mở và điều hướng về trang chủ.

Kiểm tra lại bố cục bản tối ưu ở 360×800, 768×1024 và màn hình desktop 1280: không tràn ngang ở tủ ngữ pháp; chữ trang trí đã được ẩn trên điện thoại để không chồng tiêu đề. Sidebar đóng được ẩn khỏi điều hướng bàn phím. Trang chủ có ảnh WebP và font cục bộ tải được. Console kiểm tra không có warning/error trong lượt kiểm tra bố cục cuối.

Một fixture `검증용` được giữ ở trạng thái thu hồi trong hồ sơ trình duyệt kiểm thử; không nằm trong corpus hay gói ứng dụng.

## Các lỗi đã phát hiện và sửa

- Nhập liệu đánh mất nhãn tiếng Anh tại schema: tái hiện bằng kiểm thử thất bại, thêm trường ngôn ngữ được kiểm tra và giữ nguyên qua API, kiểm thử chạy lại đạt.
- Lượt flashcard “tất cả” luôn bắt đầu ở 10 mục đầu: ưu tiên mục chưa học/lâu chưa học, có kiểm thử hồi quy.
- Xuất bản phiên bản cũ khi đang sửa: chặn nút nếu nội dung khác bản đã lưu và đặt khu vực duyệt trước danh sách.
- Tiêu đề tủ sách bị trang trí che trên điện thoại: bỏ trang trí tại breakpoint nhỏ, kiểm tra lại ảnh chụp.
- Ô loại từ của mục nguồn thiếu trạng thái trống: bổ sung “Chưa ghi trong nguồn” trong đúng ô chọn.

## Chưa kiểm tra qua dịch vụ thật

4 hạng mục không chạy do chưa cấu hình: email đăng nhập/khôi phục Supabase; migration/RLS trên Supabase thật; trích xuất qua Claude thật; cloud TTS. Đây không phải các kiểm thử đạt. TTS cloud chưa được triển khai; giọng đọc thiết bị phụ thuộc giọng Korean đã cài.

Chưa có triển khai hosting, đồng bộ học liệu/tiến độ nhiều người, quản lý lớp hoàn chỉnh, hàng đợi AI hoặc restore JSON trong UI. Không coi bản này là hoàn tất toàn bộ kế hoạch SaaS. Xem README để chạy và tiếp tục kết nối các phần còn lại.

## Rà soát cuối

Rà soát tính đúng, khả năng đọc, cấu trúc, bảo mật và hiệu năng: schema kiểm tra dữ liệu đầu vào; API xác thực trước khi xử lý PDF; RLS và giới hạn tenant có kiểm thử; không chứa khóa dịch vụ; chỉ hiển thị text nguồn qua React; danh sách lớn có phân trang; localStorage chỉ ghi các thay đổi so với corpus. API chấm đọc giới hạn thân yêu cầu 8 KB, kể cả khi thiếu Content-Length, kiểm tra câu hỏi theo bộ đề và chấm phía máy chủ. Ghi chú/bộ thẻ có schema, giới hạn số lượng và kiểm tra tham chiếu. PDF gốc và tài liệu tạm không nằm trong thư mục public; ảnh trang đề phục vụ việc học được lưu công khai trong `public/reading/`. Các giới hạn dịch vụ được công bố trong giao diện và README.
