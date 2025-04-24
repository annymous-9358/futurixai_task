import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { fetchStockTimeSeries } from "../services/stockApi";

const TIME_PERIODS = {
  "1D": "INTRADAY",
  "1W": "DAILY",
  "1M": "DAILY",
  "3M": "DAILY",
  "1Y": "DAILY",
  ALL: "DAILY",
};

const CHART_TYPES = ["Line", "Area", "Candlestick"];

const calculateMA = (data, periods) => {
  const ma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < periods - 1) {
      ma[i] = null;
      continue;
    }
    let sum = 0;
    for (let j = 0; j < periods; j++) {
      sum += data[i - j].price;
    }
    ma[i] = sum / periods;
  }
  return ma;
};

const PriceChart = ({ symbol }) => {
  const [activePeriod, setActivePeriod] = useState("1M");
  const [chartType, setChartType] = useState("Line");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMA, setShowMA] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchStockTimeSeries(
        symbol,
        TIME_PERIODS[activePeriod]
      );

      // Filter data based on selected period
      const now = new Date();
      const filtered = data.filter((item) => {
        const date = new Date(item.date);
        switch (activePeriod) {
          case "1D":
            return date.getDate() === now.getDate();
          case "1W":
            return now - date <= 7 * 24 * 60 * 60 * 1000;
          case "1M":
            return now - date <= 30 * 24 * 60 * 60 * 1000;
          case "3M":
            return now - date <= 90 * 24 * 60 * 60 * 1000;
          case "1Y":
            return now - date <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });

      // Calculate moving averages
      const ma20 = calculateMA(filtered, 20);
      const ma50 = calculateMA(filtered, 50);

      const enrichedData = filtered.map((item, index) => ({
        ...item,
        ma20: ma20[index],
        ma50: ma50[index],
      }));

      setChartData(enrichedData);
      setLoading(false);
    };

    fetchData();
  }, [symbol, activePeriod]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      height: "100%",
      width: "100%",
    };

    const commonAxisProps = {
      xAxis: (
        <XAxis
          dataKey="date"
          stroke="#666"
          tickFormatter={(date) => {
            const d = new Date(date);
            return activePeriod === "1D"
              ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : d.toLocaleDateString();
          }}
        />
      ),
      yAxis: (
        <YAxis
          stroke="#666"
          domain={["auto", "auto"]}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
      ),
      cartesianGrid: <CartesianGrid strokeDasharray="3 3" stroke="#333" />,
      tooltip: (
        <Tooltip
          contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
          labelStyle={{ color: "#666" }}
          formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
          labelFormatter={(label) => {
            const d = new Date(label);
            return activePeriod === "1D"
              ? d.toLocaleTimeString()
              : d.toLocaleDateString();
          }}
        />
      ),
      legend: (
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingTop: "10px" }}
        />
      ),
    };

    const renderMovingAverages = () => {
      if (!showMA) return null;
      return [
        <Line
          key="ma20"
          type="monotone"
          dataKey="ma20"
          stroke="#22C55E"
          strokeWidth={1}
          dot={false}
          name="MA20"
        />,
        <Line
          key="ma50"
          type="monotone"
          dataKey="ma50"
          stroke="#EF4444"
          strokeWidth={1}
          dot={false}
          name="MA50"
        />,
      ];
    };

    switch (chartType) {
      case "Area":
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2563EB"
              fill="#2563EB"
              fillOpacity={0.1}
              animateNewValues={true}
              name="Price"
            />
            {renderMovingAverages()}
          </AreaChart>
        );
      case "Candlestick":
        return (
          <ComposedChart {...commonProps}>
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            <Bar dataKey="high" fill="none" stroke="#666" yAxisId={0} />
            <Bar dataKey="low" fill="none" stroke="#666" yAxisId={0} />
            <Bar
              dataKey="close"
              fill={(data) => (data.close > data.open ? "#22C55E" : "#EF4444")}
              stroke={(data) =>
                data.close > data.open ? "#22C55E" : "#EF4444"
              }
              yAxisId={0}
            />
            {renderMovingAverages()}
          </ComposedChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              animateNewValues={true}
              name="Price"
            />
            {renderMovingAverages()}
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Price Chart</h2>
          <div className="flex gap-2">
            {CHART_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  chartType === type
                    ? "bg-accent text-white"
                    : "hover:bg-accent/20 text-gray-400"
                }`}
              >
                {type}
              </button>
            ))}
            <button
              onClick={() => setShowMA(!showMA)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                showMA
                  ? "bg-accent text-white"
                  : "hover:bg-accent/20 text-gray-400"
              }`}
            >
              MA
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          {Object.keys(TIME_PERIODS).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activePeriod === period
                  ? "bg-accent text-white"
                  : "hover:bg-accent/20 text-gray-400"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default PriceChart;
