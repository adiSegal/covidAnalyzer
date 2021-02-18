const { plot } = require('nodeplotlib');

const plotDailyNewCasesByCountry = function(days, dailyNewCases){
  const data = [{x: days, y: dailyNewCases, type: 'line'}];
  plot(data);
};

const plotTotalCasesPerCountry = function(locations, totalCases){
  const data = [{x: locations, y: totalCases, type: 'bar'}];
  plot(data);
};

const plotLifeExpectancy = function(lifeExpectancy, countries){
  const data = [{x: countries, y: lifeExpectancy, type: 'bar'}];
  plot(data);
};

module.exports = {
  plotDailyNewCasesByCountry,
  plotTotalCasesPerCountry,
  plotLifeExpectancy
};
