import { useState, useEffect } from "react";
import { Search, Bell, User, Menu, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NAV_CATS } from "../data/mockData";

const VN_RED = "#e2001a";
const VN_NAVY = "#003380";

type HeaderProps = {
  currentUser: any;
  handleLogout: () => void;
  setLoginOpen: (val: boolean) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: () => void;
  activeNav: string;
  handleNavClick: (id: string) => void;
};

export default function Header({
  currentUser, handleLogout, setLoginOpen,
  viewMode, setViewMode,
  searchQuery, setSearchQuery, handleSearch,
  activeNav, handleNavClick
}: HeaderProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-1 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-600">Thứ Sáu, 27/6/2026</span>
            <div className="hidden md:flex items-center gap-3">
              {["Tin sáng", "Ý kiến", "Thư giãn", "Infographics", "Video"].map((l) => (
                <a key={l} href="#" className="hover:text-[#e2001a] transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-1 hover:text-[#e2001a] transition-colors">
              <Bell size={12} /> Thông báo
            </button>
            <button onClick={() => setViewMode(viewMode === 'home' ? 'vnexpress' : 'home')} className="px-3 py-1 bg-[#e2001a] text-white rounded hover:bg-[#c10016] transition-colors">
              {viewMode === 'home' ? 'Xem VNExpress' : 'Quay lại'}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  <span className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold px-1.5 py-0.5 bg-gray-200/80 rounded ml-1">
                    {currentUser.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/create")}
                    className="flex items-center gap-1 px-3 py-1 bg-[#e2001a] hover:bg-[#c10016] text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
                  >
                    + Viết bài
                  </button>
                )}
                <button
                  onClick={() => navigate("/profile")}
                  className="text-gray-500 hover:text-[#e2001a] font-semibold transition-colors border-l pl-3 border-gray-200"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-[#e2001a] font-semibold transition-colors border-l pl-3 border-gray-200"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-1 hover:text-[#e2001a] transition-colors" onClick={() => setLoginOpen(true)}>
                <User size={12} /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Logo & Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-3 flex items-center gap-4 justify-between">
          <div onClick={() => handleNavClick("")} className="cursor-pointer flex-shrink-0 flex items-start gap-1">
            <span className="text-[32px] font-black text-[#e2001a] leading-none" style={{ fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
            <div className="flex flex-col leading-none mt-0.5">
              <span className="text-[19px] font-black tracking-[0.15em] leading-tight" style={{ color: VN_NAVY, fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
              <span className="text-[9px] text-gray-400 tracking-wide mt-0.5">Báo tiếng Việt nhiều người đọc nhất</span>
            </div>
          </div>
          <div className="flex-1 max-w-md hidden sm:flex items-center relative">
            <input type="text" placeholder="Tìm kiếm tin tức, sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors" />
            <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#e2001a]" onClick={handleSearch} />
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 text-gray-600"><Search size={20} /></button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-gray-600"><Menu size={20} /></button>
          </div>
        </div>
        {searchOpen && (
          <div className="sm:hidden px-3 pb-3">
            <input type="text" placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-4 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a]" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: VN_RED }}>
        <div className="max-w-[1200px] mx-auto px-3">
          <div className="hidden sm:flex items-center overflow-x-auto">
            <button onClick={() => handleNavClick("")}
              className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${!activeNav ? "bg-white text-[#e2001a]" : "text-white hover:bg-red-700"}`}>
              Trang chủ
            </button>
            {NAV_CATS.map((cat) => (
              <button key={cat.id} onClick={() => handleNavClick(cat.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${activeNav === cat.id ? "bg-white" : "text-white hover:bg-red-700"}`}
                style={activeNav === cat.id ? { color: VN_RED } : {}}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="sm:hidden flex items-center justify-between py-2.5">
            <span className="text-white font-semibold text-sm">{NAV_CATS.find((c) => c.id === activeNav)?.label || "Trang chủ"}</span>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white flex items-center gap-1 text-xs">
              Danh mục <ChevronDown size={14} />
            </button>
          </div>
          {mobileOpen && (
            <div className="sm:hidden grid grid-cols-3 gap-1 pb-3">
              <button onClick={() => { handleNavClick(""); setMobileOpen(false); }}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-colors text-center ${!activeNav ? "bg-white text-[#e2001a]" : "text-white hover:bg-red-700"}`}>
                Trang chủ
              </button>
              {NAV_CATS.map((cat) => (
                <button key={cat.id} onClick={() => { handleNavClick(cat.id); setMobileOpen(false); }}
                  className={`px-2 py-1.5 text-xs font-medium rounded transition-colors text-center ${activeNav === cat.id ? "bg-white" : "text-white hover:bg-red-700"}`}
                  style={activeNav === cat.id ? { color: VN_RED } : {}}>
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
