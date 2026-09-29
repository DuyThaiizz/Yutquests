"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  FileText,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

type DraftMode = "question" | "discussion" | "material";
type Draft = {
  id: number;
  title: string;
  body: string;
  kind: string;
  link?: string;
  fileName?: string;
};

const sampleQuestions = [
  {
    kind: "grammar",
    tag: "NGỮ PHÁP",
    title: "Khi nào dùng -아/어 보다 thay vì -고 싶다?",
    answer:
      "-아/어 보다 diễn tả việc thử làm để trải nghiệm; -고 싶다 nói về mong muốn. 김치를 먹어 봤어요 là ‘Tôi đã thử ăn kimchi’.",
  },
  {
    kind: "topik",
    tag: "TOPIK",
    title: "Làm sao tìm ý chính của một đoạn đọc dài?",
    answer:
      "Đọc câu mở đầu và câu kết trước, gạch chân từ lặp lại, rồi loại lựa chọn chỉ nhắc đến một chi tiết nhỏ.",
  },
  {
    kind: "culture",
    tag: "VĂN HÓA",
    title: "Nói chuyện với người mới gặp nên dùng đuôi câu nào?",
    answer:
      "-아요/-어요 lịch sự và tự nhiên trong nhiều tình huống thường ngày. Khi cần trang trọng hơn, cân nhắc -ㅂ니다/-습니다.",
  },
];

const sampleDiscussions = [
  {
    kind: "culture",
    category: "Văn hóa · 서울의 하루",
    title: "Một buổi chiều ở thư viện Seoul sẽ có gì?",
    body: "Góc đọc nhìn ra thành phố, những chiếc bàn chung yên tĩnh và cả thói quen học rất riêng của mọi người.",
  },
  {
    kind: "study",
    category: "Góc học · TOPIK",
    title: "Ba cách mình ghi lại từ vựng trong bài đọc",
    body: "Chọn từ theo ngữ cảnh, viết câu của riêng mình và gặp lại từ đó qua bộ thẻ mỗi tuần.",
  },
  {
    kind: "culture",
    category: "Văn hóa · ẩm thực",
    title: "Một món Hàn bạn muốn thử nấu là gì?",
    body: "Không cần công thức hoàn hảo. Kể về hương vị, nguyên liệu và câu chuyện gắn với món ăn đó.",
  },
];

const resources = [
  {
    kind: "vocab",
    tone: "blue",
    korean: "단어",
    type: "TỦ SÁCH HIỆN CÓ · TỪ VỰNG",
    title: "Kho từ vựng TOPIK II Hàn–Anh",
    body: "Tra cứu từ theo trang nguồn và lưu vào sổ từ của bạn.",
    href: "/library?tab=vocabulary",
    action: "Mở tủ sách",
  },
  {
    kind: "grammar",
    tone: "yellow",
    korean: "문법",
    type: "TỦ SÁCH HIỆN CÓ · NGỮ PHÁP",
    title: "Ngữ pháp TOPIK II kèm bài luyện",
    body: "Đọc cấu trúc và luyện 148 câu trắc nghiệm theo từng lượt.",
    href: "/grammar",
    action: "Học ngữ pháp",
  },
  {
    kind: "topik",
    tone: "pink",
    korean: "읽기",
    type: "TỦ SÁCH HIỆN CÓ · ÔN THI",
    title: "Luyện TOPIK theo từng dạng",
    body: "Chọn dạng đọc hiểu, làm bài và xem lời giải sau khi nộp.",
    href: "/topik",
    action: "Bắt đầu ôn",
  },
] as const;

const composeOptions: Record<DraftMode, { value: string; label: string }[]> = {
  question: [
    { value: "grammar", label: "Ngữ pháp" },
    { value: "topik", label: "Ôn TOPIK" },
    { value: "culture", label: "Văn hóa Hàn Quốc" },
  ],
  discussion: [
    { value: "culture", label: "Văn hóa Hàn Quốc" },
    { value: "study", label: "Cách học tiếng Hàn" },
  ],
  material: [
    { value: "vocab", label: "Từ vựng" },
    { value: "grammar", label: "Ngữ pháp" },
    { value: "topik", label: "Ôn TOPIK" },
  ],
};

