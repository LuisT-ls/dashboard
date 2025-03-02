let chartInstance = null // Variável para armazenar a instância do gráfico

// Função para gerar cores em degradê baseadas nos valores dos dados
function generateGradientColors(data, type) {
  // Escala de cores para o degradê (do mais claro ao mais forte)
  const colorGradients = {
    red: { min: 'rgba(255, 200, 200, 0.7)', max: 'rgba(220, 20, 60, 0.9)' },
    blue: { min: 'rgba(200, 220, 255, 0.7)', max: 'rgba(30, 100, 200, 0.9)' },
    green: { min: 'rgba(200, 255, 200, 0.7)', max: 'rgba(20, 180, 80, 0.9)' },
    purple: { min: 'rgba(220, 200, 255, 0.7)', max: 'rgba(130, 50, 200, 0.9)' },
    orange: { min: 'rgba(255, 230, 200, 0.7)', max: 'rgba(240, 120, 20, 0.9)' }
  }

  // Escolher o tema de cor com base no tipo de gráfico
  let colorTheme
  switch (type) {
    case 'bar':
      colorTheme = colorGradients.blue
      break
    case 'line':
      colorTheme = colorGradients.green
      break
    case 'pie':
    case 'doughnut':
      colorTheme = colorGradients.red
      break
    case 'radar':
      colorTheme = colorGradients.purple
      break
    case 'polarArea':
    case 'scatter':
      colorTheme = colorGradients.orange
      break
    default:
      colorTheme = colorGradients.blue
  }

  // Para scatter plots, retornamos uma única cor
  if (type === 'scatter') {
    return {
      backgroundColors: [colorTheme.max],
      borderColors: [colorTheme.max.replace(/, [0-9.]+\)$/, ', 1)')],
      isGradient: false
    }
  }

  // Para linha, usamos uma única cor também
  if (type === 'line') {
    return {
      backgroundColors: [colorTheme.min],
      borderColors: [colorTheme.max],
      isGradient: false
    }
  }

  // Encontrar o valor mínimo e máximo no dataset
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const valueRange = maxValue - minValue

  // Evitar divisão por zero
  const normalizedRange = valueRange > 0 ? valueRange : 1

  // Gerar cores com base no valor relativo de cada ponto de dados
  const backgroundColors = []
  const borderColors = []

  // Precisamos de pelo menos duas cores diferentes para o degradê
  if (data.length === 0) {
    return {
      backgroundColors: [colorTheme.min],
      borderColors: [colorTheme.min.replace(/, [0-9.]+\)$/, ', 1)')],
      isGradient: true
    }
  }

  // Se todos os valores forem iguais, usamos uma cor intermediária
  if (valueRange === 0) {
    const midColor = interpolateColor(colorTheme.min, colorTheme.max, 0.5)
    data.forEach(() => {
      backgroundColors.push(midColor)
      borderColors.push(midColor.replace(/, [0-9.]+\)$/, ', 1)'))
    })
  } else {
    // Gerar cores baseadas nos valores
    data.forEach(value => {
      // Normalizar o valor entre 0 e 1
      const normalizedValue = (value - minValue) / normalizedRange
      // Interpolar entre a cor mínima e máxima
      const color = interpolateColor(
        colorTheme.min,
        colorTheme.max,
        normalizedValue
      )
      backgroundColors.push(color)
      borderColors.push(color.replace(/, [0-9.]+\)$/, ', 1)'))
    })
  }

  return { backgroundColors, borderColors, isGradient: true }
}

// Função para interpolar entre duas cores RGBA
function interpolateColor(color1, color2, factor) {
  // Extrair componentes RGBA
  const rgba1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/)
  const rgba2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/)

  // Interpolar cada componente
  const r = Math.round(
    parseInt(rgba1[1]) + factor * (parseInt(rgba2[1]) - parseInt(rgba1[1]))
  )
  const g = Math.round(
    parseInt(rgba1[2]) + factor * (parseInt(rgba2[2]) - parseInt(rgba1[2]))
  )
  const b = Math.round(
    parseInt(rgba1[3]) + factor * (parseInt(rgba2[3]) - parseInt(rgba1[3]))
  )
  const a =
    parseFloat(rgba1[4]) +
    factor * (parseFloat(rgba2[4]) - parseFloat(rgba1[4]))

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
}

