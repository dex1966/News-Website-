import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSearchParams } from "react-router-dom";
import LoginModal from "./LoginModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/HomePage";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const activeNav = searchParams.get("cat") || "";

  // Load user from localStorage
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) try { setCurrentUser(JSON.parse(u)); } catch { }
  }, []);

  // Load articles khi URL params thay đổi
  useEffect(() => {
    const cat = searchParams.get("cat") || "";
    const q = searchParams.get("q") || "";
    setLoading(true);

    let fetcher: Promise<any>;
    if (q) {
      fetcher = api.searchArticles(q).then(data => { if (Array.isArray(data)) setArticles(data); });
    } else if (cat) {
      fetcher = api.getArticlesByCategory(cat, 20).then(data => { if (Array.isArray(data)) setArticles(data); });
    } else {
      fetcher = api.getArticles(20).then(data => { if (Array.isArray(data)) setArticles(data); });
    }

    fetcher.catch(() => {}).finally(() => setLoading(false));
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleDeleteArticle = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này không?")) return;
    const res = await api.deleteArticle(id, currentUser?.id).catch(() => null);
    if (res?.error) alert(res.error);
    else setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleSearch = () => {
    setSearchParams(searchQuery.trim() ? { q: searchQuery } : {});
  };

  const handleNavClick = (id: string) => {
    setSearchParams(id ? { cat: id } : {});
  };


  return (
    <div className="min-h-screen text-gray-900" style={{ background: "#ffffff", fontFamily: "Noto Sans, sans-serif" }}>
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        setLoginOpen={setLoginOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        activeNav={activeNav}
        handleNavClick={handleNavClick}
      />

      <HomePage
        loading={loading}
        articles={articles}
        currentUser={currentUser}
        handleDeleteArticle={handleDeleteArticle}
        activeNav={activeNav}
        currentSearchQuery={searchParams.get("q") || ""}
      />

      <Footer />

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
