import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
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

export default function AdminArticlesPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [articles, setArticles] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadArticles = () => {
        setLoading(true);
        api.getArticles(500)
            .then(data => {
                if (Array.isArray(data)) setArticles(data);
                else setError(data.error || "Không thể tải danh sách bài viết");
            })
            .catch(() => setError("Không thể kết nối server"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const filteredArticles = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return articles;
        return articles.filter(article =>
            String(article.title || "").toLowerCase().includes(q) ||
            String(article.category_name || "").toLowerCase().includes(q) ||
            String(article.author_name || article.author || "").toLowerCase().includes(q)
        );
    }, [articles, query]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
        const res = await api.deleteArticle(id, user?.id).catch(() => null);
        if (!res || res.error) {
            alert(res?.error || "Xóa bài viết thất bại");
            return;
        }
        setArticles(prev => prev.filter(article => article.id !== id));
    };

    return (
        <AdminLayout title="Quản lý bài viết" subtitle="Theo dõi, tìm kiếm, chỉnh sửa và xóa nội dung tin tức.">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Tìm tiêu đề, danh mục, tác giả..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#e2001a]"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/admin/create")}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#e2001a] text-white text-sm font-bold rounded hover:bg-[#c10016] cursor-pointer"
                    >
                        <Plus size={16} /> Tạo bài viết
                    </button>
                </div>

                {loading ? (
                    <p className="p-5 text-sm text-gray-400">Đang tải bài viết...</p>
                ) : error ? (
                    <p className="p-5 text-sm text-red-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-4 py-3 font-bold">Tiêu đề</th>
                                    <th className="text-left px-4 py-3 font-bold">Danh mục</th>
                                    <th className="text-left px-4 py-3 font-bold">Tác giả</th>
                                    <th className="text-left px-4 py-3 font-bold">Lượt xem</th>
                                    <th className="text-left px-4 py-3 font-bold">Ngày tạo</th>
                                    <th className="text-right px-4 py-3 font-bold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredArticles.map(article => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 min-w-[260px]">
                                            <button onClick={() => navigate(`/article/${article.id}`)} className="font-bold text-gray-800 text-left hover:text-[#e2001a] line-clamp-2 cursor-pointer">
                                                {article.title}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{article.category_name || "Chưa phân loại"}</td>
                                        <td className="px-4 py-3 text-gray-500">{article.author_name || article.author || "Admin"}</td>
                                        <td className="px-4 py-3 text-gray-500">{article.views || 0}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {article.created_at ? new Date(article.created_at).toLocaleDateString("vi-VN") : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/edit/${article.id}`)}
                                                    className="p-2 rounded border border-gray-200 text-gray-600 hover:text-[#e2001a] hover:border-[#e2001a] cursor-pointer"
                                                    title="Sửa bài"
                                                >
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2 rounded border border-gray-200 text-gray-600 hover:text-red-700 hover:border-red-300 cursor-pointer"
                                                    title="Xóa bài"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
