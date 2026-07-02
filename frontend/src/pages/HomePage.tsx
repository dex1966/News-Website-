import { useEffect, useState } from "react";
import { Clock, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import SectionHeader from "../components/SectionHeader";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";
import VideoSection from "../components/VideoSection";
import { formatRelativeTime } from "../utils/date";
import { NAV_CATS } from "../data/mockData";

const VN_RED = "#e2001a";

type HomePageProps = {
  loading: boolean;
  articles: any[];
  currentUser: any;
  handleDeleteArticle: (id: number, e: React.MouseEvent) => void;
  activeNav: string;
  currentSearchQuery?: string;
};

/** Spinner dùng chung */
const Spinner = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <div className={`flex items-center justify-center ${size === "md" ? "h-64" : "h-32"}`}>
    <div
      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: VN_RED, borderTopColor: "transparent" }}
    />
  </div>
);

/** Wrapper layout chung cho tất cả sub-page */
const PageLayout = ({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }) => (
  <div className="max-w-[1200px] mx-auto px-3 py-4">
    <div className="flex gap-4">
      {/* Left Ads */}
      <div className="hidden xl:block w-[160px] flex-shrink-0">
        <div className="sticky top-16">
          <div
            className="rounded flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-200"
            style={{ width: 160, height: 600 }}
          >
            <span className="text-[10px] text-gray-400 uppercase tracking-widest rotate-90 whitespace-nowrap">Quảng cáo</span>
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 min-w-0">{children}</div>
      {/* Right Sidebar */}
      <div className="hidden lg:block w-[296px] flex-shrink-0">{sidebar}</div>
    </div>
  </div>
);

/** Tiêu đề section với gạch đỏ */
const SectionTitle = ({ title }: { title: string }) => (
  <div className="border-b-2 pb-2 mb-6" style={{ borderColor: VN_RED }}>
    <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: VN_RED }}>{title}</h2>
  </div>
);

