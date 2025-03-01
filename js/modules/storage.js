import { updateChart } from './chart.js'
import { updateMetrics, updateReport, renderHistory } from './ui.js'

// Recupera ou inicializa o histórico de dados no localStorage
let dataHistory = JSON.parse(localStorage.getItem('dataHistory')) || []

export function setupDataEntry(chart) {
  const addDataButton = document.getElementById('add-data')
  const dataInput = document.getElementById('data-input')
  const confirmClearDataButton = document.getElementById('confirmClearData')

  if (addDataButton && dataInput) {
    // Função para adicionar dados
    const addData = () => {
      const inputValue = dataInput.value.trim()

      // Verifica se o valor não está vazio
      if (!inputValue) {
        alert('Por favor, insira dados válidos.')
        return
      }

      let processedInput = inputValue.replace(/\s+/g, ',')

      // Trata múltiplas vírgulas consecutivas
      processedInput = processedInput.replace(/,+/g, ',')

      // Remove vírgula do início e fim se existir
      processedInput = processedInput.replace(/^,|,$/g, '')

      // Validação: Verifica se os valores são números
      if (!/^(\d+,?)+$/.test(processedInput)) {
        alert(
          'Por favor, insira apenas números separados por vírgula ou espaço (ex: 10 20 30 ou 10, 20, 30).'
        )
        return
      }

      // Converte os dados para um array de números
      const newData = processedInput.split(',').map(Number)

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

  // Configurar o botão de confirmação no modal
  if (confirmClearDataButton) {
    confirmClearDataButton.addEventListener('click', () => {
      // Limpar dados quando o usuário confirma no modal
      clearAllData(chart)

      // Fechar o modal após a confirmação
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('clearDataModal')
      )
      modal.hide()
    })
  } else {
    console.error('Botão de confirmação no modal não encontrado!')
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

// Função para limpar todos os dados (será chamada pelo modal)
function clearAllData(chart) {
  dataHistory = []
  localStorage.setItem('dataHistory', JSON.stringify(dataHistory))

  // Atualiza o gráfico, métricas, relatório e histórico
  updateChart(chart.config.type, dataHistory)
  updateMetrics(dataHistory.length)
  updateReport(dataHistory)
  renderHistory(dataHistory, chart)
}
