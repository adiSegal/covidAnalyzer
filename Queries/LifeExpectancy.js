import { connectToDb, getDbConnection, disconnectFromDb } from "../Dao.js";
import { plotLifeExpectancy} from "../Visualization";

const lifeExpectancy = async function () {
  await connectToDb();
  const connection = getDbConnection();

  const sql =
    `(SELECT distinct iso_code, life_expectancy, human_development_index 
    FROM countries_metadata 
    ORDER BY human_development_index 
    LIMIT 1 ) 
    UNION 
    (SELECT distinct iso_code, life_expectancy, human_development_index 
    FROM countries_metadata 
    ORDER BY human_development_index desc 
    LIMIT 1)`;

  try {
    const results = await connection.query(sql);
    disconnectFromDb();

    const isoCodes = results.map(res => res.iso_code);
    const lifeExpectancy = results.map(res => res.life_expectancy);

    plotLifeExpectancy(lifeExpectancy, isoCodes);
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  try {
    await lifeExpectancy();
  } catch (e) {
    console.error("Error while running lifeExpectancy", e);
    process.exit(1);
  }
})();