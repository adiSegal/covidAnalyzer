import csvtojson from "csvtojson";
import request from "request-promise";
import { getDbConnection } from "./Dao.js";

export const getCsvFromUrl = async function (url) {
  return  await request(url);
};

const fetchDataAndInsertToTable = async (con, source) => {
  for (let i = 0; i < source.length; i++) {
    const isoCode = source[i]["iso_code"],
      date = source[i]["date"],
      location = source[i]["location"],
      totalCases = Number(source[i]["total_cases"]),
      newCases = Number(source[i]["new_cases"]),
      lifeExpectancy = source[i]["life_expectancy"],
      humanDevelopmentIndex = source[i]["human_development_index"];

    if (isValidCasesRow(isoCode, location, date, totalCases, newCases)) {
      const insertCasesStatement = `INSERT INTO cases values(?, ?, ?, ?, ?)`;
      const casesItems = [isoCode,location, date, totalCases, newCases];
      await con.query(insertCasesStatement, casesItems);
    }

    if (isValidCountriesMdRow(isoCode, lifeExpectancy, humanDevelopmentIndex)) {
      const insertCountriesMdStatement = `INSERT INTO countries_metadata values(?, ?, ?)`;
      const countriesItems = [isoCode, lifeExpectancy, humanDevelopmentIndex];
      await con.query(insertCountriesMdStatement, countriesItems);
    }
  }
};

export const insertCsvIntoDb = async (csv) => {
  const con = getDbConnection();
  console.log("Inserting CSV into DB");
  const source = await csvtojson().fromString(csv);
  await fetchDataAndInsertToTable(con, source);
  return console.log("All items stored into database successfully");
};

export const isValidCasesRow = function(isoCode, location, date, totalCases, newCases){
  return isoCode !== '' &&
    date !== '' &&
    totalCases !== '' &&
    !['Asia','Europe','European Union', 'Africa', 'North America'].includes(location) &&
    newCases !== '';
};

export const isValidCountriesMdRow = function(isoCode, lifeExpectancy, humanDevelopmentIndex){
  return  isoCode !== '' &&
    lifeExpectancy !== '' &&
    humanDevelopmentIndex !== '';
};
