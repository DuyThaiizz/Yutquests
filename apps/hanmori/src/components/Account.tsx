"use client";
import { useEffect, useState } from "react";
import { Download, Info, RotateCcw, LogIn } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { STORAGE_KEY } from "@/lib/learning";
import { getSupabase, cloudConfigured } from "@/lib/supabase";

export function Account() {
  const { data, ready, updateProfile, reset, notify } = useStudy();
  const [name, setName] = useState(data.name === "Bạn" ? "" : data.name),
    [goal, setGoal] = useState<5 | 10 | 20>(data.dailyGoal),
    [confirm, setConfirm] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login"),
    [recovery, setRecovery] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [pending, setPending] = useState(false),
    [sessionEmail, setSessionEmail] = useState("");
  useEffect(() => {
    if (ready) {
      setName(data.name === "Bạn" ? "" : data.name);
      setGoal(data.dailyGoal);
    }
  }, [ready, data.name, data.dailyGoal]);
  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    client.auth
      .getSession()
      .then(({ data: { session } }) =>
        setSessionEmail(session?.user.email ?? ""),
      );
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      setSessionEmail(session?.user.email ?? "");
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function auth() {
    const client = getSupabase();
    if (!client || pending) return;
    setPending(true);
    setMessage("");
    try {
      const redirectTo = `${window.location.origin}/account`;
      const result =
        mode === "signup"
          ? await client.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: redirectTo },
            })
          : mode === "reset"
            ? await client.auth.resetPasswordForEmail(email, {
                redirectTo: `${redirectTo}?recovery=1`,
              })
            : await client.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      setMessage(
        mode === "signup"
          ? "Hãy kiểm tra email để xác minh tài khoản."
          : mode === "reset"
            ? "Nếu email hợp lệ, bạn sẽ nhận được liên kết đặt lại mật khẩu."
            : "Đã đăng nhập. Tiến độ trải nghiệm vẫn được giữ riêng trên thiết bị.",
      );
      setPassword("");
    } catch {
      setMessage(
        "Chưa thực hiện được. Kiểm tra thông tin đăng nhập, kết nối hoặc cấu hình email của trung tâm.",
      );
    } finally {
      setPending(false);
    }
  }
  function exportData() {
    let raw: string;
    try {
      raw = localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(data);
    } catch {
      raw = JSON.stringify(data);
    }
    const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "hanmori-so-hoc.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Đã tải bản sao sổ học trên thiết bị.");
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">나답게 · THEO NHỊP CỦA BẠN</span>
          <h1>Một góc học tập của riêng mình.</h1>
          <p>Chọn cách xưng hô và một mục tiêu vừa sức.</p>
        </div>
      </div>
      <div className="notice-panel">
        <Info size={18} />
        <p>
          Đây là bản trải nghiệm với học liệu Hàn–Anh đã nhập và các bài khởi
          động. Tiến độ và nội dung giáo viên lưu trên trình duyệt này, chưa
          đồng bộ với trung tâm. Đăng nhập email chỉ khả dụng khi được kết nối
          Supabase.
        </p>
      </div>
      <div className="account-grid">
        <form
          className="panel"
          onSubmit={(event) => {
            event.preventDefault();
            updateProfile(name, goal);
          }}
        >
          <h2>Hồ sơ học tập</h2>
          <label htmlFor="display-name">Mình gọi bạn là gì?</label>
          <input
            id="display-name"
            value={name}
            maxLength={60}
            placeholder="Tên của bạn"
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor="daily-goal">Mục tiêu mỗi ngày</label>
          <select
            id="daily-goal"
            value={goal}
            onChange={(event) =>
              setGoal(Number(event.target.value) as 5 | 10 | 20)
            }
          >
            <option value={5}>Nhẹ nhàng — 5 từ mỗi ngày</option>
            <option value={10}>Đều đặn — 10 từ mỗi ngày</option>
            <option value={20}>Tăng tốc — 20 từ mỗi ngày</option>
          </select>
          <button type="submit" className="button" disabled={!ready}>
            Lưu mục tiêu
          </button>
        </form>
        <section className="panel">
          <h2>Tài khoản trung tâm</h2>
          {recovery ? (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setPending(true);
                try {
                  const result = await getSupabase()!.auth.updateUser({
                    password,
                  });
                  if (result.error) throw result.error;
                  setPassword("");
                  setRecovery(false);
                  setMessage("Đã cập nhật mật khẩu.");
                } catch {
                  setMessage(
                    "Chưa cập nhật được mật khẩu. Hãy mở lại liên kết khôi phục và thử lại.",
                  );
                } finally {
                  setPending(false);
                }
              }}
            >
              <label htmlFor="new-password">Mật khẩu mới</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button className="button" disabled={pending}>
                Lưu mật khẩu mới
              </button>
            </form>
          ) : sessionEmail ? (
            <>
              <p>Đã đăng nhập: {sessionEmail}</p>
              <p>
                Quản trị viên cần cấp quyền trung tâm trước khi bạn có thể gửi
                tài liệu để trích xuất.
              </p>
              <button
                className="button secondary"
                onClick={async () => {
                  const { error } = await getSupabase()!.auth.signOut();
                  if (error) notify("Chưa đăng xuất được. Hãy thử lại.");
                  else setSessionEmail("");
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                auth();
              }}
            >
              <div className="tabs">
                <button
                  type="button"
                  className={mode === "login" ? "selected" : ""}
                  onClick={() => setMode("login")}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className={mode === "signup" ? "selected" : ""}
                  onClick={() => setMode("signup")}
                >
                  Đăng ký
                </button>
              </div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!cloudConfigured}
              />
              {mode !== "reset" && (
                <>
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    minLength={8}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={!cloudConfigured}
                  />
                </>
              )}
              <button
                className="button"
                disabled={!cloudConfigured || pending}
                type="submit"
              >
                <LogIn size={16} />
                {pending
                  ? "Đang xử lý…"
                  : mode === "signup"
                    ? "Tạo tài khoản"
                    : mode === "reset"
                      ? "Gửi email khôi phục"
                      : "Đăng nhập"}
              </button>
              {mode !== "reset" && (
                <button
                  type="button"
                  className="text-link"
                  style={{ marginLeft: 14 }}
                  disabled={!cloudConfigured}
                  onClick={() => setMode("reset")}
                >
                  Quên mật khẩu?
                </button>
              )}
              {!cloudConfigured && (
                <p className="storage-note">
                  Chưa kết nối dịch vụ tài khoản. Bạn vẫn có thể học, ôn và lưu
                  tiến độ trong bản trải nghiệm.
                </p>
              )}
            </form>
          )}
          {message && (
            <p role="status" className="form-message">
              {message}
            </p>
          )}
        </section>
      </div>
      <section className="panel storage-actions">
        <h2>Sổ học trên thiết bị</h2>
        <p>Tải bản sao trước khi đổi thiết bị hoặc đặt lại bản trải nghiệm.</p>
        <div>
          <button className="button secondary" onClick={exportData}>
            <Download size={17} /> Tải bản sao dữ liệu
          </button>
          <button className="button secondary" onClick={() => setConfirm(true)}>
            <RotateCcw size={16} /> Đặt lại trải nghiệm
          </button>
        </div>
        {confirm && (
          <div className="confirmation" role="alert">
            <p>
              Đặt lại sẽ xóa tiến độ, sổ từ và nội dung bạn thêm trên thiết bị
              này. Hãy tải bản sao trước nếu cần giữ lại.
            </p>
            <div
              className="button-row"
              style={{ justifyContent: "flex-start" }}
            >
              <button
                className="button danger"
                onClick={() => {
                  reset();
                  setConfirm(false);
                }}
              >
                Đặt lại dữ liệu
              </button>
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                Giữ nguyên
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
