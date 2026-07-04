# News Website

React + TypeScript + Vite news website project with a PHP backend API.

The project includes:

- Public news homepage
- Article detail page
- Search and category filtering
- Login/register modal
- User profile page
- Admin dashboard
- Admin article management
- Admin user management
- PHP API endpoints for articles, categories, users, auth, dashboard, upload, videos, and market data

## Requirements

- Node.js 18+ recommended
- npm
- PHP runtime or local web server such as XAMPP/MAMP/Laragon
- Database configured for the PHP backend

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run Frontend

```bash
cd frontend
npm run dev
```

Vite will start the development server and print the local URL in the terminal.

## Build Frontend

```bash
cd frontend
npm run build
```

The production build is generated in:

```txt
frontend/dist/
```

## Backend Setup

Backend source files are in:

```txt
backend/
```

The frontend API client currently points to:

```txt
http://localhost:8888/news-backend/api
```

This base URL is defined in:

```txt
frontend/src/services/api.ts
```

When running locally, make sure the PHP backend is hosted so this URL maps to:

```txt
backend/api/
```

If your local PHP server uses another host, port, or folder name, update `BASE_URL` in `frontend/src/services/api.ts`.

## Project Structure

```txt
.
├── README.md
├── Structrure-admin.md
├── backend/
│   ├── api/
│   │   ├── articles.php
│   │   ├── auth.php
│   │   ├── categories.php
│   │   ├── dashboard.php
│   │   ├── market_data.php
│   │   ├── upload.php
│   │   ├── users.php
│   │   └── videos.php
│   └── config/
│       ├── cors.php
│       ├── db.php
│       ├── migrate_admins.php
│       ├── migrate_users.php
│       ├── seed_all_articles.php
│       └── seed_users.php
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── dist/
    └── src/
        ├── app/
        ├── components/
        ├── data/
        ├── pages/
        ├── services/
        ├── styles/
        ├── utils/
        └── main.tsx
```

## Frontend Source Structure

```txt
frontend/src/
├── main.tsx                 # React entry and route definitions
├── app/                     # App-level pages and admin pages
├── pages/                   # Public homepage page
├── components/              # Shared UI components
├── services/                # API client
├── data/                    # Static/mock data constants
├── styles/                  # Global CSS, theme, fonts, Tailwind imports
└── utils/                   # Shared utilities
```

## Routing

Routes are defined in:

```txt
frontend/src/main.tsx
```

Current routes:

```txt
/                 -> frontend/src/app/App.tsx
/article/:id      -> frontend/src/app/ArticlePage.tsx
/admin            -> frontend/src/app/AdminDashboardPage.tsx
/admin/articles   -> frontend/src/app/AdminArticlesPage.tsx
/admin/users      -> frontend/src/app/AdminUsersPage.tsx
/admin/create     -> frontend/src/app/CreateArticlePage.tsx
/admin/edit/:id   -> frontend/src/app/EditArticlePage.tsx
/profile          -> frontend/src/app/ProfilePage.tsx
```

## API Layer

Frontend API calls are centralized in:

```txt
frontend/src/services/api.ts
```

Main backend endpoints:

```txt
backend/api/articles.php
backend/api/auth.php
backend/api/categories.php
backend/api/dashboard.php
backend/api/market_data.php
backend/api/upload.php
backend/api/users.php
backend/api/videos.php
```

Common frontend API methods:

- `getArticles`
- `getArticle`
- `getArticlesByCategory`
- `searchArticles`
- `getCategories`
- `getMarketData`
- `getDashboard`
- `getUsers`
- `login`
- `register`
- `updateProfile`
- `updateUserRole`
- `deleteUser`
- `deleteArticle`
- `editArticle`

## Admin Frontend

Admin pages are in:

```txt
frontend/src/app/
```

Admin-related files:

```txt
frontend/src/app/AdminLayout.tsx
frontend/src/app/AdminDashboardPage.tsx
frontend/src/app/AdminArticlesPage.tsx
frontend/src/app/AdminUsersPage.tsx
frontend/src/app/CreateArticlePage.tsx
frontend/src/app/EditArticlePage.tsx
```

Admin structure details are documented in:

```txt
Structrure-admin.md
```

## Styling

Global styles are loaded from:

```txt
frontend/src/styles/index.css
```

`index.css` imports:

```txt
frontend/src/styles/fonts.css
frontend/src/styles/tailwind.css
frontend/src/styles/theme.css
frontend/src/styles/globals.css
```

## Main Commands

Run from `frontend/`:

```bash
npm install
npm run dev
npm run build
```

## Notes

- Keep route changes in `frontend/src/main.tsx`.
- Keep shared API calls in `frontend/src/services/api.ts`.
- Update `BASE_URL` in `frontend/src/services/api.ts` if the PHP backend URL changes.
- Build output belongs to `frontend/dist/`.
