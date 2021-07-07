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
      alert('br');
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
    date2.getDate() + 2,
    -3,
    0,
    0,
    0
  );
  const country = cmbCountry.value;
  const response = await api.get(
    `country/${country}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
  );
  console.log(
    `country/${country}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
  );
  console.log(response.data);
  const countryData = response.data.map(
    ({ Country, Date, Confirmed, Deaths, Recovered }) => {
      return { Country, Date, Confirmed, Deaths, Recovered };
    }
  );
  const dailyTotals = [];
  for (let i = 1; i < countryData.length; i++) {
    const today = countryData[i];
    const yesterday = countryData[i - 1];

    const dailyConfirmed = today.Confirmed - yesterday.Confirmed;
    dailyTotals.push({
      Country: today.Country,
      Date: today.Date,
      Confirmed: dailyConfirmed,
    });
  }
  console.log(dailyTotals);
  // kpirecovered.innerHTML =
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
