export type WritingGap = "ㄱ" | "ㄴ";

export interface WritingExercise {
  id: string;
  kind: 51 | 52;
  number: number;
  title: string;
  prompt?: string;
  image?: string;
  sourceImage?: string;
  source: string;
  page: number;
  answerPage?: number;
  answerImage?: string;
  answerSource?: string;
  answers: Record<WritingGap, string>;
  explanations: Record<WritingGap, string>;
  grammar: string[];
  reviewNote?: string;
}

export type WritingPrompt = Pick<
  WritingExercise,
  | "id"
  | "kind"
  | "number"
  | "title"
  | "prompt"
  | "image"
  | "sourceImage"
  | "source"
  | "page"
  | "grammar"
  | "reviewNote"
>;
export function publicWritingPrompt(item: WritingExercise): WritingPrompt {
  return {
    id: item.id,
    kind: item.kind,
    number: item.number,
    title: item.title,
    prompt: item.prompt,
    image: item.image,
    sourceImage: item.sourceImage,
    source: item.source,
    page: item.page,
    grammar: item.grammar,
    reviewNote: item.reviewNote,
  };
}

export interface GrammarPoint {
  id: string;
  form: string;
  meaning: string;
  use: string;
  example: string;
  kind: "51" | "52" | "51·52";
  source: string;
}

export const grammarPoints: GrammarPoint[] = [
  {
    id: "polite",
    form: "-습니다 / -ㅂ니다",
    meaning: "Đuôi trần thuật trang trọng",
    use: "Thông báo, email và thư gửi người lớn ở câu 51.",
    example: "다음 주부터 공사를 진행합니다.",
    kind: "51",
    source: "Quy tắc chia đuôi câu viết.pdf · tr. 1",
  },
  {
    id: "request",
    form: "-아/어 주십시오 · -아/어 주세요",
    meaning: "Vui lòng làm…",
    use: "Đề nghị một hành động cụ thể, giữ mức lịch sự phù hợp người nhận.",
    example: "확인 후 답장을 보내 주십시오.",
    kind: "51",
    source: "huongiu 50 câu 51 · tr. 10",
  },
  {
    id: "wish",
    form: "-기 바랍니다",
    meaning: "Mong / đề nghị…",
    use: "Kết lời thông báo hoặc hướng dẫn bằng giọng trang trọng.",
    example: "많은 참여 바랍니다.",
    kind: "51",
    source: "huongiu 50 câu 51 · tr. 2",
  },
  {
    id: "if",
    form: "-(으)면 · -다면",
    meaning: "Nếu… thì…",
    use: "Đặt điều kiện cho lời khuyên hoặc kết quả; chú ý 받침 khi chia.",
    example: "시간이 있으면 연락해 주세요.",
    kind: "51·52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 4",
  },
  {
    id: "because",
    form: "-기 때문이다",
    meaning: "Bởi vì…",
    use: "Giải thích nguyên nhân cho nhận định ở câu trước; thường kết đoạn câu 52.",
    example: "습도가 높기 때문이다.",
    kind: "52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 2",
  },
  {
    id: "therefore",
    form: "그래서 · 따라서",
    meaning: "Vì vậy / do đó",
    use: "Chuyển từ nguyên nhân sang hệ quả hoặc khuyến nghị.",
    example: "따라서 그늘진 곳에 보관해야 한다.",
    kind: "52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 1",
  },
  {
    id: "contrast",
    form: "그러나 · 반면에 · -지만",
    meaning: "Tuy nhiên / trái lại",
    use: "Đặt thông tin đối lập; đọc hai câu quanh chỗ trống để tìm hướng lập luận.",
    example: "그러나 운동을 많이 한다고 해서 건강해지는 것은 아니다.",
    kind: "52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 1",
  },
  {
    id: "plain",
    form: "-ㄴ/는다 · -다 · -(이)다",
    meaning: "Đuôi văn viết khách quan",
    use: "Câu 52 là đoạn giải thích; không dùng đuôi lịch sự -습니다 nếu cả đoạn theo thể -다.",
    example: "물은 운동 효과를 높이는 역할을 한다.",
    kind: "52",
    source: "Quy tắc chia đuôi câu viết.pdf · tr. 1",
  },
  {
    id: "can",
    form: "-(으)ㄹ 수 있다 / 없다",
    meaning: "Có thể / không thể",
    use: "Diễn tả khả năng, quyền hoặc kết quả tùy tình huống.",
    example: "멀리 날아갈 수 없다.",
    kind: "51·52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 2",
  },
  {
    id: "should",
    form: "-아/어야 한다 · -는 것이 좋다",
    meaning: "Phải / nên",
    use: "Kết luận bằng lời khuyên từ nguyên nhân đã nêu.",
    example: "뚜껑을 닫아야 한다.",
    kind: "51·52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 2–3",
  },
  {
    id: "purpose",
    form: "-기 위해(서) · -도록",
    meaning: "Để / sao cho",
    use: "Nối mục đích với hành động cần thực hiện.",
    example: "사고를 막기 위해서 조심해야 한다.",
    kind: "51·52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 3",
  },
  {
    id: "nominal",
    form: "-는 것 · -기",
    meaning: "Danh từ hóa hành động",
    use: "Biến một hành động thành chủ ngữ, tân ngữ hoặc bổ ngữ.",
    example: "운동을 하는 것이 좋다.",
    kind: "52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 3",
  },
  {
    id: "change",
    form: "-게 되다 · -게 하다",
    meaning: "Trở nên / khiến cho",
    use: "Phân biệt thay đổi tự nhiên với tác động gây ra thay đổi.",
    example: "불편함을 느끼게 된다.",
    kind: "52",
    source: "TỔNG HỢP 쓰기 52.pdf · tr. 1–3",
  },
  {
    id: "notinstead",
    form: "-지 말고",
    meaning: "Đừng… mà hãy…",
    use: "Đặt cách làm nên tránh trước lựa chọn phù hợp.",
    example: "햇빛에 보관하지 말고 그늘에 보관해야 한다.",
    kind: "52",
    source: "PHƯƠNG PHÁP 쓰기 52.pdf · tr. 4",
  },
];
