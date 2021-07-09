const date_start = document.getElementById('date_start');
const date_end = document.getElementById('date_end');
const btnFiltro = document.getElementById('filtro');
const kpiconfirmed = document.getElementById('kpiconfirmed');
const kpideaths = document.getElementById('kpideaths');
const kpirecovered = document.getElementById('kpirecovered');
const cmbCountry = document.getElementById('cmbCountry');
let lineChart;

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
  const country = cmbCountry.value;
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

  kpiconfirmed.innerHTML = formater.format(
    countryData[countryData.length - 1].Confirmed
  );
  kpideaths.innerHTML = formater.format(
    countryData[countryData.length - 1].Deaths
  );
  kpirecovered.innerHTML = formater.format(
    countryData[countryData.length - 1].Recovered
  );

  const dataSelectedByFilter = returnOptionSelected();

  const chartDates = returnDates(dailyTotals);
  let chartData = [];
  let chartDataLabel = '';
  let chartAverageLabel = '';

  if (dataSelectedByFilter === 'Confirmed') {
    chartData = returnDailyConfirmed(dailyTotals);
    chartDataLabel = 'Número de Casos Confirmados';
    chartAverageLabel = 'Média de Casos Confirmados';
  } else if (dataSelectedByFilter === 'Deaths') {
    chartData = returnDailyDeaths(dailyTotals);
    chartDataLabel = 'Número de Mortes';
    chartAverageLabel = 'Média de Mortes';
  } else {
    chartData = returnDailyRecovered(dailyTotals);
    chartDataLabel = 'Número de Casos Recuperados';
    chartAverageLabel = 'Média de Casos Recuperados';
  }

  const averageValue = returnDataAverage(chartData);

  let chartAverageData = [];
  chartAverageData = fillArrayChartAverageData(chartData.length, averageValue);

  fillLineChart(
    chartDates,
    chartDataLabel,
    chartData,
    chartAverageLabel,
    chartAverageData
  );
}

function returnDates(dailyTotals) {
  dates = [];
  dailyTotals.forEach((day) => {
    let oldDate = day.Date;
    console.log(oldDate.substring(0, 10));
    dates.push(oldDate.substring(0, 10));
  });

  return dates;
}

function returnDailyConfirmed(dailyTotals) {
  confirmedTotals = [];
  dailyTotals.forEach((day) => confirmedTotals.push(day.Confirmed));
  return confirmedTotals;
}

function returnDailyDeaths(dailyTotals) {
  deathTotals = [];
  dailyTotals.forEach((day) => deathTotals.push(day.Deaths));
  return deathTotals;
}

function returnDailyRecovered(dailyTotals) {
  recoveredTotals = [];
  dailyTotals.forEach((day) => recoveredTotals.push(day.Recovered));
  return recoveredTotals;
}

function returnOptionSelected() {
  var box = document.getElementById('cmbData');
  optionSelected = box.options[box.selectedIndex].value;
  return optionSelected;
}

function returnDataAverage(data) {
  sum = data.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  return sum / data.length;
}

function fillArrayChartAverageData(numElements, averageValue) {
  arrayAverageData = [];

  let it = 0;
  while (it < numElements) {
    arrayAverageData.push(averageValue);
    it++;
  }

  return arrayAverageData;
}

function fillLineChart(dates, dataLabel, data, averageLabel, averageData) {
  if (lineChart) lineChart.destroy();

  lineChart = new Chart(document.getElementById('linhas'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          data: data,
          label: dataLabel,
          borderColor: 'rgb(60,186,159)',
          backgroundColor: 'rgb(60,186,159,0.1)',
        },
        {
          data: averageData,
          label: averageLabel,
          borderColor: 'rgb(255,140,13)',
          backgroundColor: 'rgb(255,140,13, 0.1)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top', //top, bottom, left, rigth
        },
        title: {
          display: true,
          text: 'Curva diária de Covid-19',
        },
        layout: {
          padding: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 10,
          },
        },
      },
    },
  });
}

function start() {
  getCountries();

  btnFiltro.addEventListener('click', getDataByCountry);
}

window.addEventListener('load', start);
