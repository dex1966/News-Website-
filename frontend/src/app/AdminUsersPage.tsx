import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user" ) || "null");
    } catch {
        return null;
    }
}

export default function AdminUsersPage() {
    const currentUser = getCurrentUser();
    const [users, setUsers] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = () => {
        if (!currentUser?.id) return;
        setLoading(true);
        api.getUsers(currentUser.id)
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
                else setError(data.error || "Không thể tải danh sách người dùng");
            })
            .catch(() => setError("Không thể kết nối server"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
    }, [currentUser?.id]);

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(user =>
            String(user.name || "").toLowerCase().includes(q) ||
            String(user.email || "").toLowerCase().includes(q) ||
            String(user.role || "").toLowerCase().includes(q)
        );
    }, [users, query]);

    const handleRoleChange = async (targetUser: any, role: "admin" | "user") => {
        const res = await api.updateUserRole(targetUser.id, role, currentUser.id).catch(() => null);
        if (!res || res.error) {
            alert(res?.error || "Cập nhật phân quyền thất bại");
            return;
        }
        loadUsers();
    };

    const handleDelete = async (targetUser: any) => {
        if (!window.confirm(`Xóa tài khoản ${targetUser.email}?`)) return;
        const res = await api.deleteUser(targetUser.id, currentUser.id).catch(() => null);
        if (!res || res.error) {
            alert(res?.error || "Xóa người dùng thất bại");
            return;
        }
        setUsers(prev => prev.filter(user => user.id !== targetUser.id));
    };

    return (
        <AdminLayout title="Quản lý người dùng" subtitle="Theo dõi tài khoản, đổi role user/admin và kiểm soát quyền quản trị.">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Tìm tên, email, role..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#e2001a]"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="p-5 text-sm text-gray-400">Đang tải người dùng...</p>
                ) : error ? (
                    <p className="p-5 text-sm text-red-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-4 py-3 font-bold">Người dùng</th>
                                    <th className="text-left px-4 py-3 font-bold">Role</th>
                                    <th className="text-left px-4 py-3 font-bold">Admin ID</th>
                                    <th className="text-left px-4 py-3 font-bold">Số bài</th>
                                    <th className="text-left px-4 py-3 font-bold">Ngày tạo</th>
                                    <th className="text-right px-4 py-3 font-bold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 min-w-[240px]">
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                disabled={user.id === currentUser.id}
                                                onChange={e => handleRoleChange(user, e.target.value as "admin" | "user")}
                                                className="border border-gray-200 rounded px-2 py-1 text-sm cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{user.admin_id || "-"}</td>
                                        <td className="px-4 py-3 text-gray-500">{user.article_count || 0}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end">
                                                <button
                                                    disabled={user.id === currentUser.id}
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 rounded border border-gray-200 text-gray-600 hover:text-red-700 hover:border-red-300 cursor-pointer disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                                                    title="Xóa người dùng"
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
