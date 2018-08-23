// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
var ctx = document.getElementById("fotosPorDia-grafico");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Out 10", "Out 11", "Out 12", "Out 13", "Out 14", "Out 15", "Out 16", "Out 17"],
    datasets: [{
      label: "Fotos",
      lineTension: 0,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 10,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: [234, 450, 500, 670, 720, 845, 920, 1040],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 1500,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
// -- Bar Chart Example
var ctx = document.getElementById("campanhasPorMes-grafico");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Galho de Árvore", "Árvore Caída", "Papagaio (Pipa)", "Poste Irregular"],
    datasets: [{
      label: "Qtd de Fotos",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: [10232, 6700, 2157, 8245],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: true
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 15000,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
// -- Pie Chart Example
var ctx = document.getElementById("municipiosChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["Guarulhos", "Mogi das Cruzes", "São José dos Campos"],
    datasets: [{
      data: [41.82, 23.09, 33.87],
      backgroundColor: ['#007bff', '#dc3545', '#ffc107'],
    }],
  },
});
