import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#e2001a" }}>
          Đăng nhập
        </h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            // Placeholder: handle login logic here
            onClose();
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#e2001a] text-white rounded-full hover:bg-[#c10016] transition-colors font-semibold"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
