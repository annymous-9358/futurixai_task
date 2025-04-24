const API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY";
const BASE_URL = "https://www.alphavantage.co/query";
const NEWS_API_KEY = "YOUR_NEWS_API_KEY";
const NEWS_BASE_URL = "https://newsapi.org/v2";

export const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data["Global Quote"];
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
};

export const fetchStockTimeSeries = async (symbol, interval = "DAILY") => {
  try {
    const function_name =
      interval === "INTRADAY" ? "TIME_SERIES_INTRADAY" : "TIME_SERIES_DAILY";

    const response = await fetch(
      `${BASE_URL}?function=${function_name}&symbol=${symbol}${
        interval === "INTRADAY" ? "&interval=5min" : ""
      }&apikey=${API_KEY}`
    );
    const data = await response.json();

    // Parse the time series data
    const timeSeriesKey =
      interval === "INTRADAY" ? "Time Series (5min)" : "Time Series (Daily)";
    const timeSeries = data[timeSeriesKey];

    return Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        price: parseFloat(values["4. close"]),
      }))
      .reverse();
  } catch (error) {
    console.error("Error fetching time series:", error);
    return [];
  }
};

export const fetchCompanyOverview = async (symbol) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching company overview:", error);
    return null;
  }
};

export const fetchStockNews = async (symbol) => {
  try {
    const response = await fetch(
      `${NEWS_BASE_URL}/everything?q=${symbol}&apiKey=${NEWS_API_KEY}&pageSize=5&language=en&sortBy=publishedAt`
    );
    const data = await response.json();
    return data.articles.map((article) => ({
      title: article.title,
      summary: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
