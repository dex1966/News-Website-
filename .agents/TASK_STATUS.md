# Task Status

File này lưu trữ trạng thái của các task đang và đã thực hiện.

## Lịch sử Task

### 2026-07-02 - Xoá backend endpoint VNExpress RSS ngoài

**Trạng thái:** Đã triển khai, đã xoá source/runtime, đã kiểm tra build.

**Mục tiêu:**
- Xoá hẳn backend cho chế độ “xem tin VNExpress bên ngoài”.
- Không còn endpoint RSS ngoài phụ thuộc `https://vnexpress.net/rss/tin-moi.rss`.

**Đã thực hiện:**
- Xoá `backend/api/external_articles.php` trong source.
- Xoá `/Applications/MAMP/htdocs/news-backend/api/external_articles.php` trong runtime MAMP.

**Kiểm thử đã chạy:**
- `rg -n "external_articles|getVNExpress|Xem VNExpress|viewMode|tin-moi\\.rss|vnexpress\\.net/rss" frontend/src backend`: không còn kết quả.
- `ls -l /Applications/MAMP/htdocs/news-backend/api/external_articles.php`: không tồn tại.
- `./node_modules/.bin/vite build` trong `frontend`: pass.

**Tác động:**
- Nếu mở trực tiếp `http://localhost:8888/news-backend/api/external_articles.php`, kết quả đúng là `404 Not Found`.
- Không ảnh hưởng chức năng tin tức chính dùng database: articles, categories, auth, admin dashboard, users, upload, videos, market data.

### 2026-07-02 - Gỡ nút Xem VNExpress và luồng gọi RSS ngoài

**Trạng thái:** Đã triển khai source code và build frontend pass.

**Lý do:**
- API `external_articles.php` phụ thuộc RSS ngoài `https://vnexpress.net/rss/tin-moi.rss`.
- Khi MAMP/PHP không fetch được RSS, frontend báo `500 Internal Server Error`.
- Chức năng này không phải yêu cầu lõi của website tin tức PHP + MySQL.

**Quyết định đã confirm:**
- Gỡ khỏi UI và luồng frontend theo hướng ít rủi ro.
- Giữ file backend `backend/api/external_articles.php` lại, nhưng frontend không gọi nữa.

**Frontend đã sửa:**
- `frontend/src/components/Header.tsx`: xoá nút `Xem VNExpress`.
- `frontend/src/app/App.tsx`: xoá state `viewMode` và nhánh gọi `api.getVNExpressNews()`.
- `frontend/src/pages/HomePage.tsx`: xoá logic hiển thị bài từ VNExpress mode; section thể thao chỉ dùng bài trong DB.
- `frontend/src/services/api.ts`: xoá wrapper `getVNExpressArticles()` và `getVNExpressNews()`.

**Tác động:**
- Không còn request `http://localhost:8888/news-backend/api/external_articles.php?limit=20` từ frontend.
- Không ảnh hưởng chức năng tin tức chính: trang chủ, danh mục, chi tiết bài viết, CRUD admin, dashboard, user/admin.
- Mất chức năng phụ xem tin RSS bên ngoài.

**Kiểm thử đã chạy:**
- `./node_modules/.bin/vite build` trong `frontend`: pass.
- `rg` trong `frontend/src`: không còn reference tới `viewMode`, `getVNExpressNews`, `getVNExpressArticles`, `external_articles`, `Xem VNExpress`.

### 2026-07-02 - Fix lỗi market_data.php 404/CORS trên MAMP

**Trạng thái:** Đã xử lý.

**Vấn đề:**
- Frontend gọi `http://localhost:8888/news-backend/api/market_data.php`.
- MAMP trả `404 Not Found` vì thiếu file `market_data.php` trong `/Applications/MAMP/htdocs/news-backend/api`.
- Browser báo thêm CORS vì response 404 từ Apache không có header `Access-Control-Allow-Origin`.

**Đã thực hiện:**
- Sync `backend/api/market_data.php` sang `/Applications/MAMP/htdocs/news-backend/api/market_data.php`.

**Kiểm thử đã chạy:**
- `php -l backend/api/market_data.php`: pass.
- `php -l /Applications/MAMP/htdocs/news-backend/api/market_data.php`: pass.
- Đã kiểm tra file tồn tại ở MAMP.

**Cần test thủ công trên browser:**
```txt
http://localhost:8888/news-backend/api/market_data.php
```

Kỳ vọng: response JSON có các key `stocks`, `fx`, `gold`.

### 2026-07-02 - Cursor hover cho vùng click và seed thêm 5 user

**Trạng thái:** Đã triển khai source code, đã kiểm tra build/lint, đã sync seed backend sang MAMP.

**Mục tiêu:**
- Khi di chuột vào vùng có thể bấm, con trỏ phải chuyển sang pointer để người dùng biết có thể tương tác.
- Thêm 5 tài khoản user theo danh sách nhóm cung cấp.

**Frontend đã sửa:**
- `frontend/src/styles/globals.css`: thêm rule cursor chung cho `button`, `a[href]`, `select`, role button và trạng thái disabled.
- `frontend/src/styles/index.css`: import `globals.css`.
- Bổ sung `cursor-pointer`/`disabled:cursor-not-allowed` ở các vùng tương tác chính:
  - `frontend/src/components/Header.tsx`
  - `frontend/src/components/ArticleCard.tsx`
  - `frontend/src/components/SectionHeader.tsx`
  - `frontend/src/components/VideoSection.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/app/ArticlePage.tsx`
  - `frontend/src/app/AdminLayout.tsx`
  - `frontend/src/app/AdminDashboardPage.tsx`
  - `frontend/src/app/AdminArticlesPage.tsx`
  - `frontend/src/app/AdminUsersPage.tsx`
  - `frontend/src/app/LoginModal.tsx`
  - `frontend/src/app/ProfilePage.tsx`
  - `frontend/src/app/CreateArticlePage.tsx`
  - `frontend/src/app/EditArticlePage.tsx`

