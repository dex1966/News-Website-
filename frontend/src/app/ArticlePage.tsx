import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, User, ArrowLeft, Eye, Trash2, Edit } from "lucide-react";
import { api } from "../services/api";
import LoginModal from "./LoginModal";

const VN_RED = "#e2001a";
const VN_NAVY = "#003380";

export default function ArticlePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) {
            try {
                setCurrentUser(JSON.parse(u));
            } catch (e) {}
        }
    }, []);

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này không?")) return;
        try {
            const res = await api.deleteArticle(Number(id));
            if (res.error) {
                alert("Lỗi: " + res.error);
            } else {
                alert("Xoá bài viết thành công!");
                navigate("/");
            }
        } catch (err) {
            alert("Lỗi kết nối server khi xoá bài viết.");
        }
    };

    useEffect(() => {
        if (!id) return;
        api.getArticle(Number(id))
            .then((data) => {
                if (data.error) setNotFound(true);
                else setArticle(data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (!currentUser && !loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <LoginModal onClose={() => {}} hideClose={true} />
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                    style={{ borderColor: VN_RED, borderTopColor: "transparent" }} />
                <p className="text-sm text-gray-400">Đang tải...</p>
            </div>
        </div>
    );

    if (notFound) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl font-bold text-gray-700 mb-4">Không tìm thấy bài viết</p>
                <button onClick={() => navigate("/")}
                    className="px-4 py-2 text-white rounded text-sm" style={{ background: VN_RED }}>
                    Về trang chủ
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "Noto Sans, sans-serif" }}>
            {/* HEADER */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-50">
                <div className="max-w-[900px] mx-auto px-4 py-3 flex items-center gap-4">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm font-semibold hover:text-[#e2001a] transition-colors">
                        <ArrowLeft size={16} /> Quay lại
                    </button>
                    <div className="flex items-start gap-1 ml-auto">
                        <span className="text-[22px] font-black text-[#e2001a] leading-none"
                            style={{ fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
                        <span className="text-[14px] font-black tracking-[0.15em] mt-0.5"
                            style={{ color: VN_NAVY, fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
                    </div>
                </div>
            </div>

            {/* NỘI DUNG */}
            <div className="max-w-[900px] mx-auto px-4 py-8">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: VN_RED }}>
                    {article.category_name}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 leading-tight"
                    style={{ fontFamily: "Merriweather, Georgia, serif" }}>
                    {article.title}
                </h1>

                {article.summary && (
                    <p className="text-base text-gray-600 mt-3 leading-relaxed font-medium border-l-4 pl-4"
                        style={{ borderColor: VN_RED }}>
                        {article.summary}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400 border-b border-gray-200 pb-4">
                    <span className="flex items-center gap-1"><User size={13} /> {article.author ?? "Admin"}</span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {new Date(article.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                        })}
                    </span>
                    <span className="flex items-center gap-1"><Eye size={13} /> {article.views ?? 0} lượt xem</span>
                    {currentUser?.role === 'admin' && (
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => navigate(`/admin/edit/${id}`)}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold rounded-full transition-colors shadow-sm cursor-pointer"
                            >
                                <Edit size={12} /> Chỉnh sửa
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs text-white bg-[#e2001a] hover:bg-[#c10016] font-semibold rounded-full transition-colors shadow-sm cursor-pointer"
                            >
                                <Trash2 size={12} /> Xoá bài
                            </button>
                        </div>
                    )}
                </div>

                {article.image_url && (
                    <div className="mt-6">
                        <img src={article.image_url} alt={article.title}
                            className="w-full rounded object-cover" style={{ maxHeight: 480 }} />
                    </div>
                )}

                <div className="mt-6 text-gray-800 leading-relaxed text-base">
                    {article.content
                        ? <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        : <p className="text-gray-500 italic">Nội dung bài viết chưa được cập nhật.</p>
                    }
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold hover:text-[#e2001a] transition-colors">
                        <ArrowLeft size={14} /> Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}