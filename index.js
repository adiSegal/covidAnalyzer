import { initializeCovidDb } from "./CovidAnalyzer.js";
import { config } from "./config";

(async () => {
  const csvUrl = config.csvUrl;
  await initializeCovidDb(csvUrl);
})();
