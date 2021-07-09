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

function start() {
  getSumary();
}
window.addEventListener('load', start);
