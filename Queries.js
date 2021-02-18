const { connectToDb, getDbConnection, disconnectFromDb } = require("./Dao.js");
const {
  plotDailyNewCasesByCountry,
  plotTotalCasesPerCountry,
  plotLifeExpectancy,
} = require("./Visualization");
const moment = require("moment");
const _ = require("lodash");

const countryDailyCases = async function () {
  const location = process.argv[1];
  if (!location) {
    console.error("Missing country location. Safe return");
    return;
  }

  const DAYS_AGO = 14; //14 days not including today
  try {
    await connectToDb();
    const connection = getDbConnection();
    const date = new Date();
    const twoWeeksAgo = new Date(date.getTime() - DAYS_AGO * 24 * 60 * 60 * 1000);
    const dateString = moment(twoWeeksAgo).format("YYYY-MM-DD");
    console.log(
      "Running countryDailyCases with parameters: ",
      twoWeeksAgo,
      location
    );
    const results = await connection.query(
      "Select location, date, new_cases" +
      " From cases" +
      " WHERE date >= ? " +
      " And location = ? ",
      [dateString, location]
    );
    disconnectFromDb();

    const dates = _.map(results, "date");
    const newCases = _.map(results, "new_cases");

    plotDailyNewCasesByCountry(dates, newCases);
  } catch (e) {
    console.error("failed to complete query countryDailyCases. Error:", e);
  }
};

const totalCasesForEveryCountry = async function () {
  await connectToDb();
  const connection = getDbConnection();
  const sql =
    "select cases.location, total_cases" +
    " from (select max(date) max_date, location from cases group by location) tmp" +
    " join cases on cases.location = tmp.location" +
    " where date = max_date" +
    " order by total_cases desc limit 10";

  const results = await connection.query(sql);

  disconnectFromDb();

  const locations = _.map(results, "location");
  const totalCases = _.map(results, "total_cases");

  plotTotalCasesPerCountry(locations, totalCases);
};

const lifeExpectancy = async function () {
  await connectToDb();
  const connection = getDbConnection();

  const sql =
    "(Select distinct iso_code, life_expectancy, human_development_index " +
    "From countries_metadata " +
    "Order by human_development_index " +
    "Limit 1 ) " +
    "union " +
    "(Select distinct iso_code, life_expectancy, human_development_index " +
    "From countries_metadata " +
    "Order by human_development_index desc " +
    "Limit 1)";

  const results = await connection.query(sql);

  disconnectFromDb();

  const isoCodes = _.map(results, "iso_code");
  const lifeExpectancy = _.map(results, "life_expectancy");

  plotLifeExpectancy(lifeExpectancy, isoCodes);
};

module.exports = {
  countryDailyCases,
  totalCasesForEveryCountry,
  lifeExpectancy,
};