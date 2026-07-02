import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Key, Save, Phone, MapPin, Home, Users } from "lucide-react";
import { api } from "../services/api";

const VN_RED = "#e2001a";
const VN_NAVY = "#003380";

const GENDER_OPTIONS = [
    { value: "", label: "-- Chọn giới tính --" },
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    // Form fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [hometown, setHometown] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (!u) { navigate("/"); return; }
        try {
            const parsed = JSON.parse(u);
            setUser(parsed);
            setName(parsed.name || "");
            setPhone(parsed.phone || "");
            setAddress(parsed.address || "");
            setHometown(parsed.hometown || "");
            setGender(parsed.gender || "");
        } catch {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setMessage({ type: "error", text: "Tên không được để trống" });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.updateProfile(user.id, name, password || undefined, phone, address, hometown, gender);
            if (res.error) {
                setMessage({ type: "error", text: res.error });
            } else {
                setMessage({ type: "success", text: "✅ Cập nhật thông tin thành công!" });
                localStorage.setItem("user", JSON.stringify(res.user));
                setUser(res.user);
                setPassword("");
            }
        } catch {
            setMessage({ type: "error", text: "Có lỗi kết nối, vui lòng thử lại sau." });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Noto Sans, sans-serif" }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#e2001a] transition-colors cursor-pointer">
                        <ChevronLeft size={16} /> Quay lại
                    </button>
                    <div className="flex items-start gap-1 mx-auto">
                        <span className="text-2xl font-black leading-none" style={{ color: VN_RED, fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
                        <span className="text-base font-black tracking-[0.15em] mt-0.5" style={{ color: VN_NAVY, fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Avatar & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-md"
                        style={{ background: VN_RED }}>
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {user.role === 'admin' ? '🛡️ Quản trị viên' : '📖 Độc giả'}
                        </span>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Section: Thông tin cơ bản */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} style={{ color: VN_RED }} /> Thông tin cơ bản
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
                                <input type="email" value={user.email} disabled
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>

                            {/* Họ và tên */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                    Họ và tên <span style={{ color: VN_RED }}>*</span>
                                </label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors" />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <Users size={14} className="text-gray-400" /> Giới tính
                                </label>
                                <select value={gender} onChange={e => setGender(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors bg-white cursor-pointer">
                                    {GENDER_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section: Liên hệ */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <Phone size={14} style={{ color: VN_RED }} /> Thông tin liên hệ
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <Phone size={14} className="text-gray-400" /> Số điện thoại
                                </label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                    placeholder="0912 345 678"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors" />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-gray-400" /> Địa chỉ
                                </label>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors" />
                            </div>

                            {/* Quê quán */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <Home size={14} className="text-gray-400" /> Quê quán
                                </label>
                                <input type="text" value={hometown} onChange={e => setHometown(e.target.value)}
                                    placeholder="VD: Hà Nội, Đà Nẵng, TP. Hồ Chí Minh..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Bảo mật */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <Key size={14} style={{ color: VN_RED }} /> Bảo mật
                            </h2>
                        </div>
                        <div className="p-5">
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                Mật khẩu mới
                            </label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Bỏ trống nếu không muốn đổi mật khẩu"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors" />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 text-sm text-white font-bold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: loading ? "#ccc" : VN_RED }}>
                            <Save size={16} />
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
