import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VolumeChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <h2 className="text-xl font-bold mb-4">Trading Volume</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#666"
              tickFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              stroke="#666"
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                return value;
              }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
              labelStyle={{ color: "#666" }}
              formatter={(value) => {
                if (value >= 1000000)
                  return [`${(value / 1000000).toFixed(1)}M`, "Volume"];
                if (value >= 1000)
                  return [`${(value / 1000).toFixed(1)}K`, "Volume"];
                return [value, "Volume"];
              }}
            />
            <Bar
              dataKey="volume"
              fill="#3b82f6"
              opacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VolumeChart;
