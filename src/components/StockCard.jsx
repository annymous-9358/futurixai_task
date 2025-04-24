import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchStockData, fetchCompanyOverview } from "../services/stockApi";

const StockCard = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [stock, company] = await Promise.all([
        fetchStockData(symbol),
        fetchCompanyOverview(symbol),
      ]);
      setStockData(stock);
      setCompanyData(company);
      setLoading(false);
    };

    fetchData();
    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg p-4 rounded-xl hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        </div>
      </motion.div>
    );
  }

  if (!stockData || !companyData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg p-4 rounded-xl hover:shadow-lg transition-shadow"
      >
        <div className="text-center text-gray-400">
          Unable to load stock data
        </div>
      </motion.div>
    );
  }

  const price = parseFloat(stockData["05. price"]);
  const change = parseFloat(stockData["09. change"]);
  const changePercent = parseFloat(stockData["10. change percent"]);
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-4 rounded-xl hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{symbol}</h3>
          <p className="text-gray-400 text-sm">{companyData.Name}</p>
          <p className="text-gray-400 text-xs">{companyData.Exchange}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            isPositive
              ? "bg-green-500/20 text-green-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-2xl font-bold">${price.toFixed(2)}</span>
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Open</span>
          <p>${stockData["02. open"]}</p>
        </div>
        <div>
          <span className="text-gray-400">High</span>
          <p>${stockData["03. high"]}</p>
        </div>
        <div>
          <span className="text-gray-400">Low</span>
          <p>${stockData["04. low"]}</p>
        </div>
        <div>
          <span className="text-gray-400">Volume</span>
          <p>{parseInt(stockData["06. volume"]).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StockCard;
