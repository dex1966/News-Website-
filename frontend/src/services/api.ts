const BASE_URL = "http://localhost/news-backend/api";

export const api = {
    getArticles: (limit = 20) =>
        fetch(`${BASE_URL}/articles.php?limit=${limit}`).then(r => r.json()),

    getArticle: (id: number) =>
        fetch(`${BASE_URL}/articles.php?id=${id}`).then(r => r.json()),

    getByCategory: (slug: string) =>
        fetch(`${BASE_URL}/articles.php?category=${slug}`).then(r => r.json()),

    getArticlesByCategory: (slug: string) =>
        fetch(`${BASE_URL}/articles.php?category=${slug}`).then(r => r.json()),

    search: (q: string) =>
        fetch(`${BASE_URL}/articles.php?search=${encodeURIComponent(q)}`).then(r => r.json()),

    searchArticles: (q: string) =>
        fetch(`${BASE_URL}/articles.php?search=${encodeURIComponent(q)}`).then(r => r.json()),

    getVNExpressArticles: (limit = 20) =>
        fetch(`${BASE_URL}/external_articles.php?limit=${limit}`).then(r => r.json()),

    getVNExpressNews: (limit = 20) =>
        fetch(`${BASE_URL}/external_articles.php?limit=${limit}`).then(r => r.json()),

    getCategories: () =>
        fetch(`${BASE_URL}/categories.php`).then(r => r.json()),

    login: (email: string, password: string) =>
        fetch(`${BASE_URL}/auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(r => r.json()),

    register: (name: string, email: string, password: string) =>
        fetch(`${BASE_URL}/auth.php?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        }).then(r => r.json()),

    updateProfile: (id: number, name: string, password?: string, phone?: string, address?: string, hometown?: string, gender?: string) =>
        fetch(`${BASE_URL}/auth.php?action=update_profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, password, phone, address, hometown, gender }),
        }).then(r => r.json()),

    deleteArticle: async (id: number) => {
        const response = await fetch(`${BASE_URL}/articles.php?id=${id}`, {
            method: 'DELETE',
        });
        try {
            return await response.json();
        } catch {
            return response.ok ? { success: true } : { error: 'Xóa thất bại' };
        }
    },

    editArticle: async (id: number, data: any) => {
        const response = await fetch(`${BASE_URL}/articles.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        try {
            return await response.json();
        } catch {
            return response.ok ? { success: true } : { error: 'Cập nhật thất bại' };
        }
    },
};