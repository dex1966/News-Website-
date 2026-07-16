import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../services/api";

function getVisitorId() {
    const storageKey = "visitor_id";
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing;

    const value = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem(storageKey, value);
    return value;
}

function getCurrentUserId() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        return user?.id ? Number(user.id) : null;
    } catch {
        return null;
    }
}

function getArticleId(pathname: string) {
    const match = pathname.match(/^\/article\/(\d+)/);
    return match ? Number(match[1]) : null;
}

export default function VisitTracker() {
    const location = useLocation();
    const trackedPathRef = useRef("");

    useEffect(() => {
        const pagePath = `${location.pathname}${location.search}`;
        if (location.pathname.startsWith("/admin")) return;
        if (trackedPathRef.current === pagePath) return;

        trackedPathRef.current = pagePath;
        api.trackVisit({
            page_path: pagePath,
            page_title: document.title,
            article_id: getArticleId(location.pathname),
            user_id: getCurrentUserId(),
            visitor_id: getVisitorId(),
        }).catch(() => {
            // Tracking must not block the main page flow.
        });
    }, [location.pathname, location.search]);

    return null;
}
