export default function Footer() {
  return (
    <footer style={{ background: "#1c1c1c", color: "#aaa" }} className="mt-4">
      <div className="max-w-[1200px] mx-auto px-3 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-start gap-0.5 mb-4">
              <span className="text-3xl font-black leading-none" style={{ color: "#e2001a", fontFamily: "Merriweather, Georgia, serif" }}>VN</span>
              <div className="flex flex-col leading-none mt-0.5 ml-0.5">
                <span className="text-lg font-black tracking-[0.15em]" style={{ color: "#6699cc", fontFamily: "Merriweather, Georgia, serif" }}>EXPRESS</span>
                <span className="text-[9px] text-gray-500 tracking-wide mt-0.5">Báo tiếng Việt nhiều người đọc nhất</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 max-w-xs">VnExpress là báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam.</p>
          </div>
          {[
            { title: "Chuyên mục", links: ["Thời sự", "Thế giới", "Kinh doanh", "Giải trí", "Thể thao", "Sức khỏe", "Du lịch"] },
            { title: "Dịch vụ", links: ["VnExpress+", "Tài khoản VIP", "Thông báo", "Bản tin email", "RSS", "Sitemap"] },
            { title: "Liên hệ", links: ["Tòa soạn", "Quảng cáo", "Góc nhìn", "Điều khoản sử dụng", "Chính sách bảo mật"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 text-[11px] text-center" style={{ borderColor: "#333", color: "#555" }}>
          © 2026 VnExpress · Báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam
        </div>
      </div>
    </footer>
  );
}
