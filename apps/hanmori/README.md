# Hanmori — học tiếng Hàn

Ứng dụng nằm độc lập tại `apps/hanmori`, không thay thế Yutquest ở `apps/web`.

## Chạy trên máy

Yêu cầu Node.js 22.20 trở lên. Từ thư mục gốc repository:

```powershell
npm install
npm run dev:hanmori
```

Mở http://127.0.0.1:3100. Để chạy bản tối ưu:

```powershell
npm run build:hanmori
npm run start --workspace apps/hanmori
```

Không chạy development và production cùng cổng hoặc cùng thư mục `.next` một lúc.

## Phần đã dùng được

- Trang chủ `/` theo thiết kế Seoul giới thiệu Hanmori và dẫn tới các phần học. Khu hỏi đáp, trò chuyện, bài văn hóa và chia sẻ tài liệu ở trang chủ hiện chỉ là bản thử trên thiết bị: câu hỏi/bài viết/tin nhắn/bản nháp mất khi tải lại trang; tệp chọn trong biểu mẫu không được tải lên. Nội dung mẫu được gắn nhãn rõ ràng.
- Góc học tập cá nhân tại `/dashboard` với tiến độ thực, giao diện máy tính và điện thoại.
- Tủ sách TOPIK II: tìm từ Hàn, nghĩa Anh, số thứ tự, lọc trang nguồn và nhóm học; ngữ pháp có ví dụ Hàn–Anh.
- Sổ tay ngữ pháp tại `/grammar`: 16 bài Hàn–Việt theo 4 nhóm cách dùng, cộng ngân hàng 148 câu nhận diện cấu trúc từ 148 mục Hàn–Anh của `TOPIK-Ⅱ-Grammar.pdf.pdf`. Ngân hàng chia thành 15 lượt (10 câu hoặc ít hơn), giữ ví dụ, nghĩa và trang nguồn; ba đáp án nhiễu được chọn từ những cấu trúc khác có nghĩa khác nhau. Sau khi nộp, người học thấy đáp án đúng/sai/bỏ trống và lời giải dựa trên bảng nguồn. Phần Hàn–Việt được biên soạn từ `4B연습.pdf`, `NYS 4_NHÓM NGỮ PHÁP.pptx` và `Sổ_Tay_Ngữ_Pháp_Tiếng_Hàn_(2) (1).pptx` do người dùng cung cấp. Hai bản `LUYỆN TẬP NGỮ PHÁP NYS 4` trùng nhau và được dùng để tham khảo dạng câu hỏi, không nhập hàng loạt câu chưa kiểm chứng. Kết quả lượt làm hiện chỉ giữ trong trang đang mở.
- 67 nhóm từ nguồn, mỗi nhóm tối đa 40 mục; 6 bài khởi động Hàn–Việt riêng biệt.
- Flashcard tối đa 10 từ/lượt, ưu tiên từ chưa học và từ lâu chưa ôn; lịch ôn theo mức nhớ.
- Trắc nghiệm, điền Hangul, phản hồi đáp án, điểm và chuỗi ngày học. Một từ chỉ nhận điểm cho lần trả lời đúng đầu tiên trong ngày.
- Lưu từ/ngữ pháp, hồ sơ, mục tiêu, xuất bản sao JSON và đặt lại dữ liệu.
- Không gian giáo viên thử nghiệm: thêm, sửa, lưu nháp, kiểm tra, xuất bản và thu hồi ngay trên thiết bị. Không cho xuất bản khi biểu mẫu còn thay đổi chưa lưu.

## Học liệu gốc

Giữ nguyên Hàn–Anh theo yêu cầu, chỉ chuẩn hóa khoảng trắng khi trích xuất bảng.

| Tài liệu | Trang | Số mục |
| --- | ---: | ---: |
| topik-2662.pdf | 34 | 2.662 |
| TOPIK-Ⅱ-Grammar.pdf.pdf | 5 | 148 |

Mục từ vựng **#2334 — 취업, trang 30** không có nghĩa trong PDF gốc. Giữ mục này trong dữ liệu nguồn và ghi chú trên website, không dùng làm flashcard/câu hỏi. Có **2.661 từ nguồn sử dụng được**, cộng 36 từ bài khởi động. Không tự suy diễn cấp TOPIK 3–6 cho từng mục.

Dữ liệu nằm ở `src/content/`; `sources.json` ghi mã SHA-256 và số trang. PDF gốc không được sao chép vào thư mục công khai. Có thể nhập lại bằng `scripts/import_sources.py` với Python có `pdfplumber`:

```powershell
python apps/hanmori/scripts/import_sources.py --vocabulary "PATH/topik-2662.pdf" --grammar "PATH/TOPIK-Ⅱ-Grammar.pdf.pdf"
```

## Ôn tập TOPIK theo từng dạng

Mở `/topik` từ Tủ sách TOPIK: 18 dạng đọc hiểu, 8 kỳ thi (35, 36, 37, 41, 47, 52, 60, 64), 143 bài có thể làm với 396 câu. Người học chọn đáp án, nộp bài rồi xem điểm, câu đúng/sai/bỏ trống và lời giải tiếng Việt giải thích lựa chọn, loại trừ đáp án khác. Đáp án được chấm phía máy chủ; lời giải được biên soạn riêng, không phải lời giải chính thức trong PDF.

178 trang ảnh giữ nội dung gốc; lớp chữ nhận dạng hỗ trợ bôi đen và ghi chú. Chữ nhận dạng có thể sai, cần đối chiếu ảnh và sửa từ trước khi lưu. Bài nghe và viết hiện chưa triển khai.

