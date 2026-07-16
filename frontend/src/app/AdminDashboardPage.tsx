import { type ReactNode, useEffect, useState } from "react";
import { Activity, Eye, FileText, FolderOpen, MousePointerClick, Newspaper, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user" ) || "null");
    } catch {
        return null;
    }
}

const numberFormatter = new Intl.NumberFormat("vi-VN");

function formatNumber(value: number) {
    return numberFormatter.format(value || 0);
}

function getTodayValue() {
    return getDateValueWithOffset(0);
}

function getDateValueWithOffset(dayOffset: number) {
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 10);
}

function getRoundedMax(value: number) {
    if (value <= 10) return 10;
    if (value <= 100) return Math.ceil(value / 10) * 10;
    if (value <= 1000) return Math.ceil(value / 100) * 100;
    return Math.ceil(value / 1000) * 1000;
}

function getTopChartTicks(maxValue: number) {
    const step = Math.max(1, Math.ceil(maxValue / 5));
    return Array.from({ length: 6 }, (_, index) => index * step);
}

function mergeDailyStats(visits: any[] = [], articles: any[] = []) {
    const rows = new Map<string, any>();

    visits.forEach(item => {
        rows.set(item.date, {
            date: item.date,
            label: item.label,
            visits: Number(item.total || 0),
            articles: 0,
        });
    });

    articles.forEach(item => {
        const existing = rows.get(item.date) || {
            date: item.date,
            label: item.label,
            visits: 0,
            articles: 0,
        };
        existing.articles = Number(item.total || 0);
        rows.set(item.date, existing);
    });

    return Array.from(rows.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function SquareDot(props: any) {
    const { cx, cy } = props;
    if (typeof cx !== "number" || typeof cy !== "number") return null;

    return (
        <rect
            x={cx - 3}
            y={cy - 3}
            width={6}
            height={6}
            fill="#e2001a"
            stroke="#e2001a"
            strokeWidth={1}
        />
    );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-50 text-[#e2001a] flex items-center justify-center">
                <Icon size={19} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-semibold">{label}</p>
                <p className="text-2xl font-black text-gray-900">{formatNumber(value)}</p>
            </div>
        </div>
    );
}

function ChartPanel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                <h2 className="text-sm font-black text-gray-800">{title}</h2>
                {action}
            </div>
            <div className="h-[290px] p-4">
                {children}
            </div>
        </div>
    );
}

