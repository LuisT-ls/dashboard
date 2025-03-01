// Atualiza as métricas
export function updateMetrics(totalEntries) {
  document.getElementById('total-entries').textContent = totalEntries
}

// Atualiza o relatório
export function updateReport(data) {
  const sum = data.reduce((acc, value) => acc + value, 0)
  const average = (sum / data.length).toFixed(2)
  const min = Math.min(...data)
  const max = Math.max(...data)

  document.getElementById('sum').textContent = sum
  document.getElementById('average').textContent = average
  document.getElementById('min').textContent = min
  document.getElementById('max').textContent = max
}

// Renderiza o histórico de dados
export function renderHistory(data) {
  const historyList = document.getElementById('history-list')
  historyList.innerHTML = ''

  data.forEach((value, index) => {
    const listItem = document.createElement('li')
    listItem.className =
      'list-group-item d-flex justify-content-between align-items-center'
    listItem.innerHTML = `
          <span>${value}</span>
          <div>
              <button class="btn btn-sm btn-warning me-2 edit-btn" data-index="${index}">Editar</button>
              <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Apagar</button>
          </div>
      `
    historyList.appendChild(listItem)
  })

  // Adiciona eventos aos botões de editar e apagar
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index')
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
