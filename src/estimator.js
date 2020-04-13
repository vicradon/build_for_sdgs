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
        throw new Error('Invalid argument, period type must be in either days, weeks or months');
    }
  };
  // This function implies that the number of infections double in 3 days successions
  const doublingFactor = (tte, pt) => Math.trunc(getTimeInDays(tte, pt) / 3);

  // This funcition finalises the number of infected cases after a time period
  const infectedFactor = (tte, pt) => Math.trunc(2 ** doublingFactor(tte, pt));

  const infectionsByRequestedTimeN = Math.trunc(
    currentlyInfectedN * infectedFactor(timeToElapse, periodType)
  );
  const infectionsByRequestedTimeS = Math.trunc(
    currentlyInfectedS * infectedFactor(timeToElapse, periodType)
  );

  const severeCasesByRequestedTimeN = Math.trunc(infectionsByRequestedTimeN * 0.15);
  const severeCasesByRequestedTimeS = Math.trunc(infectionsByRequestedTimeS * 0.15);

  const hospitalBedsByRequestedTimeN = Math.trunc((
    0.35 * totalHospitalBeds
  ) - severeCasesByRequestedTimeN);
  const hospitalBedsByRequestedTimeS = Math.trunc((
    0.35 * totalHospitalBeds
  ) - severeCasesByRequestedTimeS);

  const casesForICUByRequestedTimeN = Math.trunc(infectionsByRequestedTimeN * 0.05);
  const casesForICUByRequestedTimeS = Math.trunc(infectionsByRequestedTimeS * 0.05);

  const casesForVentilatorsByRequestedTimeN = Math.trunc(infectionsByRequestedTimeN * 0.02);
  const casesForVentilatorsByRequestedTimeS = Math.trunc(infectionsByRequestedTimeS * 0.02);

  const dollarsInFlightN = Math.trunc(
    (infectionsByRequestedTimeN * avgDailyIncomeInUSD * avgDailyIncomePopulation)
    / getTimeInDays(timeToElapse, periodType)
  );
  const dollarsInFlightS = Math.trunc(
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
    dollarsInFlight: dollarsInFlightN
  };
  const severeImpact = {
    currentlyInfected: currentlyInfectedS,
    infectionsByRequestedTime: infectionsByRequestedTimeS,
    severeCasesByRequestedTime: severeCasesByRequestedTimeS,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeS,
    casesForICUByRequestedTime: casesForICUByRequestedTimeS,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeS,
    dollarsInFlight: dollarsInFlightS
  };


  return {
    data,
    impact,
    severeImpact
  };
};
module.exports = covid19ImpactEstimator;
