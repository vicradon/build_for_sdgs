const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    totalHospitalBeds,
    timeToElapse,
    periodType,
    region: {
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    }
  } = data;
  const currentlyInfectedN = reportedCases * 10;
  const currentlyInfectedS = reportedCases * 50;

  // ttt = timeToElapse pt = periodType
  const getTimeInDays = (tte, pt) => {
    switch (pt) {
      case 'days':
        return tte;
      case 'weeks':
        return tte * 7;
      case 'months':
        return tte * 30;
      default:
        return tte;
    }
  };

  const infectedFactor = (tte, pt) => Math.round(2 ** (getTimeInDays(tte, pt) / 3));

  const infectionsByRequestedTimeN = currentlyInfectedN * infectedFactor(timeToElapse, periodType);
  const infectionsByRequestedTimeS = currentlyInfectedS * infectedFactor(timeToElapse, periodType);

  const severeCasesByRequestedTimeN = Math.round(infectionsByRequestedTimeN * 0.15);
  const severeCasesByRequestedTimeS = Math.round(infectionsByRequestedTimeS * 0.15);

  const hospitalBedsByRequestedTimeN = Math.round(
    0.35 * totalHospitalBeds * severeCasesByRequestedTimeN
  );
  const hospitalBedsByRequestedTimeS = Math.round(
    0.35 * totalHospitalBeds * severeCasesByRequestedTimeS
  );

  const casesForICUByRequestedTimeN = Math.round(infectionsByRequestedTimeN * 0.05);
  const casesForICUByRequestedTimeS = Math.round(infectionsByRequestedTimeS * 0.05);

  const casesForVentilatorsByRequestedTimeN = Math.round(infectionsByRequestedTimeN * 0.02);
  const casesForVentilatorsByRequestedTimeS = Math.round(infectionsByRequestedTimeS * 0.02);

  const dollarsInFlightN = Math.round(
    (infectionsByRequestedTimeN * avgDailyIncomeInUSD * avgDailyIncomePopulation)
    / getTimeInDays(timeToElapse, periodType)
  );
  const dollarsInFlightS = Math.round(
    (infectionsByRequestedTimeS * avgDailyIncomeInUSD * avgDailyIncomePopulation)
    / getTimeInDays(timeToElapse, periodType)
  );


  const impact = {
    currentlyInfected: currentlyInfectedN,
    infectionsByRequestedTime: infectionsByRequestedTimeN,
    severeCasesByRequestedTime: severeCasesByRequestedTimeN,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeN,
    casesForICUByRequestedTime: casesForICUByRequestedTimeN,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeN,
    dollarsInFlight: `$${dollarsInFlightN}`
  };
  const severeImpact = {
    currentlyInfected: currentlyInfectedS,
    infectionsByRequestedTime: infectionsByRequestedTimeS,
    severeCasesByRequestedTime: severeCasesByRequestedTimeS,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeS,
    casesForICUByRequestedTime: casesForICUByRequestedTimeS,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeS,
    dollarsInFlight: `$${dollarsInFlightS}`
  };


  return {
    data,
    impact,
    severeImpact
  };
};
module.exports = covid19ImpactEstimator;
