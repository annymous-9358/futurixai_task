import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const MarketSentiment = ({ data }) => {
  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  const defaultData = [
    { name: "Bullish", value: 45 },
    { name: "Neutral", value: 30 },
    { name: "Bearish", value: 25 },
  ];

  const sentimentData = data || defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <h2 className="text-xl font-bold mb-4">Market Sentiment</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {sentimentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
              formatter={(value) => [`${value}%`, "Sentiment"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {sentimentData.map((item, index) => (
          <div key={item.name} className="text-center">
            <div className="text-sm text-gray-400">{item.name}</div>
            <div className="font-bold" style={{ color: COLORS[index] }}>
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MarketSentiment;