function ArticleList({ title, articles, showRank = false }: { title: string; articles: any[]; showRank?: boolean }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-black text-gray-800">{title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {articles.length === 0 ? (
                    <p className="px-4 py-5 text-sm text-gray-400">Chưa có dữ liệu.</p>
                ) : articles.map((article, index) => (
                    <button
                        key={article.id}
                        onClick={() => navigate(`/article/${article.id}`)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3"
                    >
                        {showRank && (
                            <span className="mt-0.5 w-6 h-6 rounded bg-red-50 text-[#e2001a] text-xs font-black flex items-center justify-center shrink-0">
                                {index + 1}
                            </span>
                        )}
                        <span className="min-w-0">
                            <span className="block text-sm font-bold text-gray-800 line-clamp-1">{article.title}</span>
                            <span className="block text-xs text-gray-400 mt-1">
                                {article.category_name || "Chưa phân loại"} · {article.author_name || "Admin"} · {formatNumber(article.views || 0)} lượt xem
                            </span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="h-full flex items-center justify-center text-sm text-gray-400">
            Chưa có dữ liệu thống kê.
        </div>
    );
}

const DASHBOARD_CACHE_TTL = 60 * 1000;
const dashboardCache = new Map<string, { data: any; timestamp: number }>();
const dashboardRequests = new Map<string, Promise<any>>();

function getDashboardCacheKey(userId: number, dateFrom: string, dateTo: string) {
    return `${userId}:${dateFrom}:${dateTo}`;
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [chartsLoading, setChartsLoading] = useState(false);
    const [error, setError] = useState("");
    const [dateFrom, setDateFrom] = useState(() => getDateValueWithOffset(-6));
    const [dateTo, setDateTo] = useState(getTodayValue);
    const user = getCurrentUser();

    useEffect(() => {
        if (!user?.id) return;
        let cancelled = false;
        const cacheKey = getDashboardCacheKey(user.id, dateFrom, dateTo);
        const cached = dashboardCache.get(cacheKey);
        const hasFreshCache = cached && Date.now() - cached.timestamp < DASHBOARD_CACHE_TTL;

        if (cached) {
            setData(cached.data);
            setInitialLoading(false);
            setError("");
        }

        if (hasFreshCache) {
            setChartsLoading(false);
            return;
        }

        if (!cached && data === null) {
            setInitialLoading(true);
        } else {
            setChartsLoading(true);
        }

        const request = dashboardRequests.get(cacheKey) || api.getDashboard(user.id, dateFrom, dateTo);
        dashboardRequests.set(cacheKey, request);

        request
            .then(res => {
                if (cancelled) return;
                if (res.error) setError(res.error);
                else {
                    dashboardCache.set(cacheKey, { data: res, timestamp: Date.now() });
                    setError("");
                    setData(res);
                }
            })
            .catch(() => {
                if (!cancelled) setError("Không thể tải dữ liệu dashboard");
            })
            .finally(() => {
                dashboardRequests.delete(cacheKey);
                if (cancelled) return;
                setInitialLoading(false);
                setChartsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.id, dateFrom, dateTo]);

    const dateRangeAction = (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
                Từ
                <input
                    type="date"
                    value={dateFrom}
                    max={dateTo}
                    onChange={(event) => setDateFrom(event.target.value)}
                    className="h-8 rounded border border-gray-200 px-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#e2001a]"
                />
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
                Đến
                <input
                    type="date"
                    value={dateTo}
                    min={dateFrom}
                    onChange={(event) => setDateTo(event.target.value)}
                    className="h-8 rounded border border-gray-200 px-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#e2001a]"
                />
            </label>
        </div>
    );
    const growthData = mergeDailyStats(data?.visits_by_day || [], data?.articles_by_day || []);
    const topChartData = (data?.top_articles || []).slice(0, 10).map((article: any, index: number) => ({
        ...article,
        label: `#${index + 1}`,
    }));
    const topChartMax = getRoundedMax(Math.max(...topChartData.map((article: any) => Number(article.views || 0)), 0));
    const topChartTicks = getTopChartTicks(topChartMax);

    return (
        <AdminLayout title="Tổng quan" subtitle="Thống kê nhanh nội dung, người dùng và bài viết mới trong hệ thống.">
            {initialLoading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-400">Đang tải dashboard...</div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-sm">{error}</div>
            ) : (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard label="Tổng bài viết" value={data.total_articles || 0} icon={Newspaper} />
                        <StatCard label="Tổng lượt xem" value={data.total_views || 0} icon={Eye} />
                        <StatCard label="Bài đăng hôm nay" value={data.today_articles || 0} icon={FileText} />
                        <StatCard label="Truy cập hôm nay" value={data.today_visits || 0} icon={MousePointerClick} />
                        <StatCard label="Tổng lượt truy cập" value={data.total_visits || 0} icon={Activity} />
                        <StatCard label="Người dùng" value={data.total_users || 0} icon={Users} />
                        <StatCard label="Danh mục" value={data.total_categories || 0} icon={FolderOpen} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        <ChartPanel title="Tăng trưởng lượt truy cập" action={dateRangeAction}>
                            {growthData.length === 0 ? <EmptyChart /> : (
                                <div className="relative h-full">
                                    {chartsLoading && (
                                        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center text-xs font-bold text-gray-500">
                                            Đang cập nhật...
                                        </div>
                                    )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={growthData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="visits" allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="articles" orientation="right" allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                formatNumber(Number(value)),
                                                String(name),
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            yAxisId="articles"
                                            dataKey="articles"
                                            name="Bài đăng"
                                            fill="#111827"
                                            maxBarSize={16}
                                            radius={[3, 3, 0, 0]}
                                        />
                                        <Line
                                            yAxisId="visits"
                                            type="linear"
                                            dataKey="visits"
                                            name="Lượt truy cập"
                                            stroke="#e2001a"
                                            strokeWidth={2}
                                            dot={<SquareDot />}
                                            activeDot={<SquareDot />}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                                </div>
                            )}
                        </ChartPanel>

                        <ChartPanel title="Top bài đọc nhiều nhất">
                            {(data.top_articles || []).length === 0 ? <EmptyChart /> : (
                                <div className="relative h-full">
                                    {chartsLoading && (
                                        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center text-xs font-bold text-gray-500">
                                            Đang cập nhật...
                                        </div>
                                    )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topChartData}
                                        barCategoryGap="35%"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fontSize: 12 }}
                                            domain={[0, topChartMax]}
                                            ticks={topChartTicks}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatNumber(Number(value)), "Lượt xem"]}
                                            labelFormatter={(_, payload) => payload?.[0]?.payload?.title || ""}
                                        />
                                        <Bar dataKey="views" fill="#e2001a" maxBarSize={24} radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                </div>
                            )}
                        </ChartPanel>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        <ArticleList title="Bài viết mới nhất" articles={data.latest_articles || []} />
                        <ArticleList title="Bảng xếp hạng bài đọc nhiều" articles={data.all_time_top_articles || []} showRank />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
