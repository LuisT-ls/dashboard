import { updateChart } from './chart.js'
import { updateMetrics, updateReport, renderHistory } from './ui.js'

// Recupera ou inicializa o histórico de dados no localStorage
let dataHistory = JSON.parse(localStorage.getItem('dataHistory')) || []

export function setupDataEntry(chart) {
  const addDataButton = document.getElementById('add-data')
  const dataInput = document.getElementById('data-input')

  if (addDataButton && dataInput) {
    // Função para adicionar dados
    const addData = () => {
      const inputValue = dataInput.value.trim()

      // Validação: Verifica se o valor é um número ou uma lista de números
      if (!inputValue || !/^(\d+,?)+$/.test(inputValue)) {
        alert(
          'Por favor, insira apenas números separados por vírgula (ex: 10, 20, 30).'
        )
        return
      }

      // Converte os dados para um array de números
      const newData = inputValue.split(',').map(Number)

      // Adiciona os novos dados ao histórico
      dataHistory = dataHistory.concat(newData)
      localStorage.setItem('dataHistory', JSON.stringify(dataHistory))

      // Atualiza o gráfico, métricas, relatório e histórico
      updateChart(chart.config.type, dataHistory)
      updateMetrics(dataHistory.length)
      updateReport(dataHistory)
      renderHistory(dataHistory, chart)

      // Limpa o input
      dataInput.value = ''
    }

    // Adiciona evento de clique ao botão "Adicionar"
    addDataButton.addEventListener('click', addData)

    // Adiciona evento de tecla ao campo de entrada
    dataInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        addData() // Chama a função addData ao pressionar Enter
      }
    })
  } else {
    console.error('Elementos de entrada de dados não encontrados!')
  }
}

// Função para editar um valor no histórico
export function editData(index, newValue, chart) {
  if (isNaN(newValue)) {
    alert('Por favor, insira um número válido.')
    return
  }

  dataHistory[index] = Number(newValue)
  localStorage.setItem('dataHistory', JSON.stringify(dataHistory))

  // Atualiza o gráfico, métricas, relatório e histórico
  updateChart(chart.config.type, dataHistory)
  updateMetrics(dataHistory.length)
  updateReport(dataHistory)
  renderHistory(dataHistory, chart)
}

// Função para apagar um valor do histórico
export function deleteData(index, chart) {
  dataHistory.splice(index, 1)
  localStorage.setItem('dataHistory', JSON.stringify(dataHistory))

  // Atualiza o gráfico, métricas, relatório e histórico
  updateChart(chart.config.type, dataHistory)
  updateMetrics(dataHistory.length)
  updateReport(dataHistory)
  renderHistory(dataHistory, chart)
}

// Função para limpar todos os dados
export function clearData(chart) {
  if (confirm('Tem certeza que deseja limpar todos os dados?')) {
    dataHistory = []
    localStorage.setItem('dataHistory', JSON.stringify(dataHistory))

    // Atualiza o gráfico, métricas, relatório e histórico
    updateChart(chart.config.type, dataHistory)
    updateMetrics(dataHistory.length)
    updateReport(dataHistory)
    renderHistory(dataHistory, chart)
  }
}
