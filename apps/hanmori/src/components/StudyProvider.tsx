"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Grade, StudyData, Vocabulary } from "@/lib/models";
import { emptyStudyData, recordReview, STORAGE_KEY } from "@/lib/learning-core";
import { X } from "lucide-react";
import {
  applyNote,
  applyDeck,
  type StudyNote,
  type PersonalDeck,
} from "@/lib/personal-study";

interface StudyContextValue {
  data: StudyData;
  ready: boolean;
  notice: string;
  notify: (message: string) => void;
  review: (id: string, grade: Grade, exerciseCorrect?: boolean) => void;
  toggleSaved: (id: string) => void;
  editWord: (word: Vocabulary) => void;
  updateProfile: (name: string, goal: 5 | 10 | 20) => void;
  reset: () => void;
  putNote: (note: StudyNote) => string | null;
  putDeck: (deck: PersonalDeck) => string | null;
}
const StudyContext = createContext<StudyContextValue | null>(null);
export function StudyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyData>(emptyStudyData);
  const [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  const canPersist = useRef(true);
  const corpus = useRef<typeof import("@/lib/learning") | null>(null);
  useEffect(() => {
    let active = true;
    // The shared shell can hydrate before downloading the vocabulary corpus.
    void import("@/lib/learning")
      .then((learning) => {
        if (!active) return;
        corpus.current = learning;
        let restored = learning.freshStudyData();
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) restored = learning.parseStudyData(stored);
        } catch {
          canPersist.current = false;
          setNotice(
            "Dữ liệu đã lưu không đọc được. Bản cũ được giữ nguyên; hãy tải bản sao trong Tài khoản trước khi đặt lại.",
          );
        }
        setData(restored);
        setReady(true);
      })
      .catch(() => {
        if (active)
          setNotice(
            "Chưa tải được từ vựng. Hãy tải lại trang để thử lại; dữ liệu đã lưu vẫn được giữ nguyên.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (ready && canPersist.current && corpus.current) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          corpus.current.serializeStudyData(data),
        );
      } catch {
        setNotice(
          "Trình duyệt không lưu được tiến độ. Hãy tải bản sao dữ liệu trong Tài khoản.",
        );
      }
    }
  }, [data, ready]);
  const notify = useCallback((message: string) => setNotice(message), []);
  const review = useCallback(
    (id: string, grade: Grade, correct = false) =>
      ready &&
      setData((previous) =>
        recordReview(previous, id, grade, new Date(), correct),
      ),
    [ready],
  );
  const toggleSaved = useCallback(
    (id: string) =>
      ready &&
      setData((previous) => ({
        ...previous,
        saved: previous.saved.includes(id)
          ? previous.saved.filter((item) => item !== id)
          : [...previous.saved, id],
      })),
    [ready],
  );
  const editWord = useCallback(
    (word: Vocabulary) =>
      ready &&
      setData((previous) => ({
        ...previous,
        vocabulary: previous.vocabulary.some((item) => item.id === word.id)
          ? previous.vocabulary.map((item) =>
              item.id === word.id ? word : item,
            )
          : [...previous.vocabulary, word],
      })),
    [ready],
  );
  const updateProfile = useCallback(
    (name: string, dailyGoal: 5 | 10 | 20) => {
      if (!ready) return;
      setData((previous) => ({
        ...previous,
        name: name.trim() || "Bạn",
        dailyGoal,
      }));
      setNotice("Đã lưu mục tiêu học tập.");
    },
    [ready],
  );
  const reset = useCallback(() => {
    if (!corpus.current) return;
    canPersist.current = true;
    setData(corpus.current.freshStudyData());
    setNotice("Đã đặt lại dữ liệu trải nghiệm trên thiết bị này.");
  }, []);
  function putNote(note: StudyNote): string | null {
    if (!ready) return "Đang tải sổ từ. Hãy thử lại sau một lát.";
    try {
      setData(applyNote(data, note));
      return null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Không lưu được từ. Hãy kiểm tra nội dung.";
    }
  }
  function putDeck(deck: PersonalDeck): string | null {
    if (!ready) return "Đang tải sổ từ. Hãy thử lại sau một lát.";
    try {
      setData(applyDeck(data, deck));
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Không lưu được bộ thẻ.";
    }
  }
  return (
    <StudyContext.Provider
      value={{
        data,
        ready,
        notice,
        notify,
        review,
        toggleSaved,
        editWord,
        updateProfile,
        reset,
        putNote,
        putDeck,
      }}
    >
      {children}
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
            <X size={18} />
          </button>
        </div>
      )}
    </StudyContext.Provider>
  );
}
export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error("StudyProvider is required");
  return value;
}
