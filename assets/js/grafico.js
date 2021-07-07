dataRecovered = [30, 50, 20];

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
