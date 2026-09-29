export type GrammarTopicId =
  "connections" | "conditions" | "observations" | "expression";

export interface GrammarTopic {
  id: GrammarTopicId;
  label: string;
  korean: string;
  description: string;
}

export interface GrammarChoice {
  text: string;
  reason: string;
}

export interface GrammarQuizItem {
  id: string;
  pattern: string;
  translation: string;
  source: { document: string; location: string };
  quiz: {
    sentence: string;
    choices: readonly GrammarChoice[];
    correct: number;
  };
}

export interface GrammarLesson extends GrammarQuizItem {
  topic: GrammarTopicId;
  meaning: string;
  usage: string;
  example: string;
  tip: string;
}

export const grammarTopics: readonly GrammarTopic[] = [
  {
    id: "connections",
    label: "Nối ý & lựa chọn",
    korean: "연결",
    description: "Diễn đạt việc tiện thể làm, liệt kê hoặc lựa chọn.",
  },
  {
    id: "conditions",
    label: "Điều kiện & kết quả",
    korean: "조건",
    description: "Phân biệt giả định, quy luật và khả năng xấu.",
  },
  {
    id: "observations",
    label: "Quan sát & suy đoán",
    korean: "관찰",
    description: "Nói về điều bạn thấy, nhớ và dự đoán.",
  },
  {
    id: "expression",
    label: "Lời nói & thái độ",
    korean: "표현",
    description: "Dẫn lời, nhấn mạnh và nói về cách làm một việc.",
  },
];

