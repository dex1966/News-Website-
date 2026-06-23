import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  ChevronRight,
  Clock,
  Eye,
  Menu,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const VN_RED = "#e2001a";
const VN_NAVY = "#003380";

const IMGS = {
  hero: "https://images.unsplash.com/photo-1665224752123-a2ea29dddcb2?w=800&h=480&fit=crop&auto=format",
  vietnam: "https://images.unsplash.com/photo-1743485754066-f45e26489e9a?w=400&h=260&fit=crop&auto=format",
  football: "https://images.unsplash.com/photo-1705593973313-75de7bf95b56?w=400&h=260&fit=crop&auto=format",
  football2: "https://images.unsplash.com/photo-1556816214-fda351e4a7fb?w=400&h=260&fit=crop&auto=format",
  stadium: "https://images.unsplash.com/photo-1556816214-6d16c62fbbf6?w=400&h=260&fit=crop&auto=format",
  realestate: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=260&fit=crop&auto=format",
  realestate2: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=260&fit=crop&auto=format",
  realestate3: "https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=400&h=260&fit=crop&auto=format",
  tech: "https://images.unsplash.com/photo-1750365920056-d4b4ca73fbaa?w=400&h=260&fit=crop&auto=format",
  tech2: "https://images.unsplash.com/photo-1773828756264-9b96420d9c66?w=400&h=260&fit=crop&auto=format",
  stock: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=260&fit=crop&auto=format",
  stock2: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=260&fit=crop&auto=format",
  bikes: "https://images.unsplash.com/photo-1671385033978-85369f658d6b?w=400&h=260&fit=crop&auto=format",
  hanoi: "https://images.unsplash.com/photo-1758104372690-0e14bc4dec5c?w=400&h=260&fit=crop&auto=format",
};

const NAV_CATS = [
  { id: "thoisu", label: "Thời sự" },
  { id: "gocnhin", label: "Góc nhìn" },
  { id: "thegioi", label: "Thế giới" },
  { id: "kinhdoanh", label: "Kinh doanh" },
  { id: "khoahoc", label: "Khoa học-CN" },
  { id: "giaitri", label: "Giải trí" },
  { id: "thethao", label: "Thể thao" },
  { id: "phapluat", label: "Pháp luật" },
  { id: "giaoduc", label: "Giáo dục" },
  { id: "suckhoe", label: "Sức khỏe" },
  { id: "doisong", label: "Đời sống" },
  { id: "dulich", label: "Du lịch" },
  { id: "soho", label: "Số hóa" },
  { id: "anh", label: "Ảnh" },
  { id: "video", label: "Video" },
  { id: "infographic", label: "Infographics" },
];

const BREAKING = [
  "Bộ Nội vụ: Chưa bổ sung tài sản công nghệ vào điện BHXH bắt buộc trong năm 2026",
  "Haaland lập cú đúp, đưa Na Uy vào vòng knock-out World Cup 2026",
  "Giá vàng thế giới lên cao nhất trong vòng 3 tháng, vượt mốc 3.400 USD/ounce",
  "TP HCM: Chính phủ phê duyệt đề án xây dựng 6 tòa nhà cao tầng tại khu trung tâm",
  "Messi chính thức xác nhận không tham dự World Cup 2026 cùng Argentina",
];

const HERO_ARTICLE = {
  title: "Ba phút 'hú vía' và vai trò cầu nối của Việt Nam tại ASEAN",
  desc: "Bài của Phạm Quang Vinh: Việt Nam đang đóng vai trò ngày càng quan trọng trong việc thúc đẩy đoàn kết và hợp tác trong khu vực ASEAN. Trong bối cảnh địa chính trị biến động, vị thế cầu nối của Việt Nam được các nước thành viên đánh giá cao.",
  category: "Góc nhìn",
  author: "Phạm Quang Vinh",
  time: "38 phút",
  img: IMGS.hero,
  comments: 121,
};

