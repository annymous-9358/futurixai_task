import React from "react";
import { motion } from "framer-motion";

const NewsCard = ({ news }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-4 rounded-xl hover:bg-card-bg/80 transition-colors"
    >
      <div className="flex items-start gap-4">
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold mb-2">{news.title}</h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {news.summary}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(news.publishedAt).toLocaleDateString()}
            </span>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 text-sm"
            >
              Read More →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
