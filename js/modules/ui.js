import { deleteData, editData } from './storage.js'

// Configurações de paginação
let currentPage = 1
let pageSize = 10
let filteredData = []

// Atualiza as métricas
export function updateMetrics(totalEntries) {
  document.getElementById('total-entries').textContent = totalEntries
  document.getElementById('history-count').textContent = totalEntries
}

// Calcula o desvio padrão
function calculateStdDev(data) {
  if (data.length <= 1) return 0

  const mean = data.reduce((acc, val) => acc + val, 0) / data.length
  const squareDiffs = data.map(value => {
    const diff = value - mean
    return diff * diff
  })
  const avgSquareDiff =
    squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length
  return Math.sqrt(avgSquareDiff).toFixed(2)
}

// Atualiza o relatório
export function updateReport(data) {
  if (data.length === 0) {
    document.getElementById('sum').textContent = '0'
    document.getElementById('average').textContent = '0'
    document.getElementById('min').textContent = '0'
    document.getElementById('max').textContent = '0'
    document.getElementById('std-dev').textContent = '0'
    return
  }

  const sum = data.reduce((acc, value) => acc + value, 0)
  const average = (sum / data.length).toFixed(2)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const stdDev = calculateStdDev(data)

  document.getElementById('sum').textContent = sum
  document.getElementById('average').textContent = average
  document.getElementById('min').textContent = min
  document.getElementById('max').textContent = max
  document.getElementById('std-dev').textContent = stdDev
}

// Inicializar controles de paginação
export function initHistoryControls(data, chart) {
  const searchInput = document.getElementById('history-search')
  const clearSearchBtn = document.getElementById('search-clear')
  const pageSizeSelect = document.getElementById('history-page-size')
  const firstPageBtn = document.getElementById('history-first')
  const prevPageBtn = document.getElementById('history-prev')
  const nextPageBtn = document.getElementById('history-next')
  const lastPageBtn = document.getElementById('history-last')

  // Inicializa dados filtrados
  filteredData = [...data]

  // Evento de busca
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim()

    if (searchTerm === '') {
      filteredData = [...data]
    } else {
      filteredData = data.filter(value => value.toString().includes(searchTerm))
    }

    currentPage = 1
    renderHistory(data, chart)
  })

  // Limpar busca
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = ''
    filteredData = [...data]
    currentPage = 1
    renderHistory(data, chart)
  })

  // Alterar itens por página
  pageSizeSelect.addEventListener('change', () => {
    pageSize = parseInt(pageSizeSelect.value)
    currentPage = 1
    renderHistory(data, chart)
  })

  // Navegação de páginas
  firstPageBtn.addEventListener('click', () => {
    currentPage = 1
    renderHistory(data, chart)
  })

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--
      renderHistory(data, chart)
    }
  })

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / pageSize)
    if (currentPage < totalPages) {
      currentPage++
      renderHistory(data, chart)
    }
  })

  lastPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / pageSize)
    currentPage = totalPages
    renderHistory(data, chart)
  })
}

// Renderiza o histórico de dados com paginação
export function renderHistory(data, chart) {
  const historyList = document.getElementById('history-list')
  const pageInfo = document.getElementById('history-page-info')
  const searchInput = document.getElementById('history-search')

  // Atualiza a lista de dados filtrados se necessário
  if (searchInput.value.trim() === '') {
    filteredData = [...data]
  } else {
    const searchTerm = searchInput.value.trim()
    filteredData = data.filter(value => value.toString().includes(searchTerm))
  }

  // Calcula paginação
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1

  // Garante que a página atual é válida
  if (currentPage > totalPages) {
    currentPage = totalPages
  }

  // Atualiza informações de página
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`

  // Limpa a lista
  historyList.innerHTML = ''

  // Se não há dados
  if (filteredData.length === 0) {
    const emptyItem = document.createElement('li')
    emptyItem.className = 'list-group-item text-center text-muted'
    emptyItem.textContent = 'Nenhum dado encontrado'
    historyList.appendChild(emptyItem)
    return
  }

  // Calcula índices para a página atual
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredData.length)

  // Obtém dados da página atual
  const pageData = filteredData.slice(startIndex, endIndex)

  // Adiciona cada item à lista
  pageData.forEach((value, index) => {
    // Encontra o índice real no array original
    const originalIndex = data.indexOf(value)
    if (originalIndex === -1) return

    const listItem = document.createElement('li')
    listItem.className =
      'list-group-item d-flex justify-content-between align-items-center'

    // Cria o número do item (considerando a paginação)
    const itemNumber = startIndex + index + 1

    listItem.innerHTML = `
      <div>
        <span class="badge bg-secondary me-2">${itemNumber}</span>
        <span>${value}</span>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-warning edit-btn" data-index="${originalIndex}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-outline-danger delete-btn" data-index="${originalIndex}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `

    historyList.appendChild(listItem)
  })

  // Adiciona eventos aos botões de editar e apagar
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index')
      // Usa um modal ou prompt para edição
      const newValue = prompt('Editar valor:', data[index])
      if (newValue !== null) {
        editData(index, newValue, chart)
      }
    })
  })

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index')
      if (confirm('Tem certeza que deseja apagar este valor?')) {
        deleteData(index, chart)
      }
    })
  })
}

// Função para ser chamada após atualização do dataHistory
export function refreshHistory(data, chart) {
  // Atualiza o array filteredData com os novos dados
  const searchInput = document.getElementById('history-search')
  if (searchInput.value.trim() === '') {
    filteredData = [...data]
  } else {
    const searchTerm = searchInput.value.trim()
    filteredData = data.filter(value => value.toString().includes(searchTerm))
  }

  // Atualiza a interface
  updateMetrics(data.length)
  updateReport(data)
  renderHistory(data, chart)
}
