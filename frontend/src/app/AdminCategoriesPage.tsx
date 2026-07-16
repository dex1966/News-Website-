import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./components/ui/dialog";

type Category = {
    id: number;
    name: string;
    slug: string;
    article_count?: number;
    created_at?: string;
    updated_at?: string;
};

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

function toSlug(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function isMutationSuccess(response: any) {
    return Boolean(response && !Array.isArray(response) && !response.error && (response.id || response.message || response.success));
}

export default function AdminCategoriesPage() {
    const currentUser = getCurrentUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [query, setQuery] = useState("");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [editing, setEditing] = useState<Category | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadCategories = () => {
        setLoading(true);
        setError("");
        api.getCategories()
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
                else setError(data.error || "Không thể tải danh mục");
            })
            .catch(() => setError("Không thể kết nối server"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter(category =>
            String(category.name || "").toLowerCase().includes(q) ||
            String(category.slug || "").toLowerCase().includes(q)
        );
    }, [categories, query]);

    const resetForm = (clearFeedback = true) => {
        setName("");
        setSlug("");
        setEditing(null);
        if (clearFeedback) {
            setMessage("");
            setError("");
        }
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (!editing) setSlug(toSlug(value));
    };

    const startEdit = (category: Category) => {
        setEditing(category);
        setName(category.name || "");
        setSlug(category.slug || "");
        setMessage("");
        setError("");
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!currentUser?.id) {
            setError("Không tìm thấy thông tin admin đang đăng nhập");
            return;
        }

        const payload = {
            name: name.trim(),
            slug: toSlug(slug || name),
            user_id: currentUser.id,
        };

        if (!payload.name) {
            setError("Vui lòng nhập tên danh mục");
            return;
        }

        if (!payload.slug) {
            setError("Slug danh mục không hợp lệ");
            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        const res = editing
            ? await api.updateCategory(editing.id, payload).catch(() => null)
            : await api.createCategory(payload).catch(() => null);

        setSaving(false);

        if (!isMutationSuccess(res)) {
            setError(res?.error || "Lưu danh mục thất bại");
            return;
        }

        setMessage(editing ? "Cập nhật danh mục thành công" : "Tạo danh mục thành công");
        resetForm(false);
        setModalOpen(false);
        loadCategories();
    };

    const handleDelete = async (category: Category) => {
        if (!currentUser?.id) {
            setError("Không tìm thấy thông tin admin đang đăng nhập");
            return;
        }

        if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;

        const res = await api.deleteCategory(category.id, currentUser.id).catch(() => null);
        if (!isMutationSuccess(res)) {
            setError(res?.error || "Xóa danh mục thất bại");
            return;
        }

        setCategories(prev => prev.filter(item => item.id !== category.id));
        setMessage("Xóa danh mục thành công");
    };

    return (
        <AdminLayout title="Quản lý danh mục" subtitle="Tạo, chỉnh sửa và kiểm soát các chuyên mục hiển thị trên trang chủ.">
            <Dialog open={modalOpen} onOpenChange={(open) => {
                setModalOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="bg-white sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                        <DialogDescription>
                            Nhập tên danh mục và slug dùng cho URL lọc bài viết.
                        </DialogDescription>
                    </DialogHeader>

                    {(error || message) && (
                        <div className={`px-3 py-2 rounded text-sm font-medium border ${error ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-800 border-green-200"}`}>
                            {error || message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Tên danh mục
                            </label>
                            <input
                                value={name}
                                onChange={e => handleNameChange(e.target.value)}
                                placeholder="Ví dụ: Kinh doanh"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e2001a]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Slug
                            </label>
                            <input
                                value={slug}
                                onChange={e => setSlug(toSlug(e.target.value))}
                                placeholder="vi-du: kinh-doanh"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e2001a]"
                            />
                            <p className="text-xs text-gray-400 mt-1">Slug dùng cho URL và lọc bài viết theo danh mục.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#e2001a] text-white text-sm font-bold rounded hover:bg-[#c10016] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={16} /> {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Thêm danh mục"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Tìm tên hoặc slug..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#e2001a]"
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#e2001a] text-white text-sm font-bold rounded hover:bg-[#c10016] cursor-pointer"
                        >
                            <Plus size={16} /> Thêm danh mục
                        </button>
                    </div>

                    {(error || message) && !modalOpen && (
                        <div className={`mx-4 mt-4 px-3 py-2 rounded text-sm font-medium border ${error ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-800 border-green-200"}`}>
                            {error || message}
                        </div>
                    )}

                    {loading ? (
                        <p className="p-5 text-sm text-gray-400">Đang tải danh mục...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-bold">Tên danh mục</th>
                                        <th className="text-left px-4 py-3 font-bold">Slug</th>
                                        <th className="text-left px-4 py-3 font-bold">Số bài</th>
                                        <th className="text-left px-4 py-3 font-bold">Ngày tạo</th>
                                        <th className="text-right px-4 py-3 font-bold">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-5 text-sm text-gray-400 text-center">
                                                Không có danh mục phù hợp.
                                            </td>
                                        </tr>
                                    ) : filteredCategories.map(category => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 min-w-[180px]">
                                                <p className="font-bold text-gray-800">{category.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                                            <td className="px-4 py-3 text-gray-500">{category.article_count || 0}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                                {category.created_at ? new Date(category.created_at).toLocaleDateString("vi-VN") : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(category)}
                                                        className="p-2 rounded border border-gray-200 text-gray-600 hover:text-[#e2001a] hover:border-[#e2001a] cursor-pointer"
                                                        title="Sửa danh mục"
                                                    >
                                                        <Edit size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category)}
                                                        disabled={(category.article_count || 0) > 0}
                                                        className="p-2 rounded border border-gray-200 text-gray-600 hover:text-red-700 hover:border-red-300 cursor-pointer disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                                                        title={(category.article_count || 0) > 0 ? "Không thể xóa danh mục đang có bài viết" : "Xóa danh mục"}
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
            </div>
        </AdminLayout>
    );
}
