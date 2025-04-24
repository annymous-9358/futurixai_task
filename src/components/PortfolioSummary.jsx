import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PortfolioSummary = ({ portfolio }) => {
  const defaultPortfolio = {
    totalValue: 125000,
    dailyChange: 2500,
    dailyChangePercent: 2.04,
    holdings: [
      { symbol: "AAPL", value: 45000, allocation: 36, change: 3.2 },
      { symbol: "MSFT", value: 35000, allocation: 28, change: 1.8 },
      { symbol: "GOOGL", value: 25000, allocation: 20, change: -0.5 },
      { symbol: "AMZN", value: 20000, allocation: 16, change: 2.1 },
    ],
  };

  const data = portfolio || defaultPortfolio;
  const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Portfolio Summary</h2>
        <div className="text-right">
          <div className="text-2xl font-bold">
            ${data.totalValue.toLocaleString()}
          </div>
          <div
            className={`text-sm ${
              data.dailyChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {data.dailyChange >= 0 ? "+" : ""}
            {data.dailyChange.toLocaleString()}({data.dailyChangePercent}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Allocation Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.holdings}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.holdings.map((entry, index) => (
                  <Cell
                    key={entry.symbol}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
                formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings List */}
        <div className="space-y-4">
          {data.holdings.map((holding, index) => (
            <div
              key={holding.symbol}
              className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <div className="font-bold">{holding.symbol}</div>
                  <div className="text-sm text-gray-400">
                    {holding.allocation}% of portfolio
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div>${holding.value.toLocaleString()}</div>
                <div
                  className={`text-sm ${
                    holding.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {holding.change >= 0 ? "+" : ""}
                  {holding.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioSummary;
