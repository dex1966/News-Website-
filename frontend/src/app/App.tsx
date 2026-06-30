import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginModal from "./LoginModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/HomePage";

export default function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'home' | 'vnexpress'>('home');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Đọc category và search query từ URL
  const catFromUrl = searchParams.get("cat") || "";
  const qFromUrl = searchParams.get("q") || "";
  const [activeNav, setActiveNav] = useState(catFromUrl);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      try { setCurrentUser(JSON.parse(u)); } catch (e) { }
    }
  }, []);

  // Đồng bộ ô tìm kiếm với URL
  useEffect(() => {
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  // Load articles khi category hoặc search query thay đổi
  useEffect(() => {
    const cat = searchParams.get("cat") || "";
    const q = searchParams.get("q") || "";
    setActiveNav(cat);
    setLoading(true);

    if (viewMode === 'home') {
      if (q) {
        api.searchArticles(q)
          .then((data) => { if (Array.isArray(data)) setArticles(data); })
          .catch(() => { })
          .finally(() => setLoading(false));
      } else if (cat) {
        api.getArticlesByCategory(cat, 20)
          .then((data) => { if (Array.isArray(data)) setArticles(data); })
          .catch(() => { })
          .finally(() => setLoading(false));
      } else {
        api.getArticles(20)
          .then((data) => { if (Array.isArray(data)) setArticles(data); })
          .catch(() => { })
          .finally(() => setLoading(false));
      }
    } else {
      api.getVNExpressNews()
        .then((data) => {
          if (Array.isArray(data)) {
            const mapped = data.map(item => ({
              id: item.link,
              title: item.title,
              summary: item.description,
              image_url: item.image,
              time: item.pubDate,
              source_url: item.link,
              category_name: 'VNExpress',
              author: 'VNExpress'
            }));
            setArticles(mapped);
          }
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [searchParams, viewMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleDeleteArticle = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này không?")) return;
    try {
      const res = await api.deleteArticle(id);
      if (res.error) {
        alert(res.error || "Xoá thất bại");
      } else {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch {
      alert("Lỗi kết nối");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchParams({});
    } else {
      setSearchParams({ q: searchQuery });
    }
  };

  // Khi click nav → đổi URL param, lịch sử trình duyệt sẽ ghi nhận
  const handleNavClick = (id: string) => {
    if (id) {
      setSearchParams({ cat: id });
    } else {
      setSearchParams({});
    }
  };

  const displayedArticles = articles || [];

  if (!loading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginModal onClose={() => { }} hideClose={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: "#ffffff", fontFamily: "Noto Sans, sans-serif" }}>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        setLoginOpen={setLoginOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        activeNav={activeNav}
        handleNavClick={handleNavClick}
      />

      <HomePage
        loading={loading}
        articles={articles}
        displayedArticles={displayedArticles}
        viewMode={viewMode}
        currentUser={currentUser}
        handleDeleteArticle={handleDeleteArticle}
        activeNav={activeNav}
        currentSearchQuery={searchParams.get("q") || ""}
      />

      <Footer />

      {loginOpen && currentUser && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}