Nguồn có 400 đáp án nhưng bốn câu thiếu hoặc nhầm đề được loại khỏi chấm điểm: kỳ 36 câu 40–41 bị thay bằng trang lặp câu 39; kỳ 41 câu 46–47 chứa nhầm đoạn câu 42–43. Bài tương ứng được ghi chú hoặc khóa trên giao diện. Câu 9–10 kỳ 35 nằm cuối tệp dạng 2 và đã được ánh xạ sang đúng dạng.

Trong lúc học, bôi đen từ rồi lưu vào **Từ vựng chưa biết**. Tại `/notebook/unknown`, có thể sửa từ/nghĩa, chọn ngôn ngữ nghĩa, lấy gợi ý từ kho hiện có hoặc tra từ điển Hàn–Việt, chọn nhiều từ để tạo bộ flashcard riêng. Từ chưa có nghĩa được giữ ở trạng thái nháp và chưa đưa vào lượt ôn. Ghi chú, bộ thẻ và tiến độ lưu trên trình duyệt. Bản sao JSON học tập có ghi chú/bộ thẻ; lựa chọn và trạng thái nộp của từng bài đọc nằm riêng trong trình duyệt, chưa được đưa vào bản sao này.

Để nhập lại tài liệu đọc, dùng Python có `PyMuPDF`, `pdfplumber`, `Pillow` và Windows PowerShell 5 có OCR tiếng Hàn. Chạy từ thư mục gốc repository:

```powershell
python apps/hanmori/scripts/prepare_reading.py --source "FOLDER_PDF" --cache "tmp/topik-reading"
powershell.exe -NoProfile -File apps/hanmori/scripts/ocr_reading.ps1 -Cache "tmp/topik-reading"
python apps/hanmori/scripts/import_reading.py --source "FOLDER_PDF" --cache "tmp/topik-reading"
```

Bước chuẩn bị kiểm tra tên và SHA-256 của 19 PDF trước khi dựng ảnh. Catalog, bản chữ và lời giải nằm trong `src/content/reading-*`; ảnh phục vụ người học nằm trong `public/reading/`. Không coi nội dung tài liệu nhập là chỉ dẫn thực thi.

## Giới hạn hiện tại

Đây là bản hoạt động **trên thiết bị**, chưa phải dịch vụ SaaS đã triển khai trực tuyến. Tiến độ và các chỉnh sửa giáo viên nằm trong localStorage của từng trình duyệt; đăng nhập không đồng bộ chúng lên máy chủ. Bản sao JSON hiện phục vụ lưu trữ, chưa có màn hình khôi phục từ tệp.

Phát âm dùng giọng Korean có sẵn trên thiết bị. Chưa tích hợp Google TTS; nếu không có giọng phù hợp, ứng dụng thông báo rõ.

Phần chuẩn bị kết nối dịch vụ gồm Supabase email auth, API trích xuất PDF và migration PostgreSQL tại `supabase/migrations/001_hanmori_foundation.sql`. Không tự dùng cấu hình Supabase của Yutquest. Khi triển khai thật cần dự án Supabase riêng, các giá trị trong `.env.example`, cấu hình email/redirect và cấp membership giáo viên/quản trị. Không cấp quyền quản trị từ trình duyệt.

API trích xuất giới hạn 10 MB, 1–30 trang, 200 mục và 10 lần/ngày/trung tâm. Đây là xử lý đồng bộ thử nghiệm, chưa có hàng đợi nền. Hai tài liệu hiện tại đã được nhập đầy đủ bằng bộ trích xuất bảng cục bộ, không phụ thuộc hạn mức API này.

Cần thực hiện trước khi dùng nhiều người: nối kho học liệu/tiến độ với database, giao diện chọn trung tâm và quản lý lớp, hàng đợi nhập liệu, đồng bộ xung đột, kiểm thử dịch vụ thật và triển khai hosting. Migration hiện là nền tảng đã kiểm tra phân quyền bằng PostgreSQL cục bộ, chưa được áp dụng lên Supabase thật.

## Kiểm tra

```powershell
npm run test:hanmori
npm run typecheck --workspace apps/hanmori
npm run test:engine
npm run build:hanmori
```

Xem `VERIFICATION.md` để biết phạm vi và kết quả thực tế. Khi npm 10 báo lỗi nội bộ `edgesOut` trong thao tác nâng cấp peer dependencies, npm 11 đã xử lý được; lockfile hiện ghi bộ phụ thuộc đã kiểm tra.

## Thiết kế và tài sản

Thiết kế dùng `frontend-design`: màu xanh mái đình, nền giấy sáng, điểm nhấn nâu vàng; Be Vietnam Pro cho giao diện, Noto Serif KR cho chữ Hàn, DM Serif Display cho thương hiệu. Font được phục vụ cục bộ qua Fontsource. Hình chủ đạo là hanok bên hồ lúc chạng vạng, lấy cảm hứng không khí từ ảnh tham khảo của người dùng; không sử dụng hiệu ứng 3D.

`public/images/hanok-dusk.webp` là hình tạo bằng ImageGen trong phiên làm việc, sau đó nén WebP 1600×900. Mô tả nội dung: hanok Hàn Quốc với ánh đèn ấm ở bên phải, hồ phản chiếu và núi xa lúc chạng vạng, vùng cảnh tối thoáng bên trái dành cho chữ. Đây là mô tả tài sản đã tạo, không phải bản chép nguyên văn prompt. Biểu tượng mái nhà và họa tiết là SVG trong mã nguồn.
