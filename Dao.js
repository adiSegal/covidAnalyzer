import mysql from "promise-mysql";
import { config } from "./config";

let con;

export const initDb = async function () {
  // Establish connection to the database
  con = await connectToDb();
  try {
    await Promise.all([
      con.query("DROP TABLE cases"),
      con.query("DROP TABLE countries_metadata")
    ]);

  } catch (e) {
    console.warn(e);
  }
  const createCasesStatament =
    "CREATE TABLE cases( iso_code CHAR(8), location CHAR(50), date DATE, total_cases INT, new_cases INT )";
  const createCounriesMdStatament =
    "CREATE TABLE countries_metadata( iso_code CHAR(8), life_expectancy FLOAT, human_development_index FLOAT )";

  // Creating tables
  await Promise.all([
    con.query(createCasesStatament),
    con.query(createCounriesMdStatament),
  ]);
  console.log("successfully initiated Db. Tables are created");
  return con;
};

export const connectToDb = async function () {
  if (!con || con.state === "disconnected") {
    // Establish connection to the database
    con = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });

    console.log("successfully connected to Db.");
    return con;
  }
};

export const getDbConnection = function () {
  return con;
};

export const disconnectFromDb = function() {
    const connection = getDbConnection();
    connection.end();
};
