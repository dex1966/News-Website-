import { ReactNode, useEffect, useState } from "react";
import { BarChart3, FileText, Home, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const VN_RED = "#e2001a";

export default function AdminLayout({ title, subtitle, children }: {
    title: string;
    subtitle?: string;
    children: ReactNode;
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) {
            navigate("/");
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (parsed.role !== "admin") {
                navigate("/");
                return;
            }
            setUser(parsed);
        } catch {
            navigate("/");
        }
    }, [navigate]);

    const navItems = [
        { label: "Tổng quan", path: "/admin", icon: BarChart3 },
        { label: "Bài viết", path: "/admin/articles", icon: FileText },
        { label: "Người dùng", path: "/admin/users", icon: Users },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f5f6f8]" style={{ fontFamily: "Noto Sans, sans-serif" }}>
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e2001a] hover:border-[#e2001a] cursor-pointer"
                            title="Về trang chủ"
                        >
                            <Home size={17} />
                        </button>
                        <div>
                            <div className="flex items-start gap-1">
                                <span className="text-2xl font-black leading-none" style={{ color: VN_RED, fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
                                <span className="text-base font-black tracking-[0.15em] mt-0.5" style={{ color: "#003380", fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
                            </div>
                            <p className="text-[11px] text-gray-400">Admin dashboard</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
                <aside className="bg-white border border-gray-200 rounded-lg p-2 h-fit">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm font-semibold transition-colors cursor-pointer ${active ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                style={active ? { background: VN_RED } : {}}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </aside>

                <main className="min-w-0">
                    <div className="mb-4">
                        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
