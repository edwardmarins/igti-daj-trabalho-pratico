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
  confirmed.innerHTML = formater.format(json.Global.TotalConfirmed);
  death.innerHTML = formater.format(json.Global.TotalDeaths);
  recovered.innerHTML = formater.format(json.Global.TotalRecovered);

  fillPieChart(
    json.Global.TotalConfirmed,
    json.Global.TotalRecovered,
    json.Global.TotalDeaths
  );

  const selectedCountries = returnOrderedCountriesByTotalDeaths(json.Countries);
  const countriesNames = returnCountriesNames(selectedCountries);
  const countriesTotalDeaths = returnCountriesTotalDeaths(selectedCountries);
  fillBarChart(countriesNames, countriesTotalDeaths);
}

function returnOrderedCountriesByTotalDeaths(countries) {
  const orderedCountries = countries
    .map((country) => {
      return {
        name: country.Country,
        totalDeaths: country.TotalDeaths,
      };
    })
    .sort((a, b) => b.totalDeaths - a.totalDeaths);

  const selectedCountries = orderedCountries.slice(0, 10);

  return selectedCountries;
}

function returnCountriesNames(countries) {
  countriesNames = [];
  countries.forEach((country) => countriesNames.push(country.name));

  return countriesNames;
}

function returnCountriesTotalDeaths(countries) {
  countriesTotalDeaths = [];
  countries.forEach((country) =>
    countriesTotalDeaths.push(country.totalDeaths)
  );

  return countriesTotalDeaths;
}

function fillPieChart(confirmed, deaths, recovered) {
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

function fillBarChart(countriesNames, countriesTotalDeaths) {
  let bar = new Chart(document.getElementById('barras'), {
    type: 'bar',
    data: {
      labels: countriesNames,
      datasets: [
        {
          label: 'Total de mortes',
          data: countriesTotalDeaths,
          backgroundColor: '#993399',
        },
      ],
    },
    options: {
      reponsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Total de mortes por país - Top 10',
        },
      },
    },
  });
}

// function fillChart(confirmed, deaths, recovered) {
//   dataRecovered = [confirmed, recovered, deaths];

//   let pizza = new Chart(document.getElementById('pizza'), {
//     type: 'pie',
//     data: {
//       labels: ['Confirmados', 'Recuperados', 'Mortes'],
//       datasets: [
//         {
//           data: dataRecovered,
//           backgroundColor: ['#FFFF00', '#120A8F', '#FF0000'],
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Distribuição de novos casos',
//         },
//       },
//     },
//   });
// }
function start() {
  getSumary();
  getDataByCountry();
}
window.addEventListener('load', start);

//const arraynovo = dados.sort((a,b) => { return }).map((item)) return { deaths: }
