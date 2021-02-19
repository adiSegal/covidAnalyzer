import { connectToDb, initDb, disconnectFromDb } from './Dao.js';
import { insertCsvIntoDb, getCsvFromUrl } from './CsvHandler.js';

const CSV_URL = "https://covid.ourworldindata.org/data/owid-covid-data.csv";

(async () => {
  try {
    const [csv] = await Promise.all([getCsvFromUrl(CSV_URL), initDb()]);
    await connectToDb();
    await insertCsvIntoDb(csv);
    disconnectFromDb();
    process.exit(0);
  } catch (e) {
    console.error("Error while initializing the app", e);
    process.exit(1);
  }
})();
