export function setupExportButtons() {
  const exportPdfButton = document.getElementById('export-pdf')
  const exportCsvButton = document.getElementById('export-csv')
  const exportExcelButton = document.getElementById('export-excel')
  const exportTxtButton = document.getElementById('export-txt')

  if (
    exportPdfButton &&
    exportCsvButton &&
    exportExcelButton &&
    exportTxtButton
  ) {
    exportPdfButton.addEventListener('click', () => {
      alert('Exportar para PDF (em desenvolvimento)')
    })

    exportCsvButton.addEventListener('click', () => {
      alert('Exportar para CSV (em desenvolvimento)')
    })

    exportExcelButton.addEventListener('click', () => {
      alert('Exportar para Excel (em desenvolvimento)')
    })

    exportTxtButton.addEventListener('click', () => {
      alert('Exportar para TXT (em desenvolvimento)')
    })
  } else {
    console.error('Botões de exportação não encontrados!')
  }
}
