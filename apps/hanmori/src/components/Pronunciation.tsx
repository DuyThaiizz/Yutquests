"use client";
import { useEffect } from "react";
import { useStudy } from "./StudyProvider";
export function usePronunciation() {
  const { notify } = useStudy();
  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
  }, []);
  return (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      notify(
        "Trình duyệt này chưa hỗ trợ đọc tiếng Hàn. Hãy thử Chrome hoặc Edge có giọng Hàn.",
      );
      return;
    }
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const voice = voices.find((item) =>
      item.lang.toLowerCase().startsWith("ko"),
    );
    if (!voice) {
      notify(
        "Chưa tìm thấy giọng tiếng Hàn trên thiết bị. Hãy cài giọng Korean trong cài đặt ngôn ngữ; phát âm AI sẽ có khi kết nối dịch vụ TTS.",
      );
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.voice = voice;
    utterance.rate = 0.85;
    utterance.onerror = () =>
      notify(
        "Chưa phát được âm thanh. Hãy thử lại hoặc kiểm tra giọng đọc của thiết bị.",
      );
    synth.speak(utterance);
  };
}
