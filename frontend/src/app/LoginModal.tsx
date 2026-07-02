import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";

type Props = {
  onClose: () => void;
  hideClose?: boolean;
};

export default function LoginModal({ onClose, hideClose = false }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.login(email, password);

        if (data.error) {
          setError(data.error);
          return;
        }

        // Lưu user vào localStorage (bao gồm role)
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();

        // Nếu là admin → reload để App cập nhật trạng thái
        window.location.reload();
      } else {
        // Register
        if (!name.trim()) {
          setError("Vui lòng nhập họ và tên");
          return;
        }
        const data = await api.register(name, email, password);
        if (data.error) {
          setError(data.error);
          return;
        }
        
        setSuccessMsg("Đăng ký thành công! Đang chuyển sang đăng nhập...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg("");
        }, 1500);
      }
    } catch {
      setError("Không thể kết nối server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative">
        {!hideClose && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#e2001a" }}>
          {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
        </h2>

        {successMsg && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors"
                placeholder="Nguyễn Văn A"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#e2001a] text-white rounded-full hover:bg-[#c10016] disabled:bg-red-300 transition-colors font-semibold cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className="text-[#e2001a] hover:underline font-medium cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className="text-[#e2001a] hover:underline font-medium cursor-pointer"
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