const SIDE_ARTICLES = [
  {
    id: 1,
    title: "Bộ Nội vụ: Chưa bổ sung tài sản công nghệ vào điện BHXH bắt buộc",
    img: IMGS.vietnam,
    category: "Thời sự",
    time: "1 giờ",
  },
  {
    id: 2,
    title: "Đề xuất tăng mức phạt hành chính tối đa lên 1,5 tỷ đồng",
    img: IMGS.bikes,
    category: "Pháp luật",
    time: "2 giờ",
  },
  {
    id: 3,
    title: "Haaland lập cú đúp, đưa Na Uy vào vòng knock-out World Cup",
    img: IMGS.football,
    category: "Thể thao",
    time: "3 giờ",
  },
  {
    id: 4,
    title: "Chứng khoán Việt Nam bứt phá, VN-Index vượt ngưỡng 1.300 điểm",
    img: IMGS.stock2,
    category: "Kinh doanh",
    time: "4 giờ",
  },
];

const QUICK_NEWS = [
  { id: 1, time: "07:32", text: "Thủ tướng chủ trì phiên họp Chính phủ thường kỳ tháng 6/2026" },
  { id: 2, time: "07:15", text: "Việt Nam và Nhật Bản ký kết thỏa thuận hợp tác đầu tư 5 tỷ USD" },
  { id: 3, time: "06:58", text: "WHO cảnh báo biến thể mới của virus cúm A/H5N1 tại Đông Nam Á" },
  { id: 4, time: "06:41", text: "Giá xăng tăng lần 3 liên tiếp, lên mức cao nhất từ đầu năm 2026" },
  { id: 5, time: "06:20", text: "Mỹ và Trung Quốc nối lại đàm phán thương mại sau 6 tháng đình trệ" },
  { id: 6, time: "05:55", text: "TP HCM: Hơn 1.200 tỷ đồng giải ngân vốn đầu tư công trong quý II" },
];

const RE_NEWS = [
  {
    id: 1,
    title: "Sun Group thành lập công ty con khu đô thị 1.500 ha ở Hưng Yên",
    img: IMGS.realestate,
    time: "2 giờ",
    views: "12.4K",
    desc: "Tập đoàn Sun Group vừa ra mắt đơn vị thành viên mới chuyên phát triển khu đô thị quy mô lớn tại tỉnh Hưng Yên.",
    big: true,
  },
  {
    id: 2,
    title: "TP HCM xây dựng 6 tòa nhà cao tầng tại khu trung tâm quận 1",
    img: IMGS.realestate2,
    time: "3 giờ",
    views: "8.7K",
    desc: "Chính phủ phê duyệt chủ trương xây dựng 6 tòa nhà cao tầng thay thế các công trình xuống cấp tại khu vực trung tâm.",
  },
  {
    id: 3,
    title: "Giá đất nền vùng ven TP HCM tiếp tục tăng mạnh trong quý II",
    img: IMGS.realestate3,
    time: "4 giờ",
    views: "6.2K",
    desc: "Giá đất nền khu vực Bình Dương, Long An, Đồng Nai ghi nhận mức tăng 15-20% so với cùng kỳ năm ngoái.",
  },
  {
    id: 4,
    title: "Hà Nội: Giá căn hộ chung cư tăng bình quân 18% trong 6 tháng đầu năm",
    img: IMGS.hanoi,
    time: "5 giờ",
    views: "4.9K",
    desc: "Thị trường căn hộ Hà Nội tiếp tục nóng với giá trung bình đạt 55-70 triệu đồng/m² tại các quận nội thành.",
  },
];

