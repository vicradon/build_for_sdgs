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
  const currentlnfectedN = reportedCases * 10;
  const currentlnfectedS = reportedCases * 50;


  const getTimeInDays = (tte, pt) => {
    if (pt === 'days') {
      return tte;
    }
    if (pt === 'weeks') {
      return tte * 7;
    }
    return tte * 30;
  };

  const getTimeToDouble = (tte, pt) => Math.round(2 * (getTimeInDays(tte, pt) / 3));
  // if (pt === 'days') {
  //   return Math.round(2 * (tte / 3));
  // }
  // if (pt === 'weeks') {
  //   return Math.round(2 * ((tte * 7) / 3));
  // }
  // return Math.round(2 * ((tte * 30) / 3));
  // };


  const infectionsByRequestedTimeN = currentlnfectedN * getTimeToDouble(timeToElapse, periodType);
  const infectionsByRequestedTimeS = currentlnfectedS * getTimeToDouble(timeToElapse, periodType);

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
    currentlnfected: currentlnfectedN,
    infectionsByRequestedTime: infectionsByRequestedTimeN,
    severeCasesByRequestedTime: severeCasesByRequestedTimeN,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeN,
    casesForICUByRequestedTime: casesForICUByRequestedTimeN,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeN,
    dollarsInFlight: `$${dollarsInFlightN}`
  };
  const severeImpact = {
    currentlnfected: currentlnfectedS,
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
