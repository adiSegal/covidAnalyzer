import { connectToDb, getDbConnection, disconnectFromDb } from "../Dao.js";
import { plotTotalCasesPerCountry} from "../Visualization";

const totalCasesForEveryCountry = async function () {
  await connectToDb();
  const connection = getDbConnection();
  const sql =
    `SELECT cases.location, total_cases 
     FROM (SELECT max(date) max_date, location FROM cases GROUP BY location) tmp 
     JOIN cases on cases.location = tmp.location 
     WHERE date = max_date 
     ORDER BY total_cases desc limit 10`;

  try {
    const results = await connection.query(sql);
    disconnectFromDb();

    const locations = results.map(res => res.location);
    const totalCases = results.map(res => res.total_cases);

    plotTotalCasesPerCountry(locations, totalCases);
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  try {
    await totalCasesForEveryCountry();
  } catch (e) {
    console.error("Error while running totalCasesForEveryCountry", e);
    process.exit(1);
  }
})();