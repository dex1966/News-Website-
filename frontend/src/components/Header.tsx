import { useState, useEffect } from "react";
import { Search, Bell, User, Menu, ChevronDown, UserCircle, LogOut, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../app/components/ui/dropdown-menu";

const VN_RED = "#e2001a";

function getUserInitials(name: string | undefined): string {
  if (!name) return "U";

  const words = name.trim().split(/\s+/).filter(Boolean);
  const selectedWords = words.length >= 2 ? words.slice(-2) : words;

  return selectedWords
    .map((word) => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase())
    .join("");
}

type HeaderProps = {
  currentUser: any;
  handleLogout: () => void;
  setLoginOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: () => void;
  activeNav: string;
  handleNavClick: (id: string) => void;
  navCategories: { id: string; label: string }[];
};

export default function Header({
  currentUser, handleLogout, setLoginOpen,
  searchQuery, setSearchQuery, handleSearch,
  activeNav, handleNavClick, navCategories
}: HeaderProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const todayLabel = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
  const userInitials = getUserInitials(currentUser?.name);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-3 py-2 flex items-center gap-4 text-xs text-gray-500">
          <button onClick={() => handleNavClick("")} className="cursor-pointer flex-shrink-0 flex items-baseline gap-1">
            <img
              src="/7news-logo.png"
              alt="7NEWS"
              className="h-12 w-auto max-w-[150px] object-contain sm:h-14"
            />
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <span className="font-semibold text-gray-700 whitespace-nowrap capitalize">{todayLabel}</span>
            <div className="flex items-center gap-3">
              {["Tin sáng", "Thư giãn", "Infographics", "Video"].map((l) => (
                <a key={l} href="#" className="hover:text-[#e2001a] transition-colors cursor-pointer">{l}</a>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="w-full max-w-md relative">
              <input type="text" placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#e2001a] transition-colors" />
              <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#e2001a]" onClick={handleSearch} />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === "admin" && (
                  <>
                    <button
                      onClick={() => navigate("/admin")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full transition-colors shadow-sm cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/admin/create")}
                      className="flex items-center gap-1 px-3 py-1 bg-[#e2001a] hover:bg-[#c10016] text-white text-xs font-semibold rounded-full transition-colors shadow-sm cursor-pointer"
                    >
                      + Viết bài
                    </button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1 pr-2 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2001a] text-xs font-black text-white">
                        {userInitials}
                      </span>
                      <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-black uppercase leading-none text-gray-500">
                        {currentUser.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                      <p className="text-[11px] font-bold uppercase text-gray-400">{currentUser.role === 'admin' ? 'Admin' : 'User'}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <a href="#/">
                        <MessageSquare size={16} />
                        Ý kiến của bạn
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <UserCircle size={16} />
                      Thông tin cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#e2001a]">
                      <LogOut size={16} />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-[#e2001a] hover:text-[#e2001a] transition-colors cursor-pointer"
                  aria-label="Thông báo"
                >
                  <Bell size={18} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-1 hover:text-[#e2001a] transition-colors cursor-pointer" onClick={() => setLoginOpen(true)}>
                <User size={12} /> Đăng nhập
              </button>
            )}
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 text-gray-600 cursor-pointer"><Search size={20} /></button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-gray-600 cursor-pointer"><Menu size={20} /></button>
            </div>
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
              className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${!activeNav ? "bg-white text-[#e2001a]" : "text-white hover:bg-red-700"}`}>
              Trang chủ
            </button>
            {navCategories.map((cat) => (
              <button key={cat.id} onClick={() => handleNavClick(cat.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${activeNav === cat.id ? "bg-white" : "text-white hover:bg-red-700"}`}
                style={activeNav === cat.id ? { color: VN_RED } : {}}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="sm:hidden flex items-center justify-between py-2.5">
            <span className="text-white font-semibold text-sm">{navCategories.find((c) => c.id === activeNav)?.label || "Trang chủ"}</span>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white flex items-center gap-1 text-xs cursor-pointer">
              Danh mục <ChevronDown size={14} />
            </button>
          </div>
          {mobileOpen && (
            <div className="sm:hidden grid grid-cols-3 gap-1 pb-3">
              <button onClick={() => { handleNavClick(""); setMobileOpen(false); }}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-colors text-center cursor-pointer ${!activeNav ? "bg-white text-[#e2001a]" : "text-white hover:bg-red-700"}`}>
                Trang chủ
              </button>
              {navCategories.map((cat) => (
                <button key={cat.id} onClick={() => { handleNavClick(cat.id); setMobileOpen(false); }}
                  className={`px-2 py-1.5 text-xs font-medium rounded transition-colors text-center cursor-pointer ${activeNav === cat.id ? "bg-white" : "text-white hover:bg-red-700"}`}
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
