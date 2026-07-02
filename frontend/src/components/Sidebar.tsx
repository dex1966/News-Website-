import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { STOCKS as MOCK_STOCKS, FX_RATES as MOCK_FX, GOLD as MOCK_GOLD } from "../data/mockData";

const VN_RED = "#e2001a";

export default function Sidebar({ mostRead }: { mostRead: any[] }) {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [fxRates, setFxRates] = useState(MOCK_FX);
  const [gold, setGold] = useState(MOCK_GOLD);

  useEffect(() => {
    const fetchData = () => {
      api.getMarketData().then(data => {
        if (data) {
          if (data.stocks) setStocks(data.stocks);
          if (data.fx) setFxRates(data.fx);
          if (data.gold) setGold(data.gold);
        }
      }).catch(err => console.error("Failed to fetch market data", err));
    };

    fetchData(); // Lần đầu
    const interval = setInterval(fetchData, 10000); // Tự động cập nhật mỗi 10 giây để demo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block w-[240px] flex-shrink-0">
      <div className="rounded border border-gray-200 flex items-center justify-center mb-4 bg-gradient-to-b from-gray-100 to-gray-200" style={{ height: 200 }}>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Quảng cáo</span>
      </div>
      <div className="bg-white rounded border border-gray-200 mb-4 overflow-hidden">
        <div className="px-3 py-2" style={{ background: VN_RED }}>
          <h3 className="text-white font-black text-xs uppercase tracking-wider">Đọc mới nhất</h3>
        </div>
        <div
          style={{ maxHeight: 400, overflowY: "auto" }}
          className="most-read-scroll"
        >
          {mostRead.map((item) => (
            <div key={item.rank} onClick={() => item.id && navigate(`/article/${item.id}`)} className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer group border-b border-gray-100 last:border-0">
              <span className={`text-xl font-black flex-shrink-0 leading-none mt-0.5 ${item.rank <= 3 ? "" : "text-gray-200"}`}
                style={item.rank <= 3 ? { color: VN_RED } : {}}>{item.rank}</span>
              <p className="text-xs text-gray-700 leading-snug group-hover:text-[#e2001a] transition-colors line-clamp-3">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded border border-gray-200 p-3 mb-4">
        <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">Chứng khoán</h3>
        {stocks.map((s) => (
          <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-xs font-semibold text-gray-600">{s.name}</span>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-800 transition-colors duration-500" key={`${s.name}-${s.val}`}>{s.val}</div>
              <div className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${"flat" in s && s.flat ? "text-gray-400" : s.up ? "text-green-600" : "text-red-500"}`}>
                {"flat" in s && s.flat ? <Minus size={9} /> : s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {s.pct}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded border border-gray-200 p-3 mb-4">
        <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">Tỷ giá ngoại tệ</h3>
        <div className="flex justify-between text-[9px] text-gray-400 mb-1 px-0.5">
          <span>Tiền tệ</span><span>Mua vào</span><span>Bán ra</span>
        </div>
        {fxRates.map((fx) => (
          <div key={fx.currency} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-600 w-8">{fx.currency}</span>
            <span className="text-[11px] text-gray-700 transition-colors duration-500" key={`${fx.currency}-buy-${fx.buy}`}>{fx.buy}</span>
            <span className="text-[11px] font-semibold transition-colors duration-500" key={`${fx.currency}-sell-${fx.sell}`} style={{ color: VN_RED }}>{fx.sell}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded border border-gray-200 p-3">
        <h3 className="text-xs font-black text-gray-700 mb-2 pb-1.5 border-b border-gray-200 uppercase tracking-wider">Giá vàng</h3>
        {gold.map((g) => (
          <div key={g.type} className="py-1.5 border-b border-gray-50 last:border-0">
            <div className="text-[10px] text-gray-500 mb-1">{g.type}</div>
            <div className="flex justify-between text-xs">
              <div><div className="text-[9px] text-gray-400">Mua</div><div className="font-bold text-gray-700 transition-colors duration-500" key={`gold-buy-${g.buy}`}>{g.buy}</div></div>
              <div className="text-right"><div className="text-[9px] text-gray-400">Bán</div><div className="font-bold transition-colors duration-500" key={`gold-sell-${g.sell}`} style={{ color: VN_RED }}>{g.sell}</div></div>
            </div>
          </div>
        ))}
        <p className="text-[9px] text-gray-400 mt-1.5">Đơn vị: nghìn đồng/chỉ</p>
      </div>
    </div>
  );
}
