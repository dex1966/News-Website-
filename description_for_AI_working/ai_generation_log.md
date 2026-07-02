## 2026-07-02 - Delete VNExpress RSS backend endpoint

### Request
User confirmed deleting the backend part of the external VNExpress viewing mode.

### Implementation Summary
- Deleted source file:
  - `backend/api/external_articles.php`
- Deleted MAMP runtime file:
  - `/Applications/MAMP/htdocs/news-backend/api/external_articles.php`

### Verification Completed
- Runtime source search found no references in `frontend/src` or `backend` for:
  - `external_articles`
  - `getVNExpress`
  - `Xem VNExpress`
  - `viewMode`
  - `tin-moi.rss`
  - `vnexpress.net/rss`
- Confirmed MAMP endpoint file no longer exists.
- `./node_modules/.bin/vite build`: passed.

### Impact
- Directly opening `http://localhost:8888/news-backend/api/external_articles.php` should now return 404.
- Main database-backed news website features remain intact.

## 2026-07-02 - Remove VNExpress RSS frontend mode

### Request
User agreed to the recommended approach:
- Remove the `Xem VNExpress` button and frontend RSS flow.
- Keep backend `external_articles.php` for now to avoid unnecessary backend deletion risk.

### Reason
The RSS endpoint depends on fetching `https://vnexpress.net/rss/tin-moi.rss` from PHP/MAMP. If that fetch fails, the endpoint returns HTTP 500 and causes console errors.

### Implementation Summary
- Removed `viewMode` state from `frontend/src/app/App.tsx`.
- Removed the frontend branch that called `api.getVNExpressNews()`.
- Removed `viewMode` props from `Header` and `HomePage`.
- Removed the `Xem VNExpress` button from `frontend/src/components/Header.tsx`.
- Simplified the sports section in `frontend/src/pages/HomePage.tsx` to always use database-backed sports articles.
- Removed unused API service wrappers:
  - `getVNExpressArticles`
  - `getVNExpressNews`

### Impact
- Frontend no longer calls `external_articles.php`.
- Main PHP + MySQL news website features remain intact.
- The optional external VNExpress RSS viewing mode is removed from UI.

### Verification Completed
- `./node_modules/.bin/vite build`: passed.
- Search check in `frontend/src`: no remaining references to `viewMode`, `getVNExpressNews`, `getVNExpressArticles`, `external_articles`, or `Xem VNExpress`.

## 2026-07-02 - Fix MAMP market_data.php 404/CORS

### Request
User reported browser console errors:
- `GET http://localhost:8888/news-backend/api/market_data.php 404`
- CORS blocked from `http://localhost:5173`
- `Sidebar.tsx: Failed to fetch market data`

### Cause
The source file existed in `backend/api/market_data.php`, but the MAMP runtime path did not have:
- `/Applications/MAMP/htdocs/news-backend/api/market_data.php`

Because Apache returned 404, the response did not include CORS headers.

### Resolution
- Synced `backend/api/market_data.php` to `/Applications/MAMP/htdocs/news-backend/api/market_data.php`.

### Verification Completed
- `php -l backend/api/market_data.php`: passed.
- `php -l /Applications/MAMP/htdocs/news-backend/api/market_data.php`: passed.
- Confirmed the MAMP file exists.

### Manual Browser Test
- Open `http://localhost:8888/news-backend/api/market_data.php`
- Expected JSON keys: `stocks`, `fx`, `gold`.

## 2026-07-02 - Cursor affordance and 5 seeded users

### Request
User confirmed:
- Add pointer cursor behavior for clickable UI areas because hover currently does not clearly show what can be clicked.
- Add 5 users with role `user`.
- Use shared password `user123@`.

### Implementation Summary
- Added global cursor behavior in:
  - `frontend/src/styles/globals.css`
  - imported by `frontend/src/styles/index.css`
- Added explicit cursor classes in main interactive UI files:
  - header navigation and account actions,
  - article cards and delete buttons,
  - section tabs,
  - video cards/modal controls,
  - article detail buttons,
  - admin sidebar/dashboard/article/user actions,
  - login/profile/create/edit forms.
- Updated `backend/config/seed_users.php` with 5 new role `user` accounts.

