const date_start = document.getElementById('date_start');
const date_end = document.getElementById('date_end');
const btnFiltro = document.getElementById('filtro');
const kpiconfirmed = document.getElementById('kpiconfirmed');
const kpideaths = document.getElementById('kpideaths');
const kpirecovered = document.getElementById('kpirecovered');
const cmbCountry = document.getElementById('cmbCountry');

let baseURL = 'https://api.covid19api.com';

const api = axios.create({
  baseURL,
});

const formater = new Intl.NumberFormat('pt-BR', {
  style: 'decimal',
  currency: 'BRL',
});

async function getCountries() {
  const response = await api.get('countries');
  fillCountrySelect(response.data);
}

function fillCountrySelect(countriesJSON) {
  const countries = countriesJSON.sort((a, b) =>
    a.Country.localeCompare(b.Country)
  );
  for (index in countriesJSON) {
    cmbCountry.options[cmbCountry.options.length] = new Option(
      countries[index].Country,
      countries[index].Slug
    );
    if (countries[index].Country === 'Brazil') {
      cmbCountry.options[cmbCountry.options.length - 1].selected = true;
    }
  }
}

async function getDataByCountry() {
  const date1 = new Date(date_start.value);
  const date2 = new Date(date_end.value);

  let startDate = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
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
  const country = 'Brazil'; // cmbCountry.value;
  const response = await api.get(
    `country/${country}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
  );
  console.log(
    `country/${country}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
  );

  const countryData = response.data.map(
    ({ Country, Date, Confirmed, Deaths, Recovered }) => {
      return { Country, Date, Confirmed, Deaths, Recovered };
    }
  );
  let dailyTotals = [];
  for (let i = 1; i < countryData.length; i++) {
    const today = countryData[i];
    const yesterday = countryData[i - 1];

    const dailyConfirmed = today.Confirmed - yesterday.Confirmed;
    const dailyDeaths = today.Deaths - yesterday.Deaths;
    const dailyRecovered = today.Recovered - yesterday.Recovered;
    dailyTotals.push({
      Country: today.Country,
      Date: today.Date,
      Confirmed: dailyConfirmed,
      Deaths: dailyDeaths,
      Recovered: dailyRecovered,
    });
  }

  dailyTotals = [
    {
      Country: 'Brazil',
      Date: '2021-07-01T00:00:00Z',
      Confirmed: 65163,
      Deaths: 2029,
      Recovered: 177995,
    },
    {
      Country: 'Brazil',
      Date: '2021-07-02T00:00:00Z',
      Confirmed: 65165,
      Deaths: 1857,
      Recovered: 32568,
    },
    {
      Country: 'Brazil',
      Date: '2021-07-03T00:00:00Z',
      Confirmed: 54556,
      Deaths: 1635,
      Recovered: 14279,
    },
    {
      Country: 'Brazil',
      Date: '2021-07-04T00:00:00Z',
      Confirmed: 27783,
      Deaths: 830,
      Recovered: 58383,
    },
    {
      Country: 'Brazil',
      Date: '2021-07-05T00:00:00Z',
      Confirmed: 22703,
      Deaths: 695,
      Recovered: 93078,
    },
    {
      Country: 'Brazil',
      Date: '2021-07-06T00:00:00Z',
      Confirmed: 62504,
      Deaths: 1780,
      Recovered: 64575,
    },
  ];

  kpiconfirmed.innerHTML = formater.format(
    dailyTotals[dailyTotals.length - 1].Confirmed
  );
  kpideaths.innerHTML = formater.format(
    dailyTotals[dailyTotals.length - 1].Deaths
  );
  kpirecovered.innerHTML = formater.format(
    dailyTotals[dailyTotals.length - 1].Recovered
  );
  document.write(JSON.stringify(dailyTotals));
  // data = fetch('https://api.covid19api.com/summary')
  //   .then((response) => response.json())
  //   .then((json) => loadInitialData(json));
}

function start() {
  //getDataByCountry();
  getCountries();

  btnFiltro.addEventListener('click', getDataByCountry);
}

window.addEventListener('load', start);
