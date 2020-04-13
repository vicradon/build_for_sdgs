const express = require('express');
const cors = require('cors');
const js2xmlparser = require('js2xmlparser');
const path = require('path');

const covid19ImpactEstimator = require('./src/estimator');
const logger = require('./src/logger');

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true
  })
);
app.use(express.static('src/public'));
app.options('*', cors());

app.use(express.json());
app.use(logger);

app.post('/api/v1/on-covid-19', (req, res) => {
  res.send(covid19ImpactEstimator(req.body));
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  res.send(covid19ImpactEstimator(req.body));
});
app.get('/api/v1/on-covid-19/json' || '/api/v1/on-covid-19', (req, res) => {
  if (!req.body === null) {
    res.send(covid19ImpactEstimator(req.body));
  } else {
    res.send(covid19ImpactEstimator({
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
      },
      periodType: 'days',
      timeToElapse: 58,
      reportedCases: 674,
      population: 66622705,
      totalHospitalBeds: 1380614
    }));
  }
});
app.get('/api/v1/on-covid-19', (req, res) => {
  if (!req.body === null) {
    res.send(covid19ImpactEstimator(req.body));
  } else {
    res.send(covid19ImpactEstimator({
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
      },
      periodType: 'days',
      timeToElapse: 58,
      reportedCases: 674,
      population: 66622705,
      totalHospitalBeds: 1380614
    }));
  }
});
app.get('/api/v1/on-covid-19/xml', (req, res) => {
  if (!req.body === null) {
    const input = covid19ImpactEstimator(req.body);
    const response = js2xmlparser.parse('estimate', input);
    res.send(response);
  } else {
    const input = {
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
      },
      periodType: 'days',
      timeToElapse: 58,
      reportedCases: 674,
      population: 66622705,
      totalHospitalBeds: 1380614
    };
    const response = js2xmlparser.parse('estimate', input);
    res.send(`${response}`);
  }
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const input = covid19ImpactEstimator(req.body);
  const response = js2xmlparser.parse('estimate', input);
  res.send(response);
});

app.get('/logs', (_, res) => {
  res.sendFile(path.join(__dirname, './src', 'logs.txt'));
});


app.listen(process.env.PORT || 7000, () => {
  // eslint-disable-next-line no-console
  console.log('server running on port 7000', 'http://localhost:7000', '');
});
