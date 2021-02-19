import { connectToDb, initDb, disconnectFromDb } from './Dao.js';
import { insertCsvIntoDb, getCsvFromUrl } from './CsvHandler.js';

export const initializeCovidDb = async function (csv_url) {
  try {
    const [csv] = await Promise.all([getCsvFromUrl(csv_url), initDb()]);
    await connectToDb();
    await insertCsvIntoDb(csv);
    disconnectFromDb();
    process.exit(0);
  } catch (e) {
    console.error("Error while initializing the app", e);
    process.exit(1);
  }
};
