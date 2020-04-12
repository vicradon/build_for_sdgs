const $ = (n) => document.querySelector(n);
const $$ = (n) => document.querySelectorAll(n);

const form = $('#estimator-form');

const toast = (text) => {
  $('#toast').textContent = text;
  $('#toast').style.display = 'block';
  setTimeout(() => {
    $('#toast').style.display = 'none';
  }, 2000);
};

$('#estimator-form').onsubmit = (e) => {
  e.preventDefault();
  const inputElements = [...$$('#estimator-form label input')];
  inputElements.forEach((elem) => {
    if (elem.value.length < 1) {
      toast('You have not inputed all fields');
    }
  });
  const getVal = (field) => form[field].value.trim();
  const data = {
    region: {
      name: getVal('region-name'),
      avgAge: getVal('average-age'),
      avgDailyIncomePopulation: getVal('average-daily-income-population'),
      avgDailyIncomeInUSD: getVal('average-daily-income-in-usd')
    },
    population: getVal('population-data'),
    timeToElapse: getVal('time-to-elapse'),
    reportedCases: getVal('reported-cases'),
    totalHospitalBeds: getVal('total-hospital-beds'),
    periodType: getVal('period-type')
  };
  const url = 'http://covid-19-estimator1.herokuapp.com/api/v1/on-covid-19';
  $('.loader').style.display = 'block';
  $('#submit-estimator-form').disabled = true;
  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(() => {
      $('.loader').style.display = 'none';
      $('#submit-estimator-form').disabled = false;
      $('.feedback').textContent = 'Successfully submitted the form';
      form.reset();
    })
    .catch((error) => {
      $('.loader').style.display = 'none';
      $('#submit-estimator-form').disabled = false;
      $('.feedback').textContent = 'Form submit unsuccessful';
      $('.feedback').style.color = 'red';
      throw error;
    });
};