### Seeded Users
- `dohoanghai@gmail.com` / `user123@` / ĐỖ HOÀNG HẢI
- `nguyennhatnam@gmail.com` / `user123@` / NGUYỄN NHẬT NAM
- `vulehoangnhat@gmail.com` / `user123@` / VŨ LÊ HOÀNG NHẤT
- `lethibichtram@gmail.com` / `user123@` / LÊ THỊ BÍCH TRÂM
- `phanthanhtung@gmail.com` / `user123@` / PHAN THANH TÙNG

### Manual Step Needed
After syncing backend to MAMP, run:
- `http://localhost:8888/news-backend/config/seed_users.php`

### Verification Plan
- `php -l backend/config/seed_users.php`
- frontend build with `./node_modules/.bin/vite build`
- browser hover check on homepage, article page, video section, auth/profile forms, and admin pages.

### Verification Completed
- `php -l backend/config/seed_users.php`: passed.
- `./node_modules/.bin/vite build`: passed.
- Synced `backend/config/seed_users.php` to `/Applications/MAMP/htdocs/news-backend/config/seed_users.php`.
- `php -l /Applications/MAMP/htdocs/news-backend/config/seed_users.php`: passed.

## 2026-07-02 - Admin dashboard and user permission management

### Request
User asked to implement an Admin Dashboard with:
- management overview,
- article management,
- user role/permission management,
- today's newly posted news statistics,
- and to save implementation status in `.agents/TASK_STATUS.md` plus this generation log.

### Implementation Summary
- Added backend dashboard API:
  - `backend/api/dashboard.php`
  - Returns total articles, users, admins, categories, today article count, latest articles, and top-viewed articles.
  - Requires admin `user_id`.
- Added backend user management API:
  - `backend/api/users.php`
  - Supports `GET` users, `PUT` role update, `DELETE` user.
  - Blocks non-admin access, self-delete, self-demotion, and removing the last admin.
- Added frontend admin pages:
  - `frontend/src/app/AdminLayout.tsx`
  - `frontend/src/app/AdminDashboardPage.tsx`
  - `frontend/src/app/AdminArticlesPage.tsx`
  - `frontend/src/app/AdminUsersPage.tsx`
- Added routes:
  - `/admin`
  - `/admin/articles`
  - `/admin/users`
- Updated header:
  - Admin users now see a `Dashboard` button beside `+ Viết bài`.
- Updated API service:
  - `getDashboard`
  - `getUsers`
  - `updateUserRole`
  - `deleteUser`

### Database Assumptions
- The prior migration `backend/config/migrate_admins.php` must be run on MAMP.
- Required DB shape:
  - `users`
  - `admins`
  - `articles.admin_id`
  - `categories`

### Notes
- Source code uses existing names `users.id`, `articles.id`, `created_at`; it does not rename columns to the ERD labels like `user_id` or `articles_id`.
- Admin identity is represented as `users.role = 'admin'` plus a row in `admins`.
- `articles.author` remains as fallback for old data, while new API output prefers `author_name`.

### Verification
- PHP syntax checks passed for:
  - `backend/api/dashboard.php`
  - `backend/api/users.php`
  - `backend/api/articles.php`
- Frontend production build passed with:
  - `./node_modules/.bin/vite build`
- Backend files were synced to:
  - `/Applications/MAMP/htdocs/news-backend/api/dashboard.php`
  - `/Applications/MAMP/htdocs/news-backend/api/users.php`
  - `/Applications/MAMP/htdocs/news-backend/api/articles.php`
  - `/Applications/MAMP/htdocs/news-backend/config/seed_users.php`
  - `/Applications/MAMP/htdocs/news-backend/config/migrate_admins.php`
- PHP syntax checks also passed on the synced MAMP `dashboard.php` and `users.php`.

### Manual Browser Test Still Needed
Codex terminal could not connect to `localhost:8888`, so verify through browser:
- `http://localhost:8888/news-backend/api/dashboard.php?user_id=1`
- `http://localhost:8888/news-backend/api/users.php?user_id=1`
- `http://localhost:5173/admin`
- `http://localhost:5173/admin/articles`
- `http://localhost:5173/admin/users`
