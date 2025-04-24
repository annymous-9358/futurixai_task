import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const calculateRSI = (data, periods = 14) => {
  if (!data || data.length < periods) return [];

  let gains = [];
  let losses = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].price - data[i - 1].price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, periods).reduce((a, b) => a + b) / periods;
  let avgLoss = losses.slice(0, periods).reduce((a, b) => a + b) / periods;

  let rsiData = [];

  // Calculate RSI values
  for (let i = periods; i < data.length; i++) {
    avgGain = (avgGain * 13 + gains[i - 1]) / 14;
    avgLoss = (avgLoss * 13 + losses[i - 1]) / 14;

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    rsiData.push({
      date: data[i].date,
      rsi: rsi,
    });
  }

  return rsiData;
};

const calculateMACD = (
  data,
  shortPeriod = 12,
  longPeriod = 26,
  signalPeriod = 9
) => {
  if (!data || data.length < longPeriod) return [];

  // Calculate EMAs
  const shortEMA = [];
  const longEMA = [];
  let macdLine = [];
  let signalLine = [];

  // Calculate first EMA values
  let shortSum = 0;
  let longSum = 0;

  for (let i = 0; i < longPeriod; i++) {
    const price = data[i].price;
    if (i < shortPeriod) shortSum += price;
    longSum += price;
  }

  shortEMA[shortPeriod - 1] = shortSum / shortPeriod;
  longEMA[longPeriod - 1] = longSum / longPeriod;

  // Calculate subsequent EMA values
  const shortMultiplier = 2 / (shortPeriod + 1);
  const longMultiplier = 2 / (longPeriod + 1);
  const signalMultiplier = 2 / (signalPeriod + 1);

  for (let i = shortPeriod; i < data.length; i++) {
    shortEMA[i] =
      (data[i].price - shortEMA[i - 1]) * shortMultiplier + shortEMA[i - 1];
  }

  for (let i = longPeriod; i < data.length; i++) {
    longEMA[i] =
      (data[i].price - longEMA[i - 1]) * longMultiplier + longEMA[i - 1];
    macdLine[i] = shortEMA[i] - longEMA[i];
  }

  // Calculate signal line (9-day EMA of MACD)
  let signalSum = 0;
  for (let i = longPeriod; i < longPeriod + signalPeriod; i++) {
    signalSum += macdLine[i];
  }
  signalLine[longPeriod + signalPeriod - 1] = signalSum / signalPeriod;

  for (let i = longPeriod + signalPeriod; i < data.length; i++) {
    signalLine[i] =
      (macdLine[i] - signalLine[i - 1]) * signalMultiplier + signalLine[i - 1];
  }

  return data
    .map((item, i) => ({
      date: item.date,
      macd: macdLine[i] || null,
      signal: signalLine[i] || null,
      histogram:
        macdLine[i] && signalLine[i] ? macdLine[i] - signalLine[i] : null,
    }))
    .filter((item) => item.macd !== null);
};

const TechnicalIndicators = ({ data }) => {
  const rsiData = calculateRSI(data);
  const macdData = calculateMACD(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg p-6 rounded-xl"
    >
      <h2 className="text-xl font-bold mb-4">Technical Indicators</h2>

      {/* RSI Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">RSI (14)</h3>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rsiData}>
              <XAxis
                dataKey="date"
                stroke="#666"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#666" domain={[0, 100]} ticks={[0, 30, 70, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
                formatter={(value) => [`${value.toFixed(2)}`, "RSI"]}
              />
              <Line
                type="monotone"
                dataKey="rsi"
                stroke="#2563EB"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">MACD</h3>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={macdData}>
              <XAxis
                dataKey="date"
                stroke="#666"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#666" domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
                formatter={(value) => [`${value.toFixed(4)}`, "Value"]}
              />
              <Line
                type="monotone"
                dataKey="macd"
                stroke="#2563EB"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke="#EF4444"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default TechnicalIndicators;
