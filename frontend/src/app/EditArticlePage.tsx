import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Upload, X } from "lucide-react";
import { api } from "../services/api";

const VN_RED = "#e2001a";
const API_BASE = "http://localhost/news-backend/api";

interface Category {
    id: number;
    name: string;
}

export default function EditArticlePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Guard: chỉ admin mới vào được
    const user = JSON.parse(localStorage.getItem("user") || "null");
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, []);

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Author tự động lấy từ user đang login
    const author = user?.name || "Admin";

    useEffect(() => {
        api.getCategories()
            .then((data) => { if (Array.isArray(data)) setCategories(data); })
            .catch(() => { });

        if (id) {
            api.getArticle(Number(id)).then(data => {
                if (!data.error) {
                    setTitle(data.title || "");
                    setSummary(data.summary || "");
                    setContent(data.content || "");
                    setCategoryId(data.category_id || "");
                    if (data.image_url) setCoverPreview(data.image_url);
                }
            });
        }
    }, [id]);

    function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    function removeCover() {
        setCoverFile(null);
        setCoverPreview("");
    }

    async function handleSubmit() {
        if (!title.trim()) {
            setMessage({ type: "error", text: "Vui lòng nhập tiêu đề!" });
            return;
        }
        if (!content.trim()) {
            setMessage({ type: "error", text: "Vui lòng nhập nội dung bài viết!" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Bước 1: Upload ảnh bìa nếu có
            let imageUrl = "";
            if (coverFile) {
                const formData = new FormData();
                formData.append("image", coverFile);
                const uploadRes = await fetch(`${API_BASE}/upload.php`, {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error || "Upload ảnh thất bại");
                imageUrl = uploadData.url;
            }

            // Bước 2: Cập nhật bài viết
            const res = await api.editArticle(Number(id), {
                title,
                summary,
                content,
                category_id: categoryId || null,
                image_url: imageUrl || coverPreview || "",
            });

            if (res.error) throw new Error(res.error || "Lưu bài thất bại");

            setMessage({ type: "success", text: `✅ Cập nhật bài viết thành công!` });

            setTimeout(() => navigate(`/article/${id}`), 1000);

        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
            setMessage({ type: "error", text: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen" style={{ background: "#f5f5f5", fontFamily: "Noto Sans, sans-serif" }}>
            {/* Header giống App.tsx */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-3 py-3 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#e2001a] transition-colors"
                    >
                        <ChevronLeft size={16} /> Quay lại
                    </button>
                    <div className="flex items-start gap-1">
                        <span className="text-2xl font-black leading-none" style={{ color: VN_RED, fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
                        <span className="text-base font-black tracking-[0.15em] mt-0.5" style={{ color: "#003380", fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm font-semibold text-gray-700">Chỉnh sửa bài viết</span>

                </div>
            </div>

            <div className="max-w-[860px] mx-auto px-3 py-6">
                {/* Thông tin tác giả */}
                <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: VN_RED }}>
                        {author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{author}</p>
                        <p className="text-xs text-gray-400">Đăng bài với tư cách Admin</p>
                    </div>
                </div>

                {/* Thông báo */}
                {message && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border ${message.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">

                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Tiêu đề <span style={{ color: VN_RED }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base font-semibold text-gray-800 focus:outline-none focus:border-[#e2001a] transition-colors"
                        />
                    </div>

                    {/* Tóm tắt */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Tóm tắt
                        </label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                            placeholder="Mô tả ngắn hiển thị ở trang chủ..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#e2001a] transition-colors"
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Danh mục
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#e2001a] transition-colors bg-white"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ảnh bìa */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Ảnh bìa
                        </label>
                        {!coverPreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#e2001a] transition-colors group">
                                <Upload size={24} className="text-gray-300 group-hover:text-[#e2001a] mb-2 transition-colors" />
                                <span className="text-sm text-gray-400 group-hover:text-[#e2001a] transition-colors">Click để chọn ảnh bìa</span>
                                <span className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Tối đa 5MB</span>
                                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={coverPreview} alt="Preview" className="w-full h-52 object-cover" />
                                <button
                                    onClick={removeCover}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Nội dung */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Nội dung <span style={{ color: VN_RED }}>*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={14}
                            placeholder="Viết nội dung bài viết tại đây..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm leading-relaxed resize-y focus:outline-none focus:border-[#e2001a] transition-colors"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Hỗ trợ xuống dòng bình thường. Có thể dán text từ Word hoặc Google Docs.
                        </p>
                    </div>

                    {/* Nút đăng */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 text-sm text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                            style={{ background: loading ? "#ccc" : VN_RED }}
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}