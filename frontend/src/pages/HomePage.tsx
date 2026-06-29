import { useEffect, useState } from "react";
import { Clock, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import SectionHeader from "../components/SectionHeader";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";
import VideoSection from "../components/VideoSection";

const VN_RED = "#e2001a";

type HomePageProps = {
  loading: boolean;
  articles: any[];
  displayedArticles: any[];
  viewMode: string;
  currentUser: any;
  handleDeleteArticle: (id: number, e: React.MouseEvent) => void;
};

export default function HomePage({
  loading, articles, displayedArticles, viewMode, currentUser, handleDeleteArticle
}: HomePageProps) {
  const navigate = useNavigate();
  const [reTab, setReTab] = useState("Kinh doanh");
  const [sportsTab, setSportsTab] = useState("Bóng đá");

  const [reNews, setReNews] = useState<any[]>([]);
  const [sportsNews, setSportsNews] = useState<any[]>([]);
  const [techNews, setTechNews] = useState<any[]>([]);

  useEffect(() => {
    api.getArticlesByCategory("kinhdoanh").then(data => {
      if (!data.error) setReNews(data.slice(0, 4));
    });
    api.getArticlesByCategory("thethao").then(data => {
      if (!data.error) setSportsNews(data.slice(0, 4));
    });
    api.getArticlesByCategory("khoahoc").then(data => {
      if (!data.error) setTechNews(data.slice(0, 4));
    });
  }, []);

  const heroArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.length > 1 ? articles.slice(1, 5) : [];
  
  const mostRead = displayedArticles.length > 0
    ? displayedArticles.slice(0, 10).map((a, i) => ({ rank: i + 1, title: a.title, id: a.id }))
    : [
      { rank: 1, title: "Ba phút 'hú vía' và vai trò cầu nối của Việt Nam tại ASEAN" },
      { rank: 2, title: "Haaland lập cú đúp, đưa Na Uy vào vòng knock-out World Cup" },
      { rank: 3, title: "Chứng khoán Việt Nam bứt phá, VN-Index vượt ngưỡng 1.300 điểm" },
      { rank: 4, title: "Giá vàng thế giới lên cao nhất trong vòng 3 tháng qua" },
      { rank: 5, title: "AI tạo sinh đang định hình lại tương lai ngành giáo dục" },
    ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 py-4">
      <div className="flex gap-4">
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-16">
            <div className="rounded flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-200" style={{ width: 160, height: 600 }}>
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
              {/* HERO */}
              {heroArticle && (
                <div className="group cursor-pointer" onClick={() => heroArticle.id && navigate(`/article/${heroArticle.id}`)}>
                  <div className="relative overflow-hidden rounded">
                    <img src={heroArticle.img || heroArticle.image_url} alt={heroArticle.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ height: 360 }} />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: VN_RED }}>{heroArticle.category || heroArticle.category_name}</span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight group-hover:text-[#e2001a] transition-colors" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
                      {heroArticle.title}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">{heroArticle.summary || heroArticle.desc}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {heroArticle.time || "vừa xong"}</span>
                      <span className="italic">{heroArticle.author}</span>
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={(e) => handleDeleteArticle(heroArticle.id, e)}
                          className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition-colors z-10"
                          title="Xoá bài viết"
                        >
                          <Trash2 size={13} /> Xoá bài
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SIDE */}
              <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100 px-3">
                {sideArticles.map((a) => (
                  <div key={a.id} className="cursor-pointer" onClick={() => a.id && navigate(`/article/${a.id}`)}>
                    <ArticleCard
                      article={a}
                      horizontal
                      onDelete={currentUser?.role === 'admin' ? (e) => handleDeleteArticle(a.id, e) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}



          <VideoSection />

          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Kinh doanh" tabs={["Thị trường", "Doanh nghiệp", "Bất động sản"]} activeTab={reTab} onTab={setReTab} />
            {reNews.length > 0 && (
              <>
                <div className="group cursor-pointer mb-3" onClick={() => navigate(`/article/${reNews[0].id}`)}>
                  <div className="flex gap-4 justify-between items-center">
                    <div className="flex gap-4">
                      <div className="overflow-hidden rounded flex-shrink-0">
                        <img src={reNews[0].img || reNews[0].image_url} alt={reNews[0].title} className="object-cover group-hover:scale-105 transition-transform duration-500" style={{ width: 200, height: 128 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-800 leading-tight group-hover:text-[#e2001a] transition-colors" style={{ fontFamily: "Merriweather, Georgia, serif" }}>{reNews[0].title}</h3>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{reNews[0].summary || reNews[0].desc}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><Clock size={10} /> {reNews[0].time || "vừa xong"}</span>
                          <span className="flex items-center gap-1"><Eye size={10} /> {reNews[0].views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
                  {reNews.slice(1).map((item) => <ArticleCard key={item.id} article={item} horizontal onClick={() => navigate(`/article/${item.id}`)} />)}
                  {viewMode === 'vnexpress' && displayedArticles.slice(1, 5).map((a) => (
                    <ArticleCard key={a.id} article={a} horizontal onClick={() => window.open(a.source_url, "_blank")} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Thể thao" tabs={["Bóng đá", "World Cup", "Tennis"]} activeTab={sportsTab} onTab={setSportsTab} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {viewMode === 'home' ? (
                sportsNews.map((a) => (
                  <ArticleCard key={a.id} article={a} onClick={() => navigate(`/article/${a.id}`)} onDelete={currentUser?.role === 'admin' ? (e) => handleDeleteArticle(a.id, e) : undefined} />
                ))
              ) : (
                displayedArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} onClick={() => window.open(a.source_url, "_blank")} />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <SectionHeader title="Khoa học - Công nghệ" tabs={["AI", "Khởi nghiệp", "Di động"]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {techNews.map((a) => <ArticleCard key={a.id} article={a} onClick={() => navigate(`/article/${a.id}`)} onDelete={currentUser?.role === 'admin' ? (e) => handleDeleteArticle(a.id, e) : undefined} />)}
            </div>
          </div>
        </div>

        <Sidebar mostRead={mostRead} />
      </div>
    </div>
  );
}