const composeTitles: Record<DraftMode, string> = {
  question: "Thử đặt câu hỏi",
  discussion: "Thử viết bài chia sẻ",
  material: "Thử chia sẻ tài liệu",
};

export function SeoulHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [postFilter, setPostFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [mode, setMode] = useState<DraftMode>("discussion");
  const [drafts, setDrafts] = useState<Record<DraftMode, Draft[]>>({
    question: [],
    discussion: [],
    material: [],
  });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [toast, setToast] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleQuestions = [
    ...drafts.question.map((draft) => ({
      kind: draft.kind,
      tag: "BẢN NHÁP",
      title: draft.title,
      answer: draft.body,
    })),
    ...sampleQuestions,
  ].filter((question) =>
    `${question.title} ${question.answer} ${question.tag}`
      .toLocaleLowerCase("vi")
      .includes(questionSearch.trim().toLocaleLowerCase("vi")),
  );

  function openCompose(nextMode: DraftMode) {
    setMode(nextMode);
    formRef.current?.reset();
    dialogRef.current?.showModal();
  }

  function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();
    if (!title || !body) return;
    const file = data.get("file");
    const draft: Draft = {
      id: Date.now(),
      title,
      body,
      kind: String(data.get("kind") ?? ""),
      link: String(data.get("link") ?? "").trim(),
      fileName: file instanceof File ? file.name : "",
    };
    setDrafts((current) => ({ ...current, [mode]: [draft, ...current[mode]] }));
    if (mode === "question") setQuestionSearch("");
    if (mode === "discussion") setPostFilter("all");
    if (mode === "material") setResourceFilter("all");
    dialogRef.current?.close();
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 5000);
    requestAnimationFrame(() =>
      document
        .getElementById(
          mode === "question"
            ? "questions"
            : mode === "discussion"
              ? "community"
              : "materials",
        )
        ?.scrollIntoView({ block: "start" }),
    );
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setChatMessages((current) => [...current, message]);
    setChatInput("");
  }

  return (
    <div className="seoul-home" id="home">
      <a className="skip-link" href="#content">
        Đến nội dung chính
      </a>
      <div className="preview-ribbon">
        <span className="preview-dot" /> CỘNG ĐỒNG ĐANG THỬ NGHIỆM
        <span className="preview-ribbon-detail">
          Các bài đăng thử chỉ hiện trên thiết bị của bạn
        </span>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Hanmori, về đầu trang">
          <span className="wordmark-flower" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            hanmori<small>한모리</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          className={`site-nav ${menuOpen ? "open" : ""}`}
          id="site-nav"
          aria-label="Điều hướng trang chủ"
        >
          <a href="#about" onClick={() => setMenuOpen(false)}>
            Hanmori là gì?
          </a>
          <a href="#questions" onClick={() => setMenuOpen(false)}>
            Hỏi đáp
          </a>
          <a href="#community" onClick={() => setMenuOpen(false)}>
            Cộng đồng
          </a>
          <a href="#materials" onClick={() => setMenuOpen(false)}>
            Tài liệu
          </a>
        </nav>
        <Link className="header-cta" href="/dashboard">
          Vào góc học tập <ArrowRight />
        </Link>
      </header>

      <main id="content">
        <section className="hero" aria-labelledby="hero-title">
          <div
            className="hero-image"
            role="img"
            aria-label="Đồng hoa mùa xuân nhìn về Seoul và tháp Namsan"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-korean" lang="ko">
              안녕, 여기서 만나요
            </p>
            <h1 id="hero-title">
              Một góc Hàn Quốc,
              <br />
              <em>rất gần bạn.</em>
            </h1>
            <p className="hero-summary">
              Học tiếng Hàn, hỏi điều bạn chưa hiểu, kể chuyện văn hóa và trao
              nhau những tài liệu hay — tất cả trong một ngôi nhà chung.
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#about">
                Khám phá Hanmori <ArrowRight />
              </a>
              <Link className="hero-secondary" href="/dashboard">
                Đi tới bài học <ArrowUpRight />
              </Link>
            </div>
          </div>
          <div className="hero-location">
            <span className="location-line" />
            <span>서울 · SEOUL</span>
            <small>Namsan trong một chiều mùa xuân</small>
          </div>
          <a className="scroll-prompt" href="#about">
            Cuộn để khám phá <span />
          </a>
        </section>

        <section
          className="welcome-section section-wrap"
          id="about"
          aria-labelledby="welcome-heading"
        >
          <div className="section-header">
            <span className="section-label">HANMORI DÀNH CHO BẠN</span>
            <h2 id="welcome-heading">
              Học một ngôn ngữ.
              <br />
              <em>Mở thêm nhiều câu chuyện.</em>
            </h2>
            <p>
              Hanmori đặt bài học có lộ trình bên cạnh một không gian để hỏi,
              chia sẻ và cùng tiến bộ. Bạn có thể bắt đầu từ một bài học nhỏ,
              rồi mở rộng câu chuyện với mọi người.
            </p>
          </div>
          <div className="welcome-rail" aria-label="Ba cách sử dụng Hanmori">
            <Link href="/dashboard" className="welcome-item">
              <span className="welcome-icon sky">
                <BookOpen />
              </span>
              <span>
                <strong>Học theo nhịp riêng</strong>
                <small>Từ vựng, ngữ pháp, flashcard và ôn TOPIK.</small>
              </span>
              <ArrowUpRight className="item-arrow" />
            </Link>
            <a href="#questions" className="welcome-item">
              <span className="welcome-icon rose">
                <MessageCircle />
              </span>
              <span>
                <strong>Hỏi để hiểu sâu</strong>
                <small>Thử khu hỏi đáp với những điều bạn đang thắc mắc.</small>
              </span>
              <ArrowRight className="item-arrow" />
            </a>
            <a href="#materials" className="welcome-item">
              <span className="welcome-icon butter">
                <FileText />
              </span>
              <span>
                <strong>Chia sẻ điều hữu ích</strong>
                <small>
                  Khám phá tài liệu học và thử tạo bản nháp chia sẻ.
                </small>
              </span>
              <ArrowRight className="item-arrow" />
            </a>
          </div>
        </section>

        <section
          className="qa-section"
          id="questions"
          aria-labelledby="qa-heading"
        >
          <div className="section-wrap qa-grid">
            <div className="qa-copy">
              <span className="section-label">HỎI & HIỂU</span>
              <h2 id="qa-heading">
                Có câu hỏi?
                <br />
                <em>Cùng tìm câu trả lời.</em>
              </h2>
              <p>
                Một mẫu không gian để hỏi về từ vựng, ngữ pháp hay cách ôn thi.
                Câu hỏi rõ ràng giúp mọi người cùng học được nhiều hơn.
              </p>
              <button
                className="button button-ink"
                type="button"
                onClick={() => openCompose("question")}
              >
                Thử đặt câu hỏi <Plus />
              </button>
              <span className="preview-caption">
                Bài thử chỉ hiện trong phiên này; chưa được đăng công khai.
              </span>
            </div>
            <div className="qa-board">
              <div className="board-top">
                <span>CÂU HỎI MẪU</span>
                <span lang="ko">궁금한 점이 있나요?</span>
              </div>
              <label className="qa-search">
                <Search />
                <span className="sr-only">Tìm câu hỏi mẫu</span>
                <input
                  type="search"
                  value={questionSearch}
                  onChange={(event) => setQuestionSearch(event.target.value)}
                  placeholder="Tìm trong câu hỏi mẫu..."
                />
              </label>
              <div className="question-list">
                {visibleQuestions.map((question, index) => (
                  <details
                    className="question"
                    key={`${question.title}-${index}`}
                  >
                    <summary>
                      <span className={`topic-tag ${question.kind}`}>
                        {question.tag}
                      </span>
                      <strong>{question.title}</strong>
                      <ChevronDown />
                    </summary>
                    <p>{question.answer}</p>
                  </details>
                ))}
              </div>
              {visibleQuestions.length === 0 && (
                <p className="empty-message">
                  Chưa có câu hỏi phù hợp. Hãy thử từ khóa khác.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          className="community-section"
          id="community"
          aria-labelledby="community-heading"
        >
          <div className="section-wrap">
            <div className="community-head">
              <div>
                <span className="section-label light-label">
                  NHỮNG CÂU CHUYỆN QUANH TA
                </span>
                <h2 id="community-heading">
                  Seoul ở ngoài kia.
                  <br />
                  <em>Câu chuyện ở đây.</em>
                </h2>
                <p>
                  Một nơi để hỏi kinh nghiệm học, kể điều thú vị về văn hóa Hàn
                  Quốc và trò chuyện cùng người có chung sự tò mò.
                </p>
              </div>
              <button
                className="button button-pink"
                type="button"
                onClick={() => openCompose("discussion")}
              >
                Thử viết bài chia sẻ <Plus />
              </button>
            </div>
            <div className="community-layout">
              <div className="discussion-column">
                <div
                  className="discussion-tabs"
                  role="group"
                  aria-label="Lọc bài viết mẫu"
                >
                  {[
                    ["all", "Tất cả"],
                    ["culture", "Văn hóa"],
                    ["study", "Góc học"],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={postFilter === value ? "active" : ""}
                      aria-pressed={postFilter === value}
                      onClick={() => setPostFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="discussion-list">
                  {drafts.discussion
                    .filter(
                      (draft) =>
                        postFilter === "all" || draft.kind === postFilter,
                    )
                    .map((draft) => (
                      <article className="discussion draft" key={draft.id}>
                        <div className="discussion-meta">
                          <span className="sample-badge">BẢN NHÁP</span>
                          <span>
                            {draft.kind === "culture" ? "Văn hóa" : "Góc học"} ·
                            chỉ xem thử
                          </span>
                        </div>
                        <h3>{draft.title}</h3>
                        <p>{draft.body}</p>
                      </article>
                    ))}
                  {sampleDiscussions
                    .filter(
                      (post) =>
                        postFilter === "all" || post.kind === postFilter,
                    )
                    .map((post) => (
                      <article className="discussion" key={post.title}>
                        <div className="discussion-meta">
                          <span className="sample-badge">BÀI MẪU</span>
                          <span>{post.category}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                        <div className="discussion-footer">
                          <span>Gợi ý mở cuộc trò chuyện</span>
                          <ArrowUpRight />
                        </div>
                      </article>
                    ))}
                </div>
              </div>
              <aside className="chat-card" aria-labelledby="chat-heading">
                <div className="chat-head">
                  <span className="chat-indicator" />
                  <div>
                    <strong id="chat-heading">Phòng trò chuyện</strong>
                    <small>Mô phỏng trên thiết bị</small>
                  </div>
                  <span lang="ko">수다방</span>
                </div>
                <div className="chat-messages" aria-live="polite">
                  <div className="message">
                    <span className="message-avatar aqua">하</span>
                    <p>
                      <b>Hanmori mẫu</b>Hôm nay bạn học được từ Hàn nào hay?
                    </p>
                  </div>
                  <div className="message">
                    <span className="message-avatar pink">봄</span>
                    <p>
                      <b>Người học mẫu</b>Mình thích 봄 — nghe giống mùa xuân
                      trong ảnh này.
                    </p>
                  </div>
                  <div className="message">
                    <span className="message-avatar aqua">하</span>
                    <p>
                      <b>Hanmori mẫu</b>Hay quá! 봄 nghĩa là mùa xuân.
                    </p>
                  </div>
                  {chatMessages.map((message, index) => (
                    <div className="message mine" key={index}>
                      <span className="message-avatar pink">나</span>
                      <p>
                        <b>Bạn · chỉ xem thử</b>
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
                <form className="chat-form" onSubmit={submitChat}>
                  <label className="sr-only" htmlFor="home-chat-input">
                    Tin nhắn thử
                  </label>
                  <input
                    id="home-chat-input"
                    maxLength={160}
                    placeholder="Viết thử một lời chào..."
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    required
                  />
                  <button type="submit" aria-label="Thêm tin nhắn thử">
                    <Send />
                  </button>
                </form>
                <p className="chat-disclaimer">
                  Tin nhắn chỉ hiện trong phiên này; không gửi cho ai.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="materials-section section-wrap"
          id="materials"
          aria-labelledby="materials-heading"
        >
          <div className="materials-top">
            <div>
              <span className="section-label">GÓP MỘT TRANG SÁCH</span>
              <h2 id="materials-heading">
                Tài liệu hay hơn
                <br />
                <em>khi được chia sẻ.</em>
              </h2>
            </div>
            <div className="materials-intro">
              <p>
                Khám phá tài liệu học đã có trong Hanmori. Bạn cũng có thể thử
                tạo bản nháp tài liệu cộng đồng; hiện chưa có chức năng tải lên.
              </p>
              <button
                className="text-button"
                type="button"
                onClick={() => openCompose("material")}
              >
                Thử chia sẻ tài liệu <ArrowRight />
              </button>
            </div>
          </div>
          <div
            className="resource-filters"
            role="group"
            aria-label="Lọc tài liệu"
          >
            {[
              ["all", "Tất cả"],
              ["vocab", "Từ vựng"],
              ["grammar", "Ngữ pháp"],
              ["topik", "Ôn TOPIK"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={resourceFilter === value ? "active" : ""}
                aria-pressed={resourceFilter === value}
                onClick={() => setResourceFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="resource-grid">
            {drafts.material
              .filter(
                (draft) =>
                  resourceFilter === "all" || draft.kind === resourceFilter,
              )
              .map((draft) => (
                <article
                  className={`resource-card resource-${draft.kind === "vocab" ? "blue" : draft.kind === "grammar" ? "yellow" : "pink"}`}
                  key={draft.id}
                >
                  <span className="resource-type">BẢN NHÁP · CHƯA TẢI LÊN</span>
                  <div className="resource-art">
                    <span lang="ko">
                      {draft.kind === "vocab"
                        ? "단어"
                        : draft.kind === "grammar"
                          ? "문법"
                          : "읽기"}
                    </span>
                    <FileText />
                  </div>
                  <strong>{draft.title}</strong>
                  <p>{draft.body}</p>
                  <span className="resource-link">
                    {draft.fileName
                      ? `Tệp xem trước: ${draft.fileName}`
                      : draft.link
                        ? `Nguồn dự kiến: ${draft.link}`
                        : "Chưa thêm tệp hoặc liên kết nguồn"}
                  </span>
                </article>
              ))}
            {resources
              .filter(
                (resource) =>
                  resourceFilter === "all" || resource.kind === resourceFilter,
              )
              .map((resource) => (
                <Link
                  href={resource.href}
                  className={`resource-card resource-${resource.tone}`}
                  key={resource.kind}
                >
                  <span className="resource-type">{resource.type}</span>
                  <div className="resource-art">
                    <span lang="ko">{resource.korean}</span>
                    <BookOpen />
                  </div>
                  <strong>{resource.title}</strong>
                  <p>{resource.body}</p>
                  <span className="resource-link">
                    {resource.action} <ArrowRight />
                  </span>
                </Link>
              ))}
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-heading">
          <div className="section-wrap faq-layout">
            <div>
              <span className="section-label">BẠN CÓ THỂ BẮT ĐẦU Ở ĐÂY</span>
              <h2 id="faq-heading">
                Một vài điều
                <br />
                <em>bạn có thể muốn biết.</em>
              </h2>
              <Link className="button button-ink" href="/dashboard">
                Vào góc học tập <ArrowRight />
              </Link>
            </div>
            <div className="faq-list">
              <details>
                <summary>
                  Hanmori hiện có gì để học?
                  <ChevronDown />
                </summary>
                <p>
                  Bạn có thể học từ vựng, ngữ pháp, ôn flashcard và luyện TOPIK
                  theo từng dạng. Các thẻ tài liệu dẫn tới phần học đang hoạt
                  động.
                </p>
              </details>
              <details>
                <summary>
                  Phần hỏi đáp và trò chuyện đã mở chưa?
                  <ChevronDown />
                </summary>
                <p>
                  Chưa. Bạn có thể thử giao diện với bài viết và tin nhắn trong
                  phiên này; nội dung chưa được đăng lên cộng đồng chung.
                </p>
              </details>
              <details>
                <summary>
                  Tôi có thể chia sẻ tài liệu ngay không?
                  <ChevronDown />
                </summary>
                <p>
                  Chức năng chia sẻ tài liệu cộng đồng đang được phát triển.
                  Biểu mẫu hiện chỉ tạo bản nháp xem thử; không tải tệp lên máy
                  chủ.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <div>
            <strong className="footer-brand">hanmori</strong>
            <p>Từng từ mới, từng cuộc trò chuyện, từng góc Seoul gần hơn.</p>
          </div>
          <div className="footer-links">
            <a href="#home">Về đầu trang</a>
            <Link href="/topik">Ôn TOPIK</Link>
            <Link href="/notebook/unknown">Sổ từ của tôi</Link>
          </div>
          <small>
            Phần học đã hoạt động · Cộng đồng hiện là bản thử trên thiết bị này
          </small>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className="compose-dialog"
        aria-labelledby="compose-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <form ref={formRef} onSubmit={submitDraft}>
          <div className="dialog-head">
            <div>
              <span className="section-label">DÙNG THỬ GIAO DIỆN</span>
              <h2 id="compose-title">{composeTitles[mode]}</h2>
            </div>
            <button
              type="button"
              className="dialog-close"
              aria-label="Đóng"
              onClick={() => dialogRef.current?.close()}
            >
              <X />
            </button>
          </div>
          <p className="dialog-description">
            Nội dung chỉ hiện trong phiên này; bài và tệp không được đăng hoặc
            tải lên.
          </p>
          <label>
            Tiêu đề
            <input
              name="title"
              maxLength={100}
              placeholder="Đặt một tiêu đề rõ ràng"
              required
            />
          </label>
          <label>
            {mode === "material" ? "Loại tài liệu" : "Chủ đề"}
            <select name="kind" key={mode}>
              {composeOptions[mode].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {mode === "material" && (
            <>
              <label>
                Liên kết nguồn tài liệu (không bắt buộc)
                <input name="link" type="url" placeholder="https://..." />
              </label>
              <label>
                Tệp tài liệu (không bắt buộc, không tải lên)
                <input
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
              </label>
            </>
          )}
          <label>
            Nội dung
            <textarea
              name="body"
              rows={5}
              maxLength={800}
              placeholder="Chia sẻ điều bạn muốn mọi người biết..."
              required
            />
          </label>
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-outline"
              onClick={() => dialogRef.current?.close()}
            >
              Hủy
            </button>
            <button type="submit" className="button button-ink">
              Xem bản nháp <ArrowRight />
            </button>
          </div>
        </form>
      </dialog>
      {toast && (
        <div className="draft-toast" role="status">
          Bản nháp đã hiện trong mục tương ứng. Nội dung chưa được đăng.
        </div>
      )}
    </div>
  );
}
