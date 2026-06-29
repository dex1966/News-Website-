import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import App from "./app/App";
import ArticlePage from "./app/ArticlePage";
import CreateArticlePage from "./app/CreateArticlePage";
import EditArticlePage from "./app/EditArticlePage";
import ProfilePage from "./app/ProfilePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/admin/create" element={<CreateArticlePage />} />
        <Route path="/admin/edit/:id" element={<EditArticlePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);