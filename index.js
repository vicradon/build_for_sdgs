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
  res.type('application/json');
  res.send(covid19ImpactEstimator(req.body));
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  res.type('application/xml');
  const input = covid19ImpactEstimator(req.body);
  const response = js2xmlparser.parse('estimate', input);
  res.send(response);
});

app.get('/api/v1/on-covid-19/logs', (_, res) => {
  res.header('Content-Type', 'text/plain');
  res.type('text/plain');
  res.sendFile(path.join(__dirname, './src', 'logs.txt'));
});


app.listen(process.env.PORT || 7000, () => {
  // eslint-disable-next-line no-console
  console.log('server running on port 7000', 'http://localhost:7000', '');
});
