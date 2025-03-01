let chartInstance = null // Variável para armazenar a instância do gráfico

export function initChart() {
  const ctx = document.getElementById('myChart').getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar', // Tipo inicial do gráfico
    data: {
      labels: [],
      datasets: [
        {
          label: 'Dados',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  return chartInstance
}

export function updateChart(type, data) {
  if (chartInstance) {
    chartInstance.destroy() // Destrói o gráfico anterior
  }

  const ctx = document.getElementById('myChart').getContext('2d')
  chartInstance = new Chart(ctx, {
    type: type, // Novo tipo de gráfico
    data: {
      labels:
        type === 'scatter' ? [] : data.map((_, index) => `Dado ${index + 1}`),
      datasets: [
        {
          label: 'Dados',
          data:
            type === 'scatter'
              ? data.map((value, index) => ({ x: index + 1, y: value }))
              : data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        },
        x:
          type === 'scatter'
            ? {
                type: 'linear',
                position: 'bottom'
              }
            : {}
      }
    }
  })
}
