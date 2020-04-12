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

form.onsubmit = (e) => {
  e.preventDefault();
  const inputElements = [...$$('#estimator-form label input')];
  inputElements.forEach((elem) => {
    if (elem.value.length < 1) {
      toast('You have not inputed all fields');
    }
  });
  const getVal = (field) => form[field].value.trim();
  const data = {
    population_data: getVal('population-data'),
    time_to_elapse: getVal('time-to-elapse'),
    reported_cases: getVal('reported-cases'),
    total_hospital_beds: getVal('total-hospital-beds'),
    period_type: getVal('period-type'),
    region_name: getVal('region-name'),
    average_daily_income_in_usd: getVal('average-daily-income-in-usd'),
    average_daily_income_population: getVal('average-daily-income-population')
  };
  const url = '';
  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((res) => {
      console.log('Success:', res);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
