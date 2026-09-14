export type FlashcardGroup = "관용어" | "한자성어" | "속담";

export type BilingualFlashcard = {
  id: string;
  group: FlashcardGroup;
  groupLabel: string;
  expression: string;
  vietnameseMeaning: string;
  koreanMeaning: string;
};

const makeCards = (
  prefix: string,
  group: FlashcardGroup,
  groupLabel: string,
  rows: Array<[string, string, string]>,
): BilingualFlashcard[] => rows.map(([expression, vietnameseMeaning, koreanMeaning], index) => ({
  id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
  group,
  groupLabel,
  expression,
  vietnameseMeaning,
  koreanMeaning,
}));

export const bilingualFlashcards: BilingualFlashcard[] = [
  ...makeCards("IDI", "관용어", "Quán dụng ngữ", [
    ["귀가 얇다", "Nhẹ dạ cả tin, dễ bị ảnh hưởng bởi lời nói của người khác.", "남의 말에 쉽게 영향을 받다"],
    ["마음을 먹다", "Quyết tâm, quyết định chắc chắn làm một việc gì đó.", "어떤 일을 하기로 굳게 결심하다."],
    ["입이 무겁다", "Biết giữ bí mật tốt, kín miệng.", "비밀을 잘 지키고 함부로 말하지 않다."],
    ["눈이 높다", "Kén chọn, tiêu chuẩn cao.", "사람이나 물건을 고르는 기준이 높고 까다롭다."],
    ["마음에 들다", "Vừa ý, ưng ý, thích một điều gì đó.", "좋아하거나 만족스럽게 느끼다."],
    ["어깨가 무겁다", "Cảm thấy gánh nặng, áp lực lớn vì phải chịu trách nhiệm về một việc gì đó.", "책임이나 부담이 커서 마음이 무겁다."],
    ["발이 넓다", "Quen biết nhiều người và có mối quan hệ rộng.", "아는 사람이 많고 인간관계가 넓다."],
    ["손에 땀을 쥐다", "Hồi hộp, căng thẳng đến mức toát mồ hôi tay khi chờ đợi một kết quả.", "매우 긴장되거나 흥미진진해서 조마조마하다."],
    ["한눈(을) 팔다", "Mất tập trung, lơ là vì đang chú ý đến việc khác.", "해야 할 일에 집중하지 않고 다른 데에 정신을 돌리다."],
    ["귀를 기울이다", "Lắng nghe một cách chăm chú, kỹ lưỡng.", "주의 깊게 듣다."],
    ["손발을 맞추다", "Phối hợp nhịp nhàng, ăn ý với nhau để cùng làm việc.", "서로 호흡을 맞추어 함께 일하다."],
    ["담을 쌓다", "Cắt đứt hoặc giữ khoảng cách với một người hay một lĩnh vực nào đó.", "어떤 사람이나 분야와 관계를 끊거나 멀리하다."],
    ["가슴을 울리다", "Gây xúc động sâu sắc.", "깊은 감동을 주다."],
    ["한숨을 돌리다", "Thở phào, tạm thời yên tâm sau khi việc khó khăn kết thúc.", "어려운 일이 끝난 후에 잠시 마음을 놓고 편안해지다."],
    ["바람맞다", "Bị cho leo cây, bị người đã hẹn không đến gặp.", "약속한 사람이 약속 장소에 오지 않아서 기다리게 되다."],
    ["골치가 아프다", "Đau đầu, phiền não vì một vấn đề khó giải quyết.", "머리를 다쳐 실제로 통증이 있다."],
    ["바람을 피우다", "Ngoại tình, lén lút có quan hệ tình cảm với người khác khi đã có người yêu hoặc vợ/chồng.", "배우자나 연인이 있는데 몰래 다른 사람과 관계를 맺다."],
    ["눈살을 찌푸리다", "Nhăn mặt vì không hài lòng hoặc cảm thấy khó chịu.", "못마땅하거나 불쾌해서 얼굴을 찡그리다"],
    ["다리를 뻗고 자다", "Không có điều gì phải lo lắng nên có thể sống hoặc ngủ một cách yên tâm, thoải mái.", "걱정할 일이 없어 마음 편히 지내거나 자다"],
    ["눈을 감아 주다", "Nhắm mắt bỏ qua lỗi lầm của người khác.", "잘못이나 실수를 알고도 모르는 척하고 넘어가 주다"],
  ]),
  ...makeCards("HAN", "한자성어", "Thành ngữ Hán–Hàn", [
    ["일석이조", "Một công đôi việc.", "한 가지 일로 두 가지 이익을 얻다"],
    ["고진감래", "Vượt qua gian khổ rồi nhận kết quả tốt.", "힘든 일을 견딘 뒤에 좋은 결과나 즐거움이 찾아오다"],
    ["동고동락", "Cùng nhau trải qua cả khó khăn lẫn niềm vui.", "어려운 일과 즐거운 일을 함께 겪으며 지내다."],
    ["백발백중", "Dự đoán hoặc nhắm mục tiêu lần nào cũng chính xác.", "예상하거나 겨냥한 것이 매번 정확하게 들어맞다."],
    ["막상막하", "Thực lực ngang nhau, khó phân bua thắng bại, hơn kém.", "두 쪽의 실력 차이가 작아 우열을 가리기 어렵다."],
    ["작심삼일", "Quyết tâm nhưng không duy trì được lâu, dễ bỏ cuộc.", "결심은 하지만 오래 지속하지 못하다."],
    ["우유부단", "Do dự, cân nhắc nhiều mà không dễ đưa ra quyết định.", "여러 가지를 고민하며 어느 하나를 쉽게 결정하지 못하다."],
    ["만장일치", "Tất cả người tham dự cùng nhất trí một ý kiến.", "참석한 모든 사람이 같은 의견에 찬성하다."],
    ["동상이몽", "Cùng hành động nhưng mỗi bên có suy nghĩ hoặc mục đích khác nhau.", "함께 행동하지만 서로 다른 생각이나 목적을 가지고 있다."],
    ["이심전심", "Toàn tâm toàn ý, không cần nói mà vẫn hiểu được lòng hoặc suy nghĩ của nhau.", "말을 하지 않아도 서로의 마음이나 생각이 자연스럽게 통하다"],
    ["동문서답", "Hỏi đông đáp tây, hỏi một đằng trả lời một nẻo.", "질문과 관계없는 엉뚱한 대답을 하다."],
    ["역지사지", "Đặt mình vào hoàn cảnh của người khác để suy nghĩ.", "상대방의 입장에서 생각하고 이해하다."],
    ["청천벽력", "Tin dữ hoặc biến cố bất ngờ gây cú sốc lớn.", "뜻밖에 일어난 큰 사건이나 매우 놀라운 소식."],
    ["다다익선", "Càng nhiều càng tốt.", "많으면 많을수록 더 좋다."],
    ["죽마고우", "Thanh mai trúc mã.", "어릴 때부터 함께 자라며 오래 친하게 지낸 친구"],
    ["일장일단", "Có cả ưu điểm lẫn nhược điểm.", "장점과 단점이 함께 있다."],
    ["유언비어", "Tin đồn lan truyền mà không có căn cứ xác thực.", "확실한 근거 없이 퍼지는 소문"],
    ["비몽사몽", "Trạng thái đầu óc mơ màng, khó phân biệt mơ và thực.", "꿈과 현실을 구분하기 어려울 만큼 정신이 몽롱한 상태"],
    ["일편단심", "Tấm lòng trước sau như một, lâu dài không thay đổi đối với một người hoặc đối tượng.", "한 사람이나 한 대상을 향해 오랫동안 변하지 않는 한결같은 마음"],
    ["전화위복", "Chuyển họa vi phúc, trong cái rủi có cái may.", "나쁜 일이 계기가 되어 오히려 좋은 결과가 생기다."],
  ]),
  ...makeCards("PRO", "속담", "Tục ngữ", [
    ["시작이 반이다", "Bắt đầu được một việc đã là một bước tiến rất lớn, như hoàn thành một nửa.", "일을 시작하는 것 자체가 큰 진전이다."],
    ["돌다리도 두들겨 보고 건너라", "Dù là điều quen thuộc hoặc có vẻ chắc chắn vẫn nên kiểm tra cẩn thận.", "익숙한 일도 실수하지 않도록 한 번 더 확인해야 한다."],
    ["티끌 모아 태산", "Tích tiểu thành đại.", "작은 것도 계속 모으면 나중에는 큰 것이 될 수 있다."],
    ["옷이 날개다", "Trang phục phù hợp có thể làm một người trông nổi bật và đẹp hơn.", "옷차림을 잘하면 사람이 평소보다 더 돋보일 수 있다."],
    ["하늘의 별 따기", "Khó như hái sao trên trời.", "아무리 노력해도 이루기가 매우 어려운 일이다."],
    ["꿩 먹고 알 먹기", "Một công đôi việc.", "한 가지 일을 하면서 두 가지 이익을 함께 얻는 것이다"],
    ["말이 씨가 된다", "Lời nói, nhất là điều xấu lặp lại nhiều lần, có thể trở thành sự thật.", "좋지 않은 말을 자꾸 하면 실제로 그런 일이 생길 수 있다."],
    ["수박 겉 핥기", "Chỉ xem qua bề ngoài nên không hiểu sâu nội dung.", "겉만 대충 살펴보고 내용을 깊이 알지 못하다."],
    ["천 리 길도 한 걸음부터", "Dù mục tiêu lớn đến đâu cũng phải bắt đầu từng bước nhỏ.", "아무리 큰일도 작은 일부터 하나씩 시작해야 한다."],
    ["도토리 키 재기", "Những đối tượng đều không nổi trội và chênh lệch rất ít, so sánh cũng không có nhiều ý nghĩa.", "서로 비슷하고 뛰어나지 않아 비교해도 큰 차이가 없다."],
    ["꿀 먹은 벙어리", "Có điều muốn nói nhưng lại im lặng không nói lên thành câu.", "할 말이 있어도 아무 말도 하지 못하는 사람"],
    ["소 잃고 외양간 고친다", "Mất bò mới lo làm chuồng, sau khi sự việc đã hỏng hoặc thiệt hại xảy ra mới muộn màng tìm cách khắc phục.", "일이 잘못된 뒤에야 뒤늦게 대책을 세운다."],
    ["등잔 밑이 어둡다", "Dưới chân đèn thì tối; vật ngay bên cạnh lại không chú ý thấy, việc ngay sát mình lại không biết.", "가까운 곳에 있는 것을 오히려 찾기 어렵다."],
    ["가는 말이 고와야 오는 말이 곱다", "Lời nói đi có tử tế thì lời đáp lại mới nhẹ nhàng.", "내가 남에게 고운 말을 해야 남도 나에게 고운 말을 한다."],
    ["세 살 적 버릇 여든까지 간다", "Thói quen hình thành từ nhỏ có thể kéo dài đến khi về già.", "어릴 때 생긴 습관은 나이가 들어서도 계속될 수 있다."],
    ["원숭이도 나무에서 떨어진다", "Ai cũng có thể mắc lỗi lầm dù là người giỏi.", "실력이 뛰어난 사람도 중요한 일에서 가끔 실수할 수 있다."],
    ["우물 안 개구리", "Ếch ngồi đáy giếng, người chỉ biết thế giới chật hẹp nên kiến thức và tầm nhìn hạn hẹp.", "좁은 세계만 알아 견문이 좁은 사람"],
    ["고생 끝에 낙이 온다", "Khổ tận cam lai, nếu bền bỉ vượt qua gian khổ thì sau đó niềm vui hoặc kết quả tốt sẽ đến.", "힘든 시간을 잘 견디면 나중에 좋은 일이 생길 수 있다."],
    ["백지장도 맞들면 낫다", "Dù việc nhẹ hoặc dễ, cùng hợp sức vẫn thuận lợi hơn.", "쉬운 일도 함께 하면 더 수월하게 해낼 수 있다."],
    ["배보다 배꼽이 더 크다", "Một tiền gà ba tiền thóc, chi phí hoặc công sức phụ còn lớn hơn phần việc chính.", "본래 중요한 일보다 부수적인 일에 더 많은 돈이나 노력이 들다."],
  ]),
];
