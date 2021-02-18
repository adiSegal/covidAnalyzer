const csvtojson = require("csvtojson");
const request = require("request-promise");
const _ = require("lodash");

const { getDbConnection } = require("./Dao.js");

const getCsvFromUrl = async function (url) {
  let response = await request(url);
  return response;
};

const insertCsvIntoDb = async (csv) => {
  const con = getDbConnection();
  console.log("Inserting CSV into DB");
  const source = await csvtojson().fromString(csv);
  // Fetching the data from each row
  // and inserting to the correct table

  for (let i = 0; i < source.length; i++) {
    const isoCode = source[i]["iso_code"],
      date = source[i]["date"],
      location = source[i]["location"],
      totalCases = Math.floor(source[i]["total_cases"]),
      newCases = Math.floor(source[i]["new_cases"]),
      lifeExpectancy = source[i]["life_expectancy"],
      humanDevelopmentIndex = source[i]["human_development_index"];

    // Inserting data of current row
    // into database

    if (isValidCasesRow(isoCode, location, date, totalCases, newCases)) {
      let insertCasesStatement = `INSERT INTO cases values(?, ?, ?, ?, ?)`;
      let casesItems = [isoCode,location, date, totalCases, newCases];
      await con.query(insertCasesStatement, casesItems);
    }

    if (isValidCountriesMdRow(isoCode, lifeExpectancy, humanDevelopmentIndex)) {
        let insertCountriesMdStatement = `INSERT INTO countries_metadata values(?, ?, ?)`;
        let countriesItems = [isoCode, lifeExpectancy, humanDevelopmentIndex];
        await con.query(insertCountriesMdStatement, countriesItems);
    }
  }
  return console.log("All items stored into database successfully");
};

const isValidCasesRow = function(isoCode, location, date, totalCases, newCases){
  return isoCode != '' &&
    date != '' &&
    totalCases != '' &&
    location != '' && !_.includes(['Asia','Europe','European Union', 'Africa'], location) &&
    newCases != '';
};

const isValidCountriesMdRow = function(isoCode, lifeExpectancy, humanDevelopmentIndex){
  return  isoCode != '' &&
    lifeExpectancy != '' &&
    humanDevelopmentIndex != '';
};

module.exports = {
  insertCsvIntoDb,
  getCsvFromUrl,
};
