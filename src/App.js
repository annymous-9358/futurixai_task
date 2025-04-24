import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PriceChart from "./components/PriceChart";
import StockCard from "./components/StockCard";
import StockStats from "./components/StockStats";
import MarketSentiment from "./components/MarketSentiment";
import VolumeChart from "./components/VolumeChart";
import PortfolioSummary from "./components/PortfolioSummary";
import NewsCard from "./components/NewsCard";
import TechnicalIndicators from "./components/TechnicalIndicators";
import WatchList from "./components/WatchList";
import { fetchStockNews, fetchStockTimeSeries } from "./services/stockApi";

function App() {
  const [currentSymbol, setCurrentSymbol] = useState("AAPL");
  const [searchInput, setSearchInput] = useState("");
  const [news, setNews] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [newsData, timeSeriesData] = await Promise.all([
        fetchStockNews(currentSymbol),
        fetchStockTimeSeries(currentSymbol),
      ]);
      setNews(newsData);
      setStockData(timeSeriesData);
    };
    loadData();
  }, [currentSymbol]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentSymbol(searchInput.toUpperCase());
      setSearchInput("");
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6">
      {/* Header Section */}
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Stock Market Dashboard</h1>
            <div className="text-gray-400">
              Real-time market data and analysis
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter stock symbol..."
              className="px-4 py-2 rounded-lg bg-card-bg border border-gray-700 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
            >
              Search
            </button>
          </form>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Watchlist */}
        <div className="lg:col-span-1">
          <WatchList onSelectStock={setCurrentSymbol} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Chart Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <PriceChart symbol={currentSymbol} />
            <TechnicalIndicators data={stockData} />
          </div>

          {/* Portfolio and Stats */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <PortfolioSummary />
            <StockStats />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <VolumeChart data={stockData} />
            <MarketSentiment />
          </div>

          {/* News Feed */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Latest News</h2>
            <div className="grid grid-cols-1 gap-4">
              {news.map((item, index) => (
                <NewsCard key={index} news={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4">
        <p>
          Data provided by Alpha Vantage API • Last updated:{" "}
          {new Date().toLocaleString()}
        </p>
      </footer>
    </div>
  );
}

export default App;