export default function HomePage({
  loading, articles, currentUser, handleDeleteArticle, activeNav, currentSearchQuery = "",
}: HomePageProps) {
  const navigate = useNavigate();

  const [reNews, setReNews] = useState<any[]>([]);
  const [sportsNews, setSportsNews] = useState<any[]>([]);
  const [techNews, setTechNews] = useState<any[]>([]);

  const [catArticles, setCatArticles] = useState<any[]>([]);
  const [limit, setLimit] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch section news for homepage
  useEffect(() => {
    api.getArticlesByCategory("kinhdoanh").then(d => { if (!d.error) setReNews(d.slice(0, 4)); });
    api.getArticlesByCategory("thethao").then(d => { if (!d.error) setSportsNews(d.slice(0, 4)); });
    api.getArticlesByCategory("khoahoc").then(d => { if (!d.error) setTechNews(d.slice(0, 4)); });
  }, []);

  // Fetch category articles when nav changes
  useEffect(() => {
    if (!activeNav || activeNav === "video") { setCatArticles([]); return; }
    setLimit(12); setHasMore(true); setLoadingMore(true);
    api.getArticlesByCategory(activeNav, 12).then(data => {
      if (!data.error && Array.isArray(data)) {
        setCatArticles(data);
        if (data.length < 12) setHasMore(false);
      }
      setLoadingMore(false);
    });
  }, [activeNav]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const newLimit = limit + 12;
    setLimit(newLimit);
    api.getArticlesByCategory(activeNav, newLimit).then(data => {
      if (!data.error && Array.isArray(data)) {
        setCatArticles(data);
        if (data.length < newLimit) setHasMore(false);
      }
      setLoadingMore(false);
    });
  };

  // Infinite scroll
  useEffect(() => {
    if (!activeNav) return;
    const onScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 150)
        loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeNav, limit, loadingMore, hasMore]);

  const mostRead = articles.slice(0, 10).map((a, i) => ({ rank: i + 1, title: a.title, id: a.id }));
  const sidebar = <Sidebar mostRead={mostRead} />;
  const isAdmin = currentUser?.role === "admin";

  // ── Search Results ──
  if (currentSearchQuery) {
    return (
      <PageLayout sidebar={sidebar}>
        <SectionTitle title={`Kết quả tìm kiếm cho: "${currentSearchQuery}"`} />
        {loading ? <Spinner /> : articles.length === 0 ? (
          <div className="py-12 text-center text-gray-400">Không tìm thấy bài viết nào phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow">
                <ArticleCard article={a} onClick={() => navigate(`/article/${a.id}`)}
                  onDelete={isAdmin ? e => handleDeleteArticle(a.id, e) : undefined} />
              </div>
            ))}
          </div>
        )}
      </PageLayout>
    );
  }

  // ── Video Page ──
  if (activeNav === "video") {
    return (
      <PageLayout sidebar={sidebar}>
        <SectionTitle title="Video" />
        <VideoSection />
      </PageLayout>
    );
  }

  // ── Category Page ──
  if (activeNav) {
    const categoryName = NAV_CATS.find(c => c.id === activeNav)?.label || activeNav;
    return (
      <PageLayout sidebar={sidebar}>
        <SectionTitle title={categoryName} />
        {loadingMore && catArticles.length === 0 ? <Spinner /> : catArticles.length === 0 ? (
          <div className="py-12 text-center text-gray-400">Không có bài viết nào trong chủ đề này.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catArticles.map(a => (
              <div key={a.id} className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow">
                <ArticleCard article={a} onClick={() => navigate(`/article/${a.id}`)}
                  onDelete={isAdmin ? e => handleDeleteArticle(a.id, e) : undefined} />
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-8 text-center">
            <button onClick={loadMore} disabled={loadingMore}
              className="px-6 py-2 border border-gray-300 text-sm font-semibold rounded hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer">
              {loadingMore ? "Đang tải thêm..." : "Xem thêm"}
            </button>
          </div>
        )}
      </PageLayout>
    );
  }

  // ── Home Dashboard ──
  const heroArticle = articles[0] ?? null;
  const sideArticles = articles.slice(1, 9);

  return (
    <div className="max-w-[1200px] mx-auto px-3 py-4">
      <div className="flex gap-4">
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-16">
            <div className="rounded flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-200" style={{ width: 160, height: 600 }}>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest rotate-90 whitespace-nowrap">Quảng cáo</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: VN_RED, borderTopColor: "transparent" }} />
                <p className="text-sm text-gray-400">Đang tải...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-4 mb-6">
              {/* Hero */}
              {heroArticle && (
                <div className="group cursor-pointer" onClick={() => heroArticle.id && navigate(`/article/${heroArticle.id}`)}>
                  <div className="relative overflow-hidden rounded">
                    <img src={heroArticle.img || heroArticle.image_url} alt={heroArticle.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ height: 360 }} />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: VN_RED }}>
                      {heroArticle.category || heroArticle.category_name}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight group-hover:text-[#e2001a] transition-colors" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
                      {heroArticle.title}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">{heroArticle.summary || heroArticle.desc}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {formatRelativeTime(heroArticle.created_at || heroArticle.time)}</span>
                      <span className="italic">{heroArticle.author_name || heroArticle.author}</span>
                      {isAdmin && (
                        <button onClick={e => handleDeleteArticle(heroArticle.id, e)}
                          className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition-colors z-10 cursor-pointer" title="Xoá bài viết">
                          <Trash2 size={13} /> Xoá bài
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Side list */}
              <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100 px-3 side-scroll" style={{ maxHeight: 420, overflowY: "auto" }}>
                {sideArticles.map(a => (
                  <div key={a.id} className="cursor-pointer" onClick={() => a.id && navigate(`/article/${a.id}`)}>
                    <ArticleCard article={a} horizontal onDelete={isAdmin ? e => handleDeleteArticle(a.id, e) : undefined} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <VideoSection />

          {/* Kinh doanh */}
          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Kinh doanh" tabs={["Thị trường", "Doanh nghiệp", "Bất động sản"]} />
            {reNews.length > 0 && (
              <>
                <div className="group cursor-pointer mb-3" onClick={() => navigate(`/article/${reNews[0].id}`)}>
                  <div className="flex gap-4">
                    <div className="overflow-hidden rounded flex-shrink-0">
                      <img src={reNews[0].img || reNews[0].image_url} alt={reNews[0].title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ width: 200, height: 128 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-800 leading-tight group-hover:text-[#e2001a] transition-colors" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
                        {reNews[0].title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{reNews[0].summary || reNews[0].desc}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={10} /> {formatRelativeTime(reNews[0].created_at || reNews[0].time)}</span>
                        <span className="flex items-center gap-1"><Eye size={10} /> {reNews[0].views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
                  {reNews.slice(1).map(item => (
                    <ArticleCard key={item.id} article={item} horizontal onClick={() => navigate(`/article/${item.id}`)} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thể thao */}
          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Thể thao" tabs={["Bóng đá", "World Cup", "Tennis"]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sportsNews.map(a => (
                <ArticleCard key={a.id} article={a}
                  onClick={() => navigate(`/article/${a.id}`)}
                  onDelete={isAdmin ? e => handleDeleteArticle(a.id, e) : undefined} />
              ))}
            </div>
          </div>

          {/* Khoa học - CN */}
          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Khoa học - Công nghệ" tabs={["AI", "Khởi nghiệp", "Di động"]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {techNews.map(a => (
                <ArticleCard key={a.id} article={a} onClick={() => navigate(`/article/${a.id}`)}
                  onDelete={isAdmin ? e => handleDeleteArticle(a.id, e) : undefined} />
              ))}
            </div>
          </div>
        </div>

        <Sidebar mostRead={mostRead} />
      </div>
    </div>
  );
}
