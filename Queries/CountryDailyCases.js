import { connectToDb, getDbConnection, disconnectFromDb } from "../Dao.js";
import moment from 'moment';
import { plotDailyNewCasesByCountry} from "../Visualization";

const DAYS_AGO_NOT_INCLUDING_TODAY = 14;
const DATE_FORMAT = "YYYY-MM-DD";

const countryDailyCases = async function () {
  console.log(process.argv);
  const location = process.argv[2];
  if (!location) {
    console.error("Missing country location. Safe return");
    return;
  }
  try {
    await connectToDb();
    const connection = getDbConnection();
    const date = getDate2WeeksAgo();
    console.log("Running countryDailyCases with parameters: ", date, location);
    const results = await connection.query(
      `SELECT location, date, new_cases 
       From cases 
       WHERE date >= ? AND location = ?`,
      [date, location]
    );
    disconnectFromDb();

    const dates = results.map(res => res.date);
    const newCases = results.map(res => res.new_cases);

    plotDailyNewCasesByCountry(dates, newCases);
  } catch (e) {
    console.error("failed to complete query countryDailyCases. Error:", e);
  }
};

const getDate2WeeksAgo = function (){
  const twoWeeksAgo =  Date.now() - DAYS_AGO_NOT_INCLUDING_TODAY * 24 * 60 * 60 * 1000;
  return moment(twoWeeksAgo).format(DATE_FORMAT);
};

module.exports = {
  countryDailyCases,
};

(async () => {
  try {
    await countryDailyCases();
  } catch (e) {
    console.error("Error while running countryDailyCases", e);
    process.exit(1);
  }
})();
