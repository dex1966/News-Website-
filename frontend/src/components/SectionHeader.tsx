export default function SectionHeader({ title, tabs, activeTab, onTab }: {
  title: string;
  tabs: string[];
  activeTab?: string;
  onTab?: (t: string) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
      <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider">{title}</h2>
      <div className="hidden sm:flex items-center gap-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onTab?.(t)}
            className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${activeTab === t ? "text-[#e2001a] border-[#e2001a]" : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            style={{ marginBottom: "-9px" }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
