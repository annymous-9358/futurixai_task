import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StockCard from "./StockCard";

const WatchList = ({ onSelectStock }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState("");

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const addToWatchlist = (e) => {
    e.preventDefault();
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      const updatedWatchlist = [...watchlist, newSymbol.toUpperCase()];
      setWatchlist(updatedWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      setNewSymbol("");
    }
  };

  const removeFromWatchlist = (symbol) => {
    const updatedWatchlist = watchlist.filter((s) => s !== symbol);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Watchlist</h2>
        <form onSubmit={addToWatchlist} className="flex gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Add symbol..."
            className="px-3 py-1 rounded-lg bg-black/20 border border-gray-700 focus:border-accent focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-accent rounded-lg hover:bg-accent/80 transition-colors text-sm"
          >
            Add
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {watchlist.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            Your watchlist is empty. Add stocks to track them.
          </div>
        ) : (
          watchlist.map((symbol) => (
            <motion.div
              key={symbol}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div
                onClick={() => onSelectStock(symbol)}
                className="cursor-pointer"
              >
                <StockCard symbol={symbol} />
              </div>
              <button
                onClick={() => removeFromWatchlist(symbol)}
                className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default WatchList;
