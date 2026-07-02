import { Clock, Eye, Trash2 } from "lucide-react";
import { formatRelativeTime } from "../utils/date";

export default function ArticleCard({ article, horizontal = false, onClick, onDelete }: {
  article: any; horizontal?: boolean; onClick?: () => void; onDelete?: (e: React.MouseEvent) => void;
}) {
  const displayTime = formatRelativeTime(article.created_at || article.time);

  if (horizontal) {
    return (
      <div className="group cursor-pointer flex gap-4 items-start" onClick={onClick}>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-[#e2001a] transition-colors line-clamp-3">{article.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Clock size={10} /> {displayTime}</span>
            {article.views !== undefined && <span className="flex items-center gap-1"><Eye size={10} /> {article.views}</span>}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                className="ml-auto text-red-500 hover:text-red-700 transition-colors z-10 cursor-pointer"
                title="Xoá bài viết"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="overflow-hidden rounded w-[100px] h-[68px] flex-shrink-0">
          <img src={article.img || article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
    );
  }
  return (
    <div className="group cursor-pointer flex flex-col h-full" onClick={onClick}>
      <div className="overflow-hidden rounded mb-2">
        <img src={article.img || article.image_url} alt={article.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h3 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-[#e2001a] transition-colors">{article.title}</h3>
      {article.desc && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{article.desc}</p>}
      <div className="mt-auto pt-2 flex items-center gap-3 text-[10px] text-gray-400">
        <span className="flex items-center gap-1"><Clock size={10} /> {displayTime}</span>
        {article.comments !== undefined && <span>{article.comments} ý kiến</span>}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(e); }}
            className="ml-auto text-red-500 hover:text-red-700 transition-colors z-10 cursor-pointer"
            title="Xoá bài viết"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