const SPORTS_NEWS = [
  {
    id: 1,
    title: "Messi không được đưa vào danh sách 26 cầu thủ dự vòng chung kết World Cup 2026",
    img: IMGS.stadium,
    desc: "HLV Lionel Scaloni chính thức xác nhận huyền thoại Messi sẽ vắng mặt trong đội hình Argentina tham dự World Cup 2026 tại Mỹ, Canada và Mexico.",
    time: "1 giờ",
    comments: 89,
  },
  {
    id: 2,
    title: "Messi: 'Mỗi thứ thất bại giúp tôi tiếp thêm động lực mua'",
    img: IMGS.football2,
    desc: "Siêu sao người Argentina chia sẻ cảm xúc về quyết định không tham dự World Cup 2026 và kế hoạch giải nghệ trong tương lai gần.",
    time: "2 giờ",
    comments: 212,
  },
  {
    id: 3,
    title: "Haaland lập cú đúp xuất thần, Na Uy vào knock-out World Cup",
    img: IMGS.football,
    desc: "Tiền đạo Erling Haaland ghi 2 bàn trong 10 phút cuối giúp Na Uy ngược dòng đánh bại Áo 3-1, giành vé vào vòng 16 đội.",
    time: "3 giờ",
    comments: 145,
  },
  {
    id: 4,
    title: "Tuyển Việt Nam tập huấn tại Nhật Bản trước thềm AFF Cup 2026",
    img: IMGS.vietnam,
    desc: "HLV Kim Sang-sik triệu tập 28 cầu thủ cho đợt tập trung chuẩn bị cho AFF Cup 2026 diễn ra vào tháng 12 tới.",
    time: "4 giờ",
    comments: 67,
  },
];

const TECH_NEWS = [
  {
    id: 1,
    title: "AI tạo sinh đang định hình lại tương lai ngành giáo dục toàn cầu",
    img: IMGS.tech,
    time: "2 giờ",
    views: "15.2K",
    desc: "Các công cụ AI như ChatGPT, Gemini và Claude đang thay đổi cách học sinh, sinh viên tiếp cận việc học tập và nghiên cứu.",
  },
  {
    id: 2,
    title: "Việt Nam đặt mục tiêu 30% GDP từ kinh tế số vào năm 2030",
    img: IMGS.tech2,
    time: "3 giờ",
    views: "9.8K",
    desc: "Chính phủ ban hành nghị quyết thúc đẩy chuyển đổi số quốc gia với mục tiêu kinh tế số chiếm 30% GDP vào năm 2030.",
  },
];

const MOST_READ = [
  { rank: 1, title: "Ba phút 'hú vía' và vai trò cầu nối của Việt Nam tại ASEAN" },
  { rank: 2, title: "Haaland lập cú đúp, đưa Na Uy vào vòng knock-out World Cup" },
  { rank: 3, title: "Chứng khoán Việt Nam bứt phá, VN-Index vượt ngưỡng 1.300 điểm" },
  { rank: 4, title: "Giá vàng thế giới lên cao nhất trong vòng 3 tháng qua" },
  { rank: 5, title: "AI tạo sinh đang định hình lại tương lai ngành giáo dục" },
  { rank: 6, title: "TP HCM xây dựng 6 tòa nhà cao tầng tại khu trung tâm" },
  { rank: 7, title: "Đề xuất tăng mức phạt hành chính tối đa lên 1,5 tỷ đồng" },
  { rank: 8, title: "Messi không được đưa vào danh sách dự World Cup 2026" },
  { rank: 9, title: "Việt Nam và Nhật Bản ký kết thỏa thuận hợp tác đầu tư 5 tỷ USD" },
  { rank: 10, title: "Giá xăng tăng lần 3 liên tiếp, lên mức cao nhất từ đầu năm" },
];

const STOCKS = [
  { name: "VN-Index", val: "1,312.45", change: "+15.23", pct: "+1.17%", up: true },
  { name: "HNX-Index", val: "231.18", change: "+2.45", pct: "+1.07%", up: true },
  { name: "UPCOM", val: "98.67", change: "-0.34", pct: "-0.34%", up: false },
  { name: "VN30", val: "1,398.72", change: "+0.00", pct: "0.00%", flat: true },
];

const FX_RATES = [
  { currency: "USD", buy: "25,110", sell: "25,450" },
  { currency: "EUR", buy: "27,320", sell: "28,540" },
  { currency: "JPY", buy: "162.50", sell: "170.30" },
  { currency: "GBP", buy: "31,800", sell: "33,100" },
  { currency: "CNY", buy: "3,410", sell: "3,580" },
];

