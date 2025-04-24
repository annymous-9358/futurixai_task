import React from "react";
import { motion } from "framer-motion";

const StatBox = ({ label, value, trend = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card-bg p-4 rounded-xl"
  >
    <div className="text-gray-400 text-sm">{label}</div>
    <div className="flex items-center gap-2">
      <div className="text-xl font-bold mt-1">{value}</div>
      {trend && (
        <span
          className={`text-sm ${
            trend > 0
              ? "text-green-500"
              : trend < 0
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </motion.div>
);

const StockStats = ({ stats }) => {
  const defaultStats = {
    marketCap: { value: "$2.8T", trend: 1.2 },
    peRatio: { value: "28.5", trend: -0.5 },
    weekHigh52: { value: "$180.25", trend: null },
    weekLow52: { value: "$124.17", trend: null },
    volume: { value: "62.3M", trend: 15.8 },
    avgVolume: { value: "55.1M", trend: null },
    dividend: { value: "0.65%", trend: 0.02 },
    beta: { value: "1.2", trend: null },
    eps: { value: "$6.15", trend: 8.5 },
    profitMargin: { value: "25.3%", trend: 2.1 },
    rsi: { value: "58.4", trend: -3.2 },
    macd: { value: "2.35", trend: 1.8 },
  };

  const data = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatBox
        label="Market Cap"
        value={data.marketCap.value}
        trend={data.marketCap.trend}
      />
      <StatBox
        label="P/E Ratio"
        value={data.peRatio.value}
        trend={data.peRatio.trend}
      />
      <StatBox label="52W High" value={data.weekHigh52.value} />
      <StatBox label="52W Low" value={data.weekLow52.value} />
      <StatBox
        label="Volume"
        value={data.volume.value}
        trend={data.volume.trend}
      />
      <StatBox label="Avg Volume" value={data.avgVolume.value} />
      <StatBox
        label="Dividend Yield"
        value={data.dividend.value}
        trend={data.dividend.trend}
      />
      <StatBox label="Beta" value={data.beta.value} />
      <StatBox label="EPS" value={data.eps.value} trend={data.eps.trend} />
      <StatBox
        label="Profit Margin"
        value={data.profitMargin.value}
        trend={data.profitMargin.trend}
      />
      <StatBox label="RSI (14)" value={data.rsi.value} trend={data.rsi.trend} />
      <StatBox label="MACD" value={data.macd.value} trend={data.macd.trend} />
    </div>
  );
};

export default StockStats;
