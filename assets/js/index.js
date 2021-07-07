//const axios = require('axios').default;
const confirmed = document.getElementById('confirmed');
const death = document.getElementById('death');
const recovered = document.getElementById('recovered');

let baseURL = 'https://api.covid19api.com';

const api = axios.create({
  baseURL,
});

const formater = new Intl.NumberFormat('pt-BR', {
  style: 'decimal',
  currency: 'BRL',
});

async function getSumary() {
  const response = await api.get('summary');
  loadInitialData(response.data);
  //const json = await JSON.parse(response.data);
  console.log(response.data.Countries);
  // data = fetch('https://api.covid19api.com/summary')
  //   .then((response) => response.json())
  //   .then((json) => loadInitialData(json));
}

async function getDataByCountry() {
  const date1 = new Date(date_start.value);
  const date2 = new Date(date_end.value);

  let startDate = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate() - 1,
    -3,
    0,
    1,
    0
  );
  let endDate = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate() + 1,
    -3,
    0,
    0,
    0
  );
  const country = cmbCountries.value;
  const response = await api.get(
    `country/${'Brazil'}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
  );
  //loadInitialData(response.data);
  //const json = await JSON.parse(response.data);
  console.log(response.data);
  // data = fetch('https://api.covid19api.com/summary')
  //   .then((response) => response.json())
  //   .then((json) => loadInitialData(json));
}

function loadInitialData(json) {
  //console.log(json);
  confirmed.innerHTML = formater.format(json.Global.TotalConfirmed);
  death.innerHTML = formater.format(json.Global.TotalDeaths);
  recovered.innerHTML = formater.format(json.Global.TotalRecovered);

  fillChart(
    json.Global.TotalConfirmed,
    json.Global.TotalRecovered,
    json.Global.TotalDeaths
  );
}

function fillChart(confirmed, deaths, recovered) {
  dataRecovered = [confirmed, recovered, deaths];

  let pizza = new Chart(document.getElementById('pizza'), {
    type: 'pie',
    data: {
      labels: ['Confirmados', 'Recuperados', 'Mortes'],
      datasets: [
        {
          data: dataRecovered,
          backgroundColor: ['#FFFF00', '#120A8F', '#FF0000'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Distribuição de novos casos',
        },
      },
    },
  });
}
function start() {
  getSumary();
  getDataByCountry();
}
window.addEventListener('load', start);

//const arraynovo = dados.sort((a,b) => { return }).map((item)) return { deaths: }