const GOLD = [
  { type: "Vàng SJC (lượng)", buy: "120,500", sell: "122,500" },
  { type: "Vàng nhẫn 9999", buy: "103,800", sell: "105,300" },
];

function SectionHeader({
  title,
  tabs,
  activeTab,
  onTab,
}: {
  title: string;
  tabs?: string[];
  activeTab?: string;
  onTab?: (t: string) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b-2 pb-2 mb-4" style={{ borderColor: VN_RED }}>
      <h2
        className="text-sm font-black uppercase tracking-wider"
        style={{ color: VN_RED, fontFamily: "Noto Sans, sans-serif" }}
      >
        {title}
      </h2>
      <div className="flex items-center gap-3 text-xs">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => onTab?.(tab)}
            className={`transition-colors hidden sm:block ${
              activeTab === tab
                ? "font-bold border-b"
                : "text-gray-500 hover:text-gray-800"
            }`}
            style={activeTab === tab ? { color: VN_RED, borderColor: VN_RED } : {}}
          >
            {tab}
          </button>
        ))}
        <a
          href="#"
          className="flex items-center gap-0.5 hover:underline font-medium"
          style={{ color: VN_RED }}
        >
          Xem thêm <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  horizontal = false,
  large = false,
}: {
  article: { title: string; img: string; desc?: string; category?: string; time: string; comments?: number; views?: string };
  horizontal?: boolean;
  large?: boolean;
}) {
  if (horizontal) {
    return (
      <div className="group flex gap-3 cursor-pointer py-3 border-b border-gray-100 last:border-0">
        <img
          src={article.img}
          alt={article.title}
          className="flex-shrink-0 object-cover rounded"
          style={{ width: large ? 128 : 96, height: large ? 82 : 64 }}
        />
        <div className="flex-1 min-w-0">
          {article.category && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: VN_RED }}
            >
              {article.category}
            </span>
          )}
          <h3
            className={`font-semibold text-gray-800 leading-tight mt-0.5 line-clamp-3 group-hover:text-[#e2001a] transition-colors ${
              large ? "text-sm" : "text-xs"
            }`}
            style={{ fontFamily: "Noto Sans, sans-serif" }}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={10} /> {article.time} trước
            </span>
            {article.views && (
              <span className="flex items-center gap-1">
                <Eye size={10} /> {article.views}
              </span>
            )}
            {article.comments !== undefined && (
              <span>{article.comments} bình luận</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded">
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mt-2">
        {article.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: VN_RED }}>
            {article.category}
          </span>
        )}
        <h3
          className="text-sm font-bold text-gray-800 leading-tight mt-0.5 line-clamp-2 group-hover:text-[#e2001a] transition-colors"
          style={{ fontFamily: "Merriweather, Georgia, serif" }}
        >
          {article.title}
        </h3>
        {article.desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.desc}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={10} /> {article.time} trước
          </span>
          {article.comments !== undefined && (
            <span>{article.comments} bình luận</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("thoisu");
  const [tickerIdx, setTickerIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [reTab, setReTab] = useState("Chính sách");
  const [sportsTab, setSportsTab] = useState("Bóng đá");

  useEffect(() => {
    const iv = setInterval(() => setTickerIdx((p) => (p + 1) % BREAKING.length), 4500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{ background: "#f2f2f2", fontFamily: "Noto Sans, sans-serif" }}
    >
      {/* ── TOP UTILITY BAR ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-1 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-600">Thứ Hai, 23/6/2026</span>
            <div className="hidden md:flex items-center gap-3">
              {["Tin sáng", "Y kiến", "Thu giản", "Infographics", "Video"].map((l) => (
                <a key={l} href="#" className="hover:text-[#e2001a] transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-1 hover:text-[#e2001a] transition-colors">
              <Bell size={12} /> Thông báo
            </button>
            <button className="flex items-center gap-1 hover:text-[#e2001a] transition-colors">
              <User size={12} /> Đăng nhập
            </button>
          </div>
        </div>
      </div>

      {/* ── HEADER: LOGO + SEARCH ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-3 flex items-center gap-4 justify-between">
          <a href="#" className="flex-shrink-0 flex items-start gap-1">
            <span
              className="text-[32px] font-black text-[#e2001a] leading-none"
              style={{ fontFamily: "Merriweather, Georgia, serif" }}
            >
              VN
            </span>
            <div className="flex flex-col leading-none mt-0.5">
              <span
                className="text-[19px] font-black tracking-[0.15em] leading-tight"
                style={{ color: VN_NAVY, fontFamily: "Merriweather, Georgia, serif" }}
              >
                EXPRESS
              </span>
              <span className="text-[9px] text-gray-400 tracking-wide mt-0.5">
                Báo tiếng Việt nhiều người đọc nhất
              </span>
            </div>
          </a>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Tìm kiếm tin tức, sự kiện..."
              className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors"
            />
            <Search
              size={15}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#e2001a]"
            />
          </div>

          {/* Mobile icons */}
          <div className="flex items-center gap-2 sm:hidden">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 text-gray-600">
              <Search size={20} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-gray-600">
              <Menu size={20} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="sm:hidden px-3 pb-3">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-4 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a]"
            />
          </div>
        )}
      </div>

      {/* ── RED NAV ── */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: VN_RED }}>
        <div className="max-w-[1200px] mx-auto px-3">
          {/* Desktop */}
          <div className="hidden sm:flex items-center overflow-x-auto no-scrollbar">
            {NAV_CATS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveNav(cat.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  activeNav === cat.id
                    ? "bg-white"
                    : "text-white hover:bg-red-700"
                }`}
                style={activeNav === cat.id ? { color: VN_RED } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Mobile */}
          <div className="sm:hidden flex items-center justify-between py-2.5">
            <span className="text-white font-semibold text-sm">
              {NAV_CATS.find((c) => c.id === activeNav)?.label}
            </span>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white flex items-center gap-1 text-xs">
              Danh mục <ChevronDown size={14} />
            </button>
          </div>
          {mobileOpen && (
            <div className="sm:hidden grid grid-cols-3 gap-1 pb-3">
              {NAV_CATS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveNav(cat.id); setMobileOpen(false); }}
                  className={`px-2 py-1.5 text-xs font-medium rounded transition-colors text-center ${
                    activeNav === cat.id ? "bg-white" : "text-white hover:bg-red-700"
                  }`}
                  style={activeNav === cat.id ? { color: VN_RED } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── BREAKING TICKER ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-2 flex items-center gap-3">
          <span
            className="flex-shrink-0 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ background: VN_RED }}
          >
            Tin nhanh
          </span>
          <p className="flex-1 text-sm text-gray-700 truncate cursor-pointer hover:text-[#e2001a] transition-colors">
            {BREAKING[tickerIdx]}
          </p>
          <div className="flex gap-1 flex-shrink-0">
            {BREAKING.map((_, i) => (
              <button
                key={i}
                onClick={() => setTickerIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i === tickerIdx ? VN_RED : "#d1d5db" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="max-w-[1200px] mx-auto px-3 py-4">
        <div className="flex gap-4">
          {/* LEFT AD */}
          <div className="hidden xl:block w-[160px] flex-shrink-0">
            <div className="sticky top-16">
              <div
                className="rounded flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-200"
                style={{ width: 160, height: 600 }}
              >
                <span className="text-[10px] text-gray-400 uppercase tracking-widest rotate-90 whitespace-nowrap">
                  Quảng cáo
                </span>
              </div>
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Hero + Sidebar articles */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-4 mb-6">
              {/* Hero */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded">
                  <img
                    src={HERO_ARTICLE.img}
                    alt={HERO_ARTICLE.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ height: 360 }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="mt-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: VN_RED }}
                  >
                    {HERO_ARTICLE.category}
                  </span>
                  <h1
                    className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight group-hover:text-[#e2001a] transition-colors"
                    style={{ fontFamily: "Merriweather, Georgia, serif" }}
                  >
                    {HERO_ARTICLE.title}
                  </h1>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {HERO_ARTICLE.desc}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {HERO_ARTICLE.time} trước
                    </span>
                    <span>{HERO_ARTICLE.comments} bình luận</span>
                    <span className="italic">{HERO_ARTICLE.author}</span>
                  </div>
                </div>
              </div>

              {/* Right side articles */}
              <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100 px-3">
                {SIDE_ARTICLES.map((a) => (
                  <ArticleCard key={a.id} article={a} horizontal />
                ))}
              </div>
            </div>

            {/* TIN NHANH list */}
            <div className="bg-white rounded border border-gray-200 mb-6 overflow-hidden">
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: VN_RED }}
              >
                <span className="text-white font-black text-sm uppercase tracking-wider">
                  Tin nhanh hôm nay
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {QUICK_NEWS.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer group"
                  >
                    <span
                      className="flex-shrink-0 text-[11px] font-bold mt-0.5"
                      style={{ color: VN_RED }}
                    >
                      {n.time}
                    </span>
                    <p className="text-sm text-gray-700 leading-snug group-hover:text-[#e2001a] transition-colors">
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BẤT ĐỘNG SẢN */}
            <div className="bg-white rounded border border-gray-200 p-4 mb-6">
              <SectionHeader
                title="Bất động sản"
                tabs={["Chính sách", "Dự án", "Tư vấn", "Thị trường"]}
                activeTab={reTab}
                onTab={setReTab}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {/* Big featured */}
                <div className="group cursor-pointer sm:col-span-2 mb-3">
                  <div className="flex gap-4">
                    <div className="overflow-hidden rounded flex-shrink-0">
                      <img
                        src={RE_NEWS[0].img}
                        alt={RE_NEWS[0].title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ width: 200, height: 128 }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base font-bold text-gray-800 leading-tight group-hover:text-[#e2001a] transition-colors"
                        style={{ fontFamily: "Merriweather, Georgia, serif" }}
                      >
                        {RE_NEWS[0].title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                        {RE_NEWS[0].desc}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {RE_NEWS[0].time} trước
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={10} /> {RE_NEWS[0].views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
                    {RE_NEWS.slice(1).map((item) => (
                      <ArticleCard key={item.id} article={item} horizontal />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* THỂ THAO */}
            <div className="bg-white rounded border border-gray-200 p-4 mb-6">
              <SectionHeader
                title="Thể thao"
                tabs={["Bóng đá", "World Cup 2026", "Tennis", "V.League"]}
                activeTab={sportsTab}
                onTab={setSportsTab}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {SPORTS_NEWS.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>

            {/* KHOA HỌC - CÔNG NGHỆ */}
            <div className="bg-white rounded border border-gray-200 p-4 mb-6">
              <SectionHeader
                title="Khoa học - Công nghệ"
                tabs={["AI", "Khởi nghiệp", "Di động", "Máy tính"]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TECH_NEWS.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden md:block w-[240px] flex-shrink-0">
            {/* Ad box */}
            <div
              className="rounded border border-gray-200 flex items-center justify-center mb-4 bg-gradient-to-b from-gray-100 to-gray-200"
              style={{ height: 200 }}
            >
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Quảng cáo</span>
            </div>

            {/* ĐỌC NHIỀU NHẤT */}
            <div className="bg-white rounded border border-gray-200 mb-4 overflow-hidden">
              <div className="px-3 py-2" style={{ background: VN_RED }}>
                <h3 className="text-white font-black text-xs uppercase tracking-wider">
                  Đọc nhiều nhất
                </h3>
              </div>
              <div>
                {MOST_READ.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer group border-b border-gray-100 last:border-0"
                  >
                    <span
                      className={`text-xl font-black flex-shrink-0 leading-none mt-0.5 ${
                        item.rank <= 3 ? "" : "text-gray-200"
                      }`}
                      style={item.rank <= 3 ? { color: VN_RED } : {}}
                    >
                      {item.rank}
                    </span>
                    <p className="text-xs text-gray-700 leading-snug group-hover:text-[#e2001a] transition-colors line-clamp-3">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CHỨNG KHOÁN */}
            <div className="bg-white rounded border border-gray-200 p-3 mb-4">
              <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">
                Chứng khoán
              </h3>
              {STOCKS.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-semibold text-gray-600">{s.name}</span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-800">{s.val}</div>
                    <div
                      className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                        s.flat ? "text-gray-400" : s.up ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {s.flat ? (
                        <Minus size={9} />
                      ) : s.up ? (
                        <TrendingUp size={9} />
                      ) : (
                        <TrendingDown size={9} />
                      )}
                      {s.pct}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TỶ GIÁ */}
            <div className="bg-white rounded border border-gray-200 p-3 mb-4">
              <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">
                Tỷ giá ngoại tệ
              </h3>
              <div className="flex justify-between text-[9px] text-gray-400 mb-1 px-0.5">
                <span>Tiền tệ</span>
                <span>Mua vào</span>
                <span>Bán ra</span>
              </div>
              {FX_RATES.map((fx) => (
                <div
                  key={fx.currency}
                  className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-bold text-gray-600 w-8">{fx.currency}</span>
                  <span className="text-[11px] text-gray-700">{fx.buy}</span>
                  <span className="text-[11px] font-semibold" style={{ color: VN_RED }}>
                    {fx.sell}
                  </span>
                </div>
              ))}
            </div>

            {/* GIÁ VÀNG */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">
                Giá vàng
              </h3>
              {GOLD.map((g) => (
                <div key={g.type} className="py-1.5 border-b border-gray-50 last:border-0">
                  <div className="text-[10px] text-gray-500 mb-1">{g.type}</div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="text-[9px] text-gray-400">Mua</div>
                      <div className="font-bold text-gray-700">{g.buy}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-gray-400">Bán</div>
                      <div className="font-bold" style={{ color: VN_RED }}>
                        {g.sell}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[9px] text-gray-400 mt-1.5">Đơn vị: nghìn đồng/chỉ</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1c1c1c", color: "#aaa" }} className="mt-4">
        <div className="max-w-[1200px] mx-auto px-3 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-start gap-0.5 mb-4">
                <span
                  className="text-3xl font-black leading-none"
                  style={{ color: "#e2001a", fontFamily: "Merriweather, Georgia, serif" }}
                >
                  VN
                </span>
                <div className="flex flex-col leading-none mt-0.5 ml-0.5">
                  <span
                    className="text-lg font-black tracking-[0.15em]"
                    style={{ color: "#6699cc", fontFamily: "Merriweather, Georgia, serif" }}
                  >
                    EXPRESS
                  </span>
                  <span className="text-[9px] text-gray-500 tracking-wide mt-0.5">
                    Báo tiếng Việt nhiều người đọc nhất
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
                VnExpress là báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam. Cung cấp tin tức nhanh nhất, chính xác nhất, uy tín nhất.
              </p>
            </div>
            {[
              {
                title: "Chuyên mục",
                links: ["Thời sự", "Thế giới", "Kinh doanh", "Giải trí", "Thể thao", "Sức khỏe", "Du lịch"],
              },
              {
                title: "Dịch vụ",
                links: ["VnExpress+", "Tài khoản VIP", "Thông báo", "Bản tin email", "RSS", "Sitemap"],
              },
              {
                title: "Liên hệ",
                links: ["Tòa soạn", "Quảng cáo", "Góc nhìn", "Điều khoản sử dụng", "Chính sách bảo mật"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="border-t pt-4 text-[11px] text-center"
            style={{ borderColor: "#333", color: "#555" }}
          >
            © 2026 VnExpress · Báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam · Giấy phép số 23/GP-BTTTT cấp ngày 05/01/2021
          </div>
        </div>
      </footer>
    </div>
  );
}
