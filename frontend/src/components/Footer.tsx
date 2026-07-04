export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gray-200 bg-white text-gray-600">
      <div className="max-w-[1200px] mx-auto px-3 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4">
              <img
                src="/7news-logo.png"
                alt="7NEWS"
                className="h-14 w-auto max-w-[150px] object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-gray-600 max-w-xs">7NEWS là báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam.</p>
          </div>
          {[
            { title: "Chuyên mục", links: ["Thời sự", "Thế giới", "Kinh doanh", "Giải trí", "Thể thao", "Sức khỏe", "Du lịch"] },
            { title: "Dịch vụ", links: ["7NEWS+", "Tài khoản VIP", "Thông báo", "Bản tin email", "RSS", "Sitemap"] },
            { title: "Liên hệ", links: ["Tòa soạn", "Quảng cáo", "Góc nhìn", "Điều khoản sử dụng", "Chính sách bảo mật"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-gray-900 font-bold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-xs text-gray-600 hover:text-[#e2001a] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 text-[11px] text-center text-gray-500">
          © 2026 7NEWS · Báo điện tử của Hội Khoa học & Kỹ thuật Việt Nam
        </div>
      </div>
    </footer>
  );
}
