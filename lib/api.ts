import axios from "axios";

const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

const api = axios.create({
  baseURL: FMP_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    throw new Error("FMP_API_KEY environment variable is not set");
  }
  config.params = {
    ...config.params,
    apikey: apiKey,
  };
  return config;
});

export default api;
