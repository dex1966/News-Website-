import { useEffect, useState } from "react";
import { FileText, FolderOpen, Newspaper, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user" ) || "null");
    } catch {
        return null;
    }
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-50 text-[#e2001a] flex items-center justify-center">
                <Icon size={19} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-semibold">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function ArticleList({ title, articles }: { title: string; articles: any[] }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-black text-gray-800">{title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {articles.length === 0 ? (
                    <p className="px-4 py-5 text-sm text-gray-400">Chưa có dữ liệu.</p>
                ) : articles.map(article => (
                    <button
                        key={article.id}
                        onClick={() => navigate(`/article/${article.id}`)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{article.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {article.category_name || "Chưa phân loại"} · {article.author_name || "Admin"} · {article.views || 0} lượt xem
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = getCurrentUser();

    useEffect(() => {
        if (!user?.id) return;
        api.getDashboard(user.id)
            .then(res => {
                if (res.error) setError(res.error);
                else setData(res);
            })
            .catch(() => setError("Không thể tải dữ liệu dashboard"))
            .finally(() => setLoading(false));
    }, [user?.id]);

    return (
        <AdminLayout title="Tổng quan" subtitle="Thống kê nhanh nội dung, người dùng và bài viết mới trong hệ thống.">
            {loading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-400">Đang tải dashboard...</div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-sm">{error}</div>
            ) : (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard label="Tổng bài viết" value={data.total_articles || 0} icon={Newspaper} />
                        <StatCard label="Bài đăng hôm nay" value={data.today_articles || 0} icon={FileText} />
                        <StatCard label="Người dùng" value={data.total_users || 0} icon={Users} />
                        <StatCard label="Danh mục" value={data.total_categories || 0} icon={FolderOpen} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        <ArticleList title="Bài viết mới nhất" articles={data.latest_articles || []} />
                        <ArticleList title="Bài viết nhiều lượt xem" articles={data.top_articles || []} />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