**Backend đã sửa:**
- `backend/config/seed_users.php`: thêm 5 user role `user`, password chung `user123@`.

**User seed mới:**
- `dohoanghai@gmail.com` - ĐỖ HOÀNG HẢI
- `nguyennhatnam@gmail.com` - NGUYỄN NHẬT NAM
- `vulehoangnhat@gmail.com` - VŨ LÊ HOÀNG NHẤT
- `lethibichtram@gmail.com` - LÊ THỊ BÍCH TRÂM
- `phanthanhtung@gmail.com` - PHAN THANH TÙNG

**Bước cần chạy trên MAMP sau khi sync backend:**
```txt
http://localhost:8888/news-backend/config/seed_users.php
```

**Kiểm thử đã chạy:**
- `php -l backend/config/seed_users.php`: pass.
- `./node_modules/.bin/vite build` trong `frontend`: pass.
- Đã sync `backend/config/seed_users.php` sang `/Applications/MAMP/htdocs/news-backend/config/seed_users.php`.
- `php -l /Applications/MAMP/htdocs/news-backend/config/seed_users.php`: pass.

**Cần test thủ công:**
- Hover navbar, logo, search icon, nút đăng nhập/đăng xuất/profile/dashboard.
- Hover card bài viết, danh sách đọc mới nhất, video section.
- Hover admin sidebar, bảng bài viết, bảng user, select phân quyền.
- Kiểm tra bảng `users` trong phpMyAdmin có 5 tài khoản mới.

### 2026-07-02 - Admin dashboard, quản lý bài viết và phân quyền người dùng

**Trạng thái:** Đã triển khai source code, đã sync backend sang MAMP, đã kiểm tra build/lint. Cần test UI bằng browser.

**Mục tiêu:**
- Bổ sung trang quản trị rõ ràng cho admin thay vì chỉ có nút tạo/sửa/xóa bài lẻ.
- Có dashboard thống kê tổng bài viết, bài viết hôm nay, số user, số danh mục.
- Có trang quản lý bài viết dạng bảng.
- Có trang quản lý người dùng và đổi role `user`/`admin`.
- Backend phải kiểm tra quyền admin khi gọi API dashboard/user/CRUD.

**Backend đã thêm/sửa:**
- `backend/api/dashboard.php`: API thống kê dashboard, yêu cầu `user_id` của admin.
- `backend/api/users.php`: API danh sách user, đổi role, xóa user, yêu cầu admin.
- `backend/api/articles.php`: đã kiểm tra admin cho `POST`, `PUT`, `DELETE`; trả thêm `author_name` từ quan hệ `articles -> admins -> users`.
- `backend/config/migrate_admins.php`: migration tạo bảng `admins`, thêm `articles.admin_id`.
- `backend/config/seed_users.php`: seed thêm record `admins` cho các user có role admin.

**Frontend đã thêm/sửa:**
- `frontend/src/app/AdminLayout.tsx`: layout chung cho admin dashboard.
- `frontend/src/app/AdminDashboardPage.tsx`: trang tổng quan.
- `frontend/src/app/AdminArticlesPage.tsx`: trang quản lý bài viết.
- `frontend/src/app/AdminUsersPage.tsx`: trang quản lý user/phân quyền.
- `frontend/src/main.tsx`: thêm routes `/admin`, `/admin/articles`, `/admin/users`.
- `frontend/src/components/Header.tsx`: thêm nút `Dashboard` cho admin.
- `frontend/src/services/api.ts`: thêm API dashboard/users và gửi `user_id` khi thao tác admin.

**Database liên quan:**
- Cần có bảng `admins`.
- Cần có cột `articles.admin_id`.
- Quan hệ mong muốn:
  - `users 1 -- 0..1 admins`
  - `admins 1 -- n articles`
  - `categories 1 -- n articles`

**Bước cần chạy trên MAMP sau khi sync backend:**
```txt
http://localhost:8888/news-backend/config/migrate_admins.php
```

**Rủi ro/cần kiểm thử:**
- Đổi role admin cuối cùng phải bị chặn.
- Admin không được tự xóa chính mình.
- User thường không được gọi API dashboard/users/CRUD.
- Khi hạ admin xuống user, bài viết cũ sẽ mất liên kết `admin_id` nếu record trong `admins` bị xóa theo FK.

**Kiểm thử đã chạy:**
- `php -l backend/api/dashboard.php`: pass.
- `php -l backend/api/users.php`: pass.
- `php -l backend/api/articles.php`: pass.
- `./node_modules/.bin/vite build` trong `frontend`: pass.
- Đã sync backend sang `/Applications/MAMP/htdocs/news-backend`.
- `php -l` trên bản MAMP của `dashboard.php` và `users.php`: pass.

**Cần test thủ công trên browser do terminal Codex không kết nối được `localhost:8888`:**
```txt
http://localhost:8888/news-backend/api/dashboard.php?user_id=1
http://localhost:8888/news-backend/api/users.php?user_id=1
http://localhost:5173/admin
http://localhost:5173/admin/articles
http://localhost:5173/admin/users
```
