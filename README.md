# covidAnalyzer
Load covid-19 data from URL, load to a DB an analyse 

Install the app:
run npm i

run the app- get the latest csv from the URL and persist it in the DB:
node index.js
The app will print "All items stored into database successfully" once the DB is done loading.

to run queries:
* Country daily new cases- for a given country name print a list of the last 14 days and the number of daily new cases in that country:
    npm run countryDailyCases <country name>        example: npm run countryDailyCases Afghanistan
* Total cases for every country- For the 10 countries with the largest number of total cases,
  shows the total number of cases for each country since the epidemic started.
    npm run totalCasesForEveryCountry
* Life expectancy- compare the life expectancy of the country with the highest human development index vs lowest
    npm run lifeExpectancy
note that these queries get a connection to the DB, so once the DB is done loading, they can run regardless of the app.

