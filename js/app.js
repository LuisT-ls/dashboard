import { initChart, updateChart } from './modules/chart.js'
import { setupDataEntry } from './modules/storage.js'
import { setupExportButtons } from './modules/export.js'

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o gráfico
  const chart = initChart()

  // Configura a entrada de dados
  setupDataEntry(chart)

  // Configura os botões de exportação
  setupExportButtons()

  // Configura os botões de seleção de tipo de gráfico
  const chartTypeButtons = document.querySelectorAll('.chart-type-btn')
  if (chartTypeButtons.length > 0) {
    chartTypeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const type = button.getAttribute('data-type')
        const data = JSON.parse(localStorage.getItem('dataHistory')) || []
        updateChart(type, data) // Atualiza o gráfico com o novo tipo
      })
    })
  } else {
    console.error('Botões de seleção de tipo de gráfico não encontrados!')
  }
})
