import { useEffect, useState, useRef } from "react";
import { Youtube, Play, X, ExternalLink } from "lucide-react";

const VN_RED = "#e2001a";
const API_BASE = "http://localhost/news-backend/api";

interface VideoItem {
    id: string;
    title: string;
    thumbnail: string;
    published: string;
    embed_url: string;
    watch_url: string;
}

function formatDate(iso: string) {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
        return "";
    }
}

export default function VideoSection() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE}/videos.php?limit=8`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setVideos(data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveVideo(null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    if (loading) return (
        <div className="bg-white rounded border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Youtube size={18} style={{ color: VN_RED }} />
                <span className="text-sm font-black uppercase tracking-wider text-gray-700">Video VTV24</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded overflow-hidden animate-pulse">
                        <div className="bg-gray-200" style={{ aspectRatio: "16/9" }}></div>
                        <div className="mt-2 h-3 bg-gray-200 rounded w-full"></div>
                        <div className="mt-1 h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (videos.length === 0) return null;

    const [featured, ...rest] = videos;

    return (
        <>
            <div className="bg-white rounded border border-gray-200 p-4 mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded text-white text-xs font-bold" style={{ background: VN_RED }}>
                            <Youtube size={14} />
                            VTV24
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider text-gray-700">Video mới nhất</span>
                    </div>
                    <a
                        href="https://www.youtube.com/@vtv24"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#e2001a] transition-colors"
                    >
                        Xem kênh <ExternalLink size={11} />
                    </a>
                </div>

                {/* Featured video (large) + side list */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-4">
                    {/* Featured */}
                    <div
                        className="group relative cursor-pointer rounded overflow-hidden shadow-sm"
                        onClick={() => setActiveVideo(featured)}
                        style={{ aspectRatio: "16/9" }}
                    >
                        <img
                            src={featured.thumbnail}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{ background: VN_RED }}>
                                <Play size={22} className="text-white ml-1" fill="white" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
                            <p className="text-white text-sm font-bold line-clamp-2 leading-snug">{featured.title}</p>
                            <p className="text-gray-300 text-[11px] mt-1">{formatDate(featured.published)}</p>
                        </div>
                    </div>

                    {/* Side video list */}
                    <div className="flex flex-col gap-2">
                        {rest.slice(0, 4).map(video => (
                            <div
                                key={video.id}
                                className="flex gap-2.5 cursor-pointer group hover:bg-gray-50 rounded p-1.5 transition-colors"
                                onClick={() => setActiveVideo(video)}
                            >
                                <div className="relative flex-shrink-0 rounded overflow-hidden" style={{ width: 100, aspectRatio: "16/9" }}>
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                        <Play size={14} className="text-white" fill="white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 line-clamp-3 leading-snug group-hover:text-[#e2001a] transition-colors">{video.title}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{formatDate(video.published)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom row of small thumbnails */}
                {rest.length > 4 && (
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                        {rest.slice(4, 7).map(video => (
                            <div
                                key={video.id}
                                className="group cursor-pointer rounded overflow-hidden"
                                onClick={() => setActiveVideo(video)}
                            >
                                <div className="relative" style={{ aspectRatio: "16/9" }}>
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 flex items-center justify-center transition-colors">
                                        <Play size={16} className="text-white" fill="white" />
                                    </div>
                                </div>
                                <p className="text-[11px] font-semibold text-gray-700 mt-1.5 line-clamp-2 leading-snug group-hover:text-[#e2001a] transition-colors px-0.5">{video.title}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Video Player */}
            {activeVideo && (
                <div
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setActiveVideo(null); }}
                    ref={modalRef}
                >
                    <div className="bg-black rounded-xl overflow-hidden w-full max-w-3xl shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between px-4 py-3 bg-gray-900">
                            <div className="flex-1 mr-4">
                                <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">{activeVideo.title}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                                        <Youtube size={11} /> VTV24
                                    </span>
                                    <span className="text-[10px] text-gray-400">{formatDate(activeVideo.published)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                    href={activeVideo.watch_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                    title="Xem trên YouTube"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* YouTube Iframe */}
                        <div style={{ aspectRatio: "16/9" }}>
                            <iframe
                                src={`${activeVideo.embed_url}?autoplay=1&rel=0`}
                                title={activeVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
