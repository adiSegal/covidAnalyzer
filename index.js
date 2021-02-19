import { initializeCovidDb } from './CovidAnalyzer.js';

const CSV_URL = "https://covid.ourworldindata.org/data/owid-covid-data.csv";

(async () => {
  initializeCovidDb(CSV_URL);
})();