// Criar uma legenda personalizada para mostrar o degradê
function createGradientLegend(chart, minValue, maxValue) {
  // Remover a legenda anterior se existir
  const oldLegend = document.getElementById('gradient-legend')
  if (oldLegend) {
    oldLegend.remove()
  }

  // Obter o elemento canvas
  const canvas = chart.canvas

  // Criar o elemento da legenda
  const legend = document.createElement('div')
  legend.id = 'gradient-legend'
  legend.style.marginTop = '20px'
  legend.style.width = '100%'
  legend.style.textAlign = 'center'
  legend.style.fontSize = '14px'

  // Criar o contêiner do degradê
  const gradientContainer = document.createElement('div')
  gradientContainer.style.display = 'flex'
  gradientContainer.style.height = '20px'
  gradientContainer.style.width = '80%'
  gradientContainer.style.margin = '0 auto 5px auto'
  gradientContainer.style.borderRadius = '4px'
  gradientContainer.style.overflow = 'hidden'

  // Definir o tipo de gradiente com base no tipo de gráfico
  let gradientColors
  switch (chart.config.type) {
    case 'bar':
      gradientColors =
        'linear-gradient(to right, rgba(200, 220, 255, 0.7), rgba(30, 100, 200, 0.9))'
      break
    case 'line':
      gradientColors =
        'linear-gradient(to right, rgba(200, 255, 200, 0.7), rgba(20, 180, 80, 0.9))'
      break
    case 'pie':
    case 'doughnut':
      gradientColors =
        'linear-gradient(to right, rgba(255, 200, 200, 0.7), rgba(220, 20, 60, 0.9))'
      break
    case 'radar':
      gradientColors =
        'linear-gradient(to right, rgba(220, 200, 255, 0.7), rgba(130, 50, 200, 0.9))'
      break
    case 'polarArea':
    case 'scatter':
      gradientColors =
        'linear-gradient(to right, rgba(255, 230, 200, 0.7), rgba(240, 120, 20, 0.9))'
      break
    default:
      gradientColors =
        'linear-gradient(to right, rgba(200, 220, 255, 0.7), rgba(30, 100, 200, 0.9))'
  }

  gradientContainer.style.background = gradientColors

  // Criar os rótulos de valores
  const labelsContainer = document.createElement('div')
  labelsContainer.style.display = 'flex'
  labelsContainer.style.justifyContent = 'space-between'
  labelsContainer.style.width = '80%'
  labelsContainer.style.margin = '0 auto'

  const minLabel = document.createElement('div')
  minLabel.textContent = `Valor Mínimo: ${minValue}`

  const maxLabel = document.createElement('div')
  maxLabel.textContent = `Valor Máximo: ${maxValue}`

  labelsContainer.appendChild(minLabel)
  labelsContainer.appendChild(maxLabel)

  // Adicionar título da legenda
  const legendTitle = document.createElement('div')
  legendTitle.textContent = 'Intensidade de Cor por Valor'
  legendTitle.style.fontWeight = 'bold'
  legendTitle.style.marginBottom = '5px'

  // Montar a legenda
  legend.appendChild(legendTitle)
  legend.appendChild(gradientContainer)
  legend.appendChild(labelsContainer)

  // Adicionar a legenda após o canvas
  canvas.parentNode.insertBefore(legend, canvas.nextSibling)

  return legend
}

export function initChart() {
  const ctx = document.getElementById('myChart').getContext('2d')

  // Configuração inicial (sem dados ainda)
  chartInstance = new Chart(ctx, {
    type: 'bar', // Tipo inicial do gráfico
    data: {
      labels: [],
      datasets: [
        {
          label: 'Dados',
          data: [],
          backgroundColor: 'rgba(200, 220, 255, 0.7)',
          borderColor: 'rgba(30, 100, 200, 0.9)',
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
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true
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

  // Se não houver dados, inicialize com gráfico vazio
  if (!data || data.length === 0) {
    return initChart()
  }

  const ctx = document.getElementById('myChart').getContext('2d')
  const labels = data.map((_, index) => `Dado ${index + 1}`)

  // Encontrar valores mínimos e máximos para a legenda
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)

  // Gerar cores em degradê baseadas nos valores
  const { backgroundColors, borderColors, isGradient } = generateGradientColors(
    data,
    type
  )

  // Configura o dataset de acordo com o tipo de gráfico
  let dataset = {
    label: 'Valores',
    data: data,
    borderWidth: 1
  }

  // Configura opções específicas para cada tipo de gráfico
  switch (type) {
    case 'bar':
      dataset.backgroundColor = backgroundColors
      dataset.borderColor = borderColors
      break

    case 'line':
      dataset.backgroundColor = backgroundColors[0]
      dataset.borderColor = borderColors[0]
      dataset.tension = 0.3
      dataset.fill = true
      break

    case 'pie':
    case 'doughnut':
    case 'polarArea':
      dataset.backgroundColor = backgroundColors
      dataset.borderColor = borderColors
      break

    case 'radar':
      dataset.backgroundColor = backgroundColors[0]
      dataset.borderColor = borderColors[0]
      dataset.pointBackgroundColor = borderColors
      dataset.pointBorderColor = '#fff'
      dataset.pointHoverBackgroundColor = '#fff'
      dataset.pointHoverBorderColor = borderColors[0]
      break

    case 'scatter':
      dataset.data = data.map((value, index) => ({ x: index + 1, y: value }))
      dataset.backgroundColor = backgroundColors
      dataset.borderColor = borderColors
      dataset.pointRadius = 6
      dataset.pointHoverRadius = 8
      break
  }

  // Configura opções específicas para o tipo de gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: type === 'pie' || type === 'doughnut' || type === 'polarArea',
        position: 'top'
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: function (context) {
            return type === 'scatter'
              ? `Ponto ${context[0].dataIndex + 1}`
              : context[0].label
          },
          label: function (context) {
            const value = type === 'scatter' ? context.raw.y : context.raw

            if (type === 'pie' || type === 'doughnut') {
              const sum = context.chart.data.datasets[0].data.reduce(
                (a, b) => a + b,
                0
              )
              const percentage = Math.round((value / sum) * 100)
              return `Valor: ${value} (${percentage}%)`
            }

            return `Valor: ${value}`
          }
        }
      }
    }
  }

  // Adiciona escalas para tipos específicos
  if (type === 'bar' || type === 'line' || type === 'scatter') {
    options.scales = {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        title: {
          display: true,
          text: 'Valor'
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        title: {
          display: true,
          text: type === 'scatter' ? 'Índice' : 'Dados'
        }
      }
    }

    if (type === 'scatter') {
      options.scales.x.type = 'linear'
      options.scales.x.position = 'bottom'
    }
  }

  // Cria o novo gráfico
  chartInstance = new Chart(ctx, {
    type: type,
    data: {
      labels: type === 'scatter' ? null : labels,
      datasets: [dataset]
    },
    options: options
  })

  // Legenda de degradê para tipos de gráficos que usam degradê
  if (isGradient && data.length > 0) {
    createGradientLegend(chartInstance, minValue, maxValue)
  }
}
