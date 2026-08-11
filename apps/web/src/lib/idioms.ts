export type Idiom = {
  id: number;
  korean: string;
  reading: string;
  meaning: string;
  literal: string;
  category: "Đời sống" | "Thiên nhiên" | "Cảm xúc" | "Thử thách";
  example: string;
  options: string[];
};

export const idioms: Idiom[] = [
  { id: 1, korean: "식은 죽 먹기", reading: "si-geun juk meok-gi", meaning: "Rất dễ dàng", literal: "Ăn cháo đã nguội", category: "Đời sống", example: "이 문제는 식은 죽 먹기예요. — Bài này dễ như ăn cháo.", options: ["Rất dễ dàng", "Quá muộn", "Ăn thật nhanh"] },
  { id: 2, korean: "그림의 떡", reading: "geu-rim-ui tteok", meaning: "Thứ mong muốn nhưng không thể có", literal: "Bánh tteok trong tranh", category: "Cảm xúc", example: "비싼 자동차는 나에게 그림의 떡이에요. — Chiếc xe đắt tiền ấy chỉ là mơ ước xa vời.", options: ["Món quà bất ngờ", "Thứ mong muốn nhưng không thể có", "Một bức tranh đẹp"] },
  { id: 3, korean: "하늘의 별 따기", reading: "ha-neur-ui byeol tta-gi", meaning: "Việc cực kỳ khó", literal: "Hái sao trên trời", category: "Thử thách", example: "그 회사에 들어가기는 하늘의 별 따기예요. — Vào được công ty ấy khó như hái sao.", options: ["Một việc lãng mạn", "Việc cực kỳ khó", "May mắn bất ngờ"] },
  { id: 4, korean: "발이 넓다", reading: "ba-ri neolp-tta", meaning: "Có quan hệ rộng", literal: "Bàn chân rộng", category: "Đời sống", example: "민수는 발이 넓어서 아는 사람이 많아요. — Minsu quen biết rất nhiều người.", options: ["Đi bộ rất xa", "Có quan hệ rộng", "Mua giày lớn"] },
  { id: 5, korean: "눈이 높다", reading: "nu-ni nop-tta", meaning: "Có tiêu chuẩn cao", literal: "Mắt ở trên cao", category: "Cảm xúc", example: "그 사람은 물건을 고를 때 눈이 높아요. — Người ấy có tiêu chuẩn chọn đồ rất cao.", options: ["Có tiêu chuẩn cao", "Nhìn rất xa", "Hay mơ mộng"] },
  { id: 6, korean: "비 온 뒤에 땅이 굳어진다", reading: "bi on dwi-e ttang-i gu-deo-jin-da", meaning: "Sau khó khăn, con người trở nên vững vàng", literal: "Đất cứng lại sau mưa", category: "Thiên nhiên", example: "우리도 이 일을 겪고 더 가까워졌어요. 비 온 뒤에 땅이 굳어져요. — Qua chuyện này chúng ta càng gắn bó.", options: ["Mưa làm hỏng mọi thứ", "Sau khó khăn, con người trở nên vững vàng", "Phải chờ thời tiết đẹp"] },
  { id: 7, korean: "가는 말이 고와야 오는 말이 곱다", reading: "ga-neun ma-ri go-wa-ya o-neun ma-ri gop-tta", meaning: "Nói lời tử tế sẽ nhận lại lời tử tế", literal: "Lời đi đẹp thì lời về cũng đẹp", category: "Đời sống", example: "친절하게 말해요. 가는 말이 고와야 오는 말이 고와요. — Hãy nói tử tế để nhận lại điều tử tế.", options: ["Nói lời tử tế sẽ nhận lại lời tử tế", "Nói càng nhanh càng tốt", "Không nên nói chuyện"] },
  { id: 8, korean: "호랑이도 제 말 하면 온다", reading: "ho-rang-i-do je mal ha-myeon on-da", meaning: "Vừa nhắc tới ai thì người đó xuất hiện", literal: "Nhắc hổ thì hổ đến", category: "Thiên nhiên", example: "지수 이야기 중이었는데 지수가 왔네! 호랑이도 제 말 하면 온다더니. — Vừa nhắc Jisu thì Jisu tới.", options: ["Nguy hiểm đang đến", "Vừa nhắc tới ai thì người đó xuất hiện", "Đừng vào rừng"] },
];