// Examples and questions are editorial adaptations, not a transcription of the attached decks.
// The source position lets a learner check each concept against the original material.
export const grammarLessons: readonly GrammarLesson[] = [
  {
    id: "gim-e",
    topic: "connections",
    pattern: "-는 김에",
    meaning: "Nhân tiện làm A, làm luôn B",
    usage:
      "Gắn sau động từ chỉ việc đã định làm. Việc B được làm thêm trong cùng dịp.",
    example: "도서관에 가는 김에 책도 반납할게요.",
    translation: "Nhân tiện đến thư viện, tôi sẽ trả sách luôn.",
    tip: "A là dịp có sẵn; B là việc tiện thể làm thêm.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 5" },
    quiz: {
      sentence: "은행에 가는 ___ 우체국에도 들를게요.",
      correct: 0,
      choices: [
        {
          text: "김에",
          reason: "Đúng: đã đến ngân hàng thì tiện ghé bưu điện.",
        },
        {
          text: "더니",
          reason:
            "-더니 nối điều quan sát trong quá khứ với kết quả, không diễn đạt nhân tiện.",
        },
        {
          text: "치고",
          reason: "-치고 nói về ngoại lệ so với một nhóm, không nối hai việc.",
        },
        {
          text: "텐데",
          reason:
            "-(으)ㄹ 텐데 thể hiện dự đoán hoặc tiếc nuối, không phải việc làm thêm.",
        },
      ],
    },
  },
  {
    id: "dadeunga",
    topic: "connections",
    pattern: "-는다든가 / -ㄴ다든가",
    meaning: "Chẳng hạn như A hoặc B",
    usage: "Liệt kê vài hành động tiêu biểu, không cần kể hết mọi khả năng.",
    example: "쉬는 날에는 책을 읽는다든가 영화를 봐요.",
    translation: "Ngày nghỉ tôi đọc sách hoặc xem phim chẳng hạn.",
    tip: "Dùng khi nêu ví dụ, khác với -든지 vốn nhấn vào việc chọn cách nào cũng được.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 1" },
    quiz: {
      sentence: "주말에는 요리를 ___ 산책을 해요.",
      correct: 1,
      choices: [
        {
          text: "하더니",
          reason:
            "-더니 cần một sự quan sát rồi tới kết quả; câu này liệt kê hoạt động.",
        },
        {
          text: "한다든가",
          reason: "Đúng: 요리를 한다든가 là một ví dụ hoạt động cuối tuần.",
        },
        {
          text: "할 걸 그랬다",
          reason: "Cấu trúc này diễn đạt tiếc vì đã không làm trong quá khứ.",
        },
        {
          text: "하는 수가 있다",
          reason: "-는 수가 있다 nêu khả năng, thường là điều không mong muốn.",
        },
      ],
    },
  },
  {
    id: "deunji",
    topic: "connections",
    pattern: "-든지 … -든지",
    meaning: "Dù A hay B đều được",
    usage:
      "Đưa ra các lựa chọn mà kết luận không đổi hoặc người nghe có thể tự chọn.",
    example: "버스를 타든지 지하철을 타든지 제시간에 오세요.",
    translation: "Dù đi xe buýt hay tàu điện, hãy đến đúng giờ.",
    tip: "Chú ý âm -든지 (lựa chọn), không viết nhầm thành -던지.",
    source: { document: "NYS 4 – Nhóm ngữ pháp", location: "slide 5" },
    quiz: {
      sentence: "차를 마시___ 물을 마시___ 편한 대로 하세요.",
      correct: 2,
      choices: [
        {
          text: "더니 / 더니",
          reason: "-더니 diễn đạt quan sát và biến đổi, không đưa ra lựa chọn.",
        },
        {
          text: "다니까 / 다니까",
          reason: "-다니까 dẫn lời để làm lý do, không có nghĩa ‘dù cái nào’.",
        },
        {
          text: "든지 / 든지",
          reason: "Đúng: cả hai đồ uống đều là lựa chọn được chấp nhận.",
        },
        {
          text: "치고 / 치고",
          reason: "-치고 đi với danh từ để nói ngoại lệ hoặc tiêu chuẩn nhóm.",
        },
      ],
    },
  },
  {
    id: "gahamyeon",
    topic: "connections",
    pattern: "-는가 하면 / -(으)ㄴ가 하면",
    meaning: "Có … thì lại có …",
    usage: "Đặt hai trường hợp song song, thường có nét đối lập hoặc bổ sung.",
    example:
      "한국어 발음이 어렵다는 사람이 있는가 하면 문법이 어렵다는 사람도 있어요.",
    translation: "Có người thấy phát âm khó, lại có người thấy ngữ pháp khó.",
    tip: "Sau vế đầu thường có một trường hợp khác để đối chiếu.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 9" },
    quiz: {
      sentence: "아침에 공부하는 사람이 있는___ 밤에 공부하는 사람도 있어요.",
      correct: 0,
      choices: [
        {
          text: "가 하면",
          reason: "Đúng: hai nhóm người được đặt cạnh nhau để so sánh.",
        },
        {
          text: "김에",
          reason: "-는 김에 cần một việc chính và một việc làm thêm.",
        },
        {
          text: "걸 그랬다",
          reason: "Cấu trúc này nói về sự hối tiếc của người nói.",
        },
        {
          text: "수가 있다",
          reason:
            "-는 수가 있다 nói về khả năng xảy ra, không so sánh hai nhóm.",
        },
      ],
    },
  },
  {
    id: "dago-haedo",
    topic: "conditions",
    pattern: "-다고 해도 / -ㄴ다고 해도",
    meaning: "Dù cho … thì vẫn …",
    usage:
      "Thừa nhận một điều kiện nhưng khẳng định kết quả ở vế sau không đổi.",
    example: "시간이 없다고 해도 아침은 먹어야 해요.",
    translation: "Dù không có thời gian, bạn vẫn nên ăn sáng.",
    tip: "Vế sau thường trái với điều người ta dự đoán từ vế trước.",
    source: { document: "NYS 4 – Nhóm ngữ pháp", location: "slide 4" },
    quiz: {
      sentence: "시험이 어렵___ 끝까지 풀어 보세요.",
      correct: 1,
      choices: [
        {
          text: "더니",
          reason: "-더니 nêu điều từng quan sát, không có nghĩa ‘dù’.",
        },
        { text: "다고 해도", reason: "Đúng: dù đề khó vẫn làm đến hết." },
        {
          text: "는 김에",
          reason: "-는 김에 là ‘nhân tiện’, không diễn tả nhượng bộ.",
        },
        {
          text: "는 둥 마는 둥",
          reason: "Cấu trúc này diễn tả làm qua loa, không nối điều kiện.",
        },
      ],
    },
  },
  {
    id: "deoramyeon",
    topic: "conditions",
    pattern: "-았/었더라면",
    meaning: "Nếu lúc đó đã … thì …",
    usage:
      "Giả định trái với chuyện đã xảy ra trong quá khứ; vế sau thường là kết quả khác.",
    example: "일찍 출발했더라면 기차를 놓치지 않았을 거예요.",
    translation: "Nếu xuất phát sớm thì đã không lỡ tàu.",
    tip: "Mốc thời gian là quá khứ, khác với điều kiện mở ở hiện tại hoặc tương lai.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 7" },
    quiz: {
      sentence: "우산을 가져갔___ 비를 맞지 않았을 텐데요.",
      correct: 2,
      choices: [
        {
          text: "다니까",
          reason: "-다니까 dẫn lời, không đặt giả định ngược quá khứ.",
        },
        {
          text: "는 김에",
          reason: "-는 김에 diễn đạt nhân tiện làm thêm một việc.",
        },
        {
          text: "더라면",
          reason: "Đúng: giả định đã mang ô, nên đã không bị ướt.",
        },
        {
          text: "는가 하면",
          reason: "Cấu trúc này đối chiếu hai trường hợp cùng tồn tại.",
        },
      ],
    },
  },
  {
    id: "maryeon",
    topic: "conditions",
    pattern: "-게 마련이다",
    meaning: "Vốn dĩ / thường sẽ …",
    usage: "Nêu kết quả được xem là tự nhiên hoặc dễ xảy ra theo quy luật.",
    example: "처음에는 누구나 실수하게 마련이에요.",
    translation: "Lúc mới bắt đầu, ai cũng thường mắc lỗi.",
    tip: "Không dùng để kể một lần xảy ra ngẫu nhiên.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 6" },
    quiz: {
      sentence: "매일 같은 음식만 먹으면 질리___이에요.",
      correct: 3,
      choices: [
        {
          text: "는 김",
          reason: "-는 김에 cần một hành động làm dịp để làm việc khác.",
        },
        {
          text: "던가",
          reason:
            "-던가요 là câu hỏi gợi nhớ trải nghiệm, không phải quy luật.",
        },
        { text: "다고", reason: "-다고 đơn lẻ không tạo ý ‘tất nhiên sẽ’." },
        { text: "게 마련", reason: "Đúng: ăn mãi một món thì thường sẽ chán." },
      ],
    },
  },
  {
    id: "suga-itda",
    topic: "conditions",
    pattern: "-는 수가 있다",
    meaning: "Có thể sẽ … (điều không hay)",
    usage:
      "Cảnh báo một hậu quả có khả năng xảy ra, thường sau thói quen hoặc hành động bất cẩn.",
    example: "계속 무리하면 건강이 나빠지는 수가 있어요.",
    translation: "Nếu cứ quá sức thì sức khỏe có thể xấu đi.",
    tip: "Không dùng để khẳng định chắc chắn hậu quả sẽ xảy ra.",
    source: {
      document: "4B연습.pdf",
      location: "trang 23, câu 12 và trang 24, câu 15",
    },
    quiz: {
      sentence: "너무 급하게 먹으면 체하___ 있어요.",
      correct: 0,
      choices: [
        { text: "는 수가", reason: "Đúng: ăn vội có nguy cơ khó tiêu." },
        {
          text: "는 김에",
          reason: "-는 김에 có nghĩa nhân tiện, không cảnh báo hậu quả.",
        },
        { text: "던가", reason: "-던가요 hỏi về trải nghiệm quá khứ." },
        {
          text: "다든가",
          reason: "-다든가 dùng để liệt kê ví dụ, không nêu rủi ro.",
        },
      ],
    },
  },
  {
    id: "deoni",
    topic: "observations",
    pattern: "-더니",
    meaning: "Thấy A rồi sau đó B",
    usage:
      "Nối điều người nói từng quan sát với sự thay đổi hoặc kết quả tiếp theo.",
    example: "아침에는 흐리더니 오후에는 맑아졌어요.",
    translation: "Sáng còn âm u, đến chiều trời đã quang.",
    tip: "Vế đầu là điều đã được chứng kiến, không phải giả định.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 2" },
    quiz: {
      sentence: "어제는 춥___ 오늘은 따뜻하네요.",
      correct: 1,
      choices: [
        {
          text: "다고 해도",
          reason:
            "-다고 해도 là ‘dù cho’, không nhấn mạnh sự thay đổi được quan sát.",
        },
        {
          text: "더니",
          reason:
            "Đúng: người nói đối chiếu thời tiết đã thấy hôm qua với hôm nay.",
        },
        { text: "는 김에", reason: "-는 김에 chỉ việc làm nhân tiện." },
        {
          text: "는 수가 있다",
          reason: "-는 수가 있다 nêu nguy cơ, không kể sự chuyển biến.",
        },
      ],
    },
  },
  {
    id: "ryeona",
    topic: "observations",
    pattern: "-(으)려나 보다",
    meaning: "Có lẽ sắp …",
    usage: "Dựa vào dấu hiệu hiện tại để đoán một việc sắp xảy ra.",
    example: "하늘이 어두운 걸 보니 비가 오려나 봐요.",
    translation: "Thấy trời tối, chắc sắp mưa.",
    tip: "Mang sắc thái phỏng đoán, chưa chắc chắn như một sự thật đã xảy ra.",
    source: { document: "NYS 4 – Nhóm ngữ pháp", location: "slide 2" },
    quiz: {
      sentence: "사람들이 우산을 펴네요. 비가 오___ 봐요.",
      correct: 2,
      choices: [
        {
          text: "던가",
          reason: "-던가요 dùng để hỏi về trải nghiệm trong quá khứ.",
        },
        {
          text: "는 김에",
          reason: "-는 김에 là ‘nhân tiện’, không suy đoán từ dấu hiệu.",
        },
        {
          text: "려나",
          reason: "Đúng: dựa vào ô đang được mở để đoán trời sắp mưa.",
        },
        {
          text: "다든가",
          reason: "-다든가 liệt kê các ví dụ, không nêu phỏng đoán.",
        },
      ],
    },
  },
  {
    id: "deongayo",
    topic: "observations",
    pattern: "-던가요?",
    meaning: "… thế nào nhỉ?",
    usage:
      "Hỏi người khác về điều họ đã trải nghiệm hoặc chứng kiến trong quá khứ.",
    example: "어제 본 공연은 재미있던가요?",
    translation: "Buổi diễn bạn xem hôm qua có hay không?",
    tip: "Thường hỏi điều người nghe đã trực tiếp trải qua.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 14" },
    quiz: {
      sentence: "지난주에 간 전시회는 재미있___?",
      correct: 0,
      choices: [
        {
          text: "던가요",
          reason: "Đúng: hỏi người đã đi xem triển lãm tuần trước.",
        },
        {
          text: "으려나 봐요",
          reason:
            "Cấu trúc này dự đoán tương lai gần, không hỏi chuyện đã trải nghiệm.",
        },
        { text: "는 김에", reason: "-는 김에 là việc làm thêm nhân tiện." },
        {
          text: "는 수가 있어요",
          reason: "-는 수가 있다 cảnh báo khả năng xảy ra.",
        },
      ],
    },
  },
  {
    id: "geol-geuraetda",
    topic: "observations",
    pattern: "-(으)ㄹ 걸 그랬다",
    meaning: "Đáng lẽ nên …",
    usage: "Tiếc về việc bản thân đã không làm trong quá khứ.",
    example: "어제 일찍 잘 걸 그랬어요.",
    translation: "Đáng lẽ hôm qua tôi nên đi ngủ sớm.",
    tip: "Đừng dùng để đưa ra kế hoạch còn ở tương lai.",
    source: { document: "4B연습.pdf", location: "trang 5, câu 12" },
    quiz: {
      sentence: "시험 전에 더 복습할 ___ 그랬어요.",
      correct: 3,
      choices: [
        {
          text: "김에",
          reason: "-는 김에 diễn đạt tiện thể làm thêm, không hối tiếc.",
        },
        {
          text: "더니",
          reason: "-더니 nối quan sát với kết quả, không nói ‘đáng lẽ’.",
        },
        {
          text: "수가",
          reason:
            "-는 수가 있다 nêu khả năng hậu quả, không diễn đạt tiếc nuối.",
        },
        { text: "걸", reason: "Đúng: người nói tiếc vì đã không ôn kỹ hơn." },
      ],
    },
  },
  {
    id: "danikka",
    topic: "expression",
    pattern: "-다니까 / -ㄴ다니까 / -는다니까",
    meaning: "Đã bảo là … nên …",
    usage:
      "Dẫn lời hoặc thông tin đã nói để giải thích, khuyên hay thuyết phục.",
    example: "길이 막힌다니까 지하철을 타요.",
    translation: "Đã bảo đường tắc mà, đi tàu điện nhé.",
    tip: "Vế sau thường là đề nghị hoặc hành động dựa vào thông tin trước.",
    source: { document: "NYS 4 – Nhóm ngữ pháp", location: "slide 3" },
    quiz: {
      sentence: "친구가 그 영화가 재미있___ 같이 보러 가요.",
      correct: 0,
      choices: [
        { text: "다니까", reason: "Đúng: lời bạn nói là căn cứ để rủ đi xem." },
        {
          text: "더니",
          reason:
            "-더니 nêu quan sát rồi biến đổi, không lấy lời kể làm lý do.",
        },
        { text: "는 둥 마는 둥", reason: "Cấu trúc này tả việc làm qua loa." },
        {
          text: "는 김에",
          reason: "-는 김에 diễn đạt nhân tiện làm thêm việc khác.",
        },
      ],
    },
  },
  {
    id: "dagoyo",
    topic: "expression",
    pattern: "-다고요? / -ㄴ다고요?",
    meaning: "Bạn nói là … à?",
    usage:
      "Hỏi lại để xác nhận điều vừa nghe, thường vì ngạc nhiên hoặc chưa nghe rõ.",
    example: "내일 시험이 있다고요?",
    translation: "Bạn bảo ngày mai có bài kiểm tra à?",
    tip: "Dấu hỏi và ngữ điệu giúp phân biệt câu hỏi lại với lời kể.",
    source: { document: "Sổ tay ngữ pháp tiếng Hàn", location: "slide 7" },
    quiz: {
      sentence: "A: 다음 주에 이사해요. B: 다음 주에 이사한___?",
      correct: 1,
      choices: [
        {
          text: "김에",
          reason: "-는 김에 nói ‘nhân tiện’, không dùng để hỏi lại.",
        },
        { text: "다고요", reason: "Đúng: B hỏi xác nhận điều A vừa nói." },
        { text: "더니", reason: "-더니 liên kết hai sự việc được quan sát." },
        {
          text: "수가 있어요",
          reason: "-는 수가 있다 nói về khả năng hậu quả.",
        },
      ],
    },
  },
  {
    id: "dung-maneun-dung",
    topic: "expression",
    pattern: "-는 둥 마는 둥",
    meaning: "Làm qua loa, lúc có lúc không",
    usage: "Diễn tả hành động được làm hời hợt hoặc chưa đến nơi đến chốn.",
    example: "급해서 아침을 먹는 둥 마는 둥 하고 나왔어요.",
    translation: "Vì vội, tôi ăn sáng qua loa rồi đi.",
    tip: "Không dùng để mô tả một việc đã hoàn thành cẩn thận.",
    source: { document: "4B연습.pdf", location: "trang 20, câu 12" },
    quiz: {
      sentence: "그는 수업을 듣는 ___ 해서 내용을 잘 몰라요.",
      correct: 2,
      choices: [
        {
          text: "김에",
          reason: "-는 김에 chỉ việc làm thêm trong dịp sẵn có.",
        },
        {
          text: "수가",
          reason:
            "-는 수가 있다 cảnh báo khả năng xảy ra, không nói về cách nghe.",
        },
        {
          text: "둥 마는 둥",
          reason: "Đúng: nghe học hời hợt nên không hiểu bài.",
        },
        { text: "더니", reason: "-더니 nối sự quan sát với thay đổi/kết quả." },
      ],
    },
  },
  {
    id: "dorok-hada",
    topic: "expression",
    pattern: "-도록 하다",
    meaning: "Cố gắng / hãy làm cho …",
    usage: "Nói về việc chủ động làm hoặc nhắc ai đó thực hiện một hành động.",
    example: "매일 한국어를 복습하도록 할게요.",
    translation: "Tôi sẽ cố gắng ôn tiếng Hàn mỗi ngày.",
    tip: "Trong lời nhắc, có thể dùng -도록 하세요 để bảo người nghe thực hiện.",
    source: { document: "4B연습.pdf", location: "trang 17, câu 14" },
    quiz: {
      sentence: "내일부터 일회용품을 덜 쓰___ 하겠습니다.",
      correct: 3,
      choices: [
        {
          text: "더니",
          reason: "-더니 nối một điều đã quan sát với kết quả sau đó.",
        },
        {
          text: "는 김에",
          reason: "-는 김에 cần một dịp sẵn có và một việc làm thêm.",
        },
        {
          text: "다니까",
          reason: "-다니까 lấy thông tin đã nói làm căn cứ cho vế sau.",
        },
        {
          text: "도록",
          reason: "Đúng: người nói cam kết sẽ chủ động giảm đồ dùng một lần.",
        },
      ],
    },
  },
];

export function lessonsForTopic(topic: GrammarTopicId | "all") {
  return topic === "all"
    ? grammarLessons
    : grammarLessons.filter((lesson) => lesson.topic === topic);
}

export function gradeGrammarQuiz(
  lessons: readonly GrammarQuizItem[],
  answers: Readonly<Record<string, number>>,
) {
  return lessons.reduce(
    (score, lesson) =>
      score + (answers[lesson.id] === lesson.quiz.correct ? 1 : 0),
    0,
  );
}
