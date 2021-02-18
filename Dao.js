const mysql = require("promise-mysql");

let con;

// Database credentials - should move into config file!
const hostname = "remotemysql.com",
  username = "owNtMDmNrM",
  password = "eRmLcsyCDQ",
  databsename = "owNtMDmNrM";

const initDb = async function () {
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
    "CREATE TABLE cases( iso_code CHAR(8), location CHAR(30), date DATE, total_cases INT, new_cases INT )";
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

const connectToDb = async function () {
  if (!con || con.state === "disconnected") {
    // Establish connection to the database
    con = await mysql.createConnection({
      host: hostname,
      user: username,
      password: password,
      database: databsename,
    });

    console.log("successfully connected to Db.");
    return con;
  }
};

const getDbConnection = function () {
  return con;
};

const disconnectFromDb = function() {
    const connection = getDbConnection();
    connection.end();
}

module.exports = {
  initDb,
  connectToDb,
  getDbConnection,
  disconnectFromDb
};
