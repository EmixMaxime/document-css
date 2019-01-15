const sheets = Array.from(document.querySelectorAll('.sheet'))
const startPaginate = document.querySelector('[data-pagination-start]')

const pagination = (startPaginate, sheets) => {
  const toPaginate = sheets.slice(sheets.indexOf(startPaginate), sheets.length)
  const paginationStartPage = 2
  
  const beforeText = 'Page n°'
  const afterText = ' / ' + (toPaginate.length + paginationStartPage)
  
  
  for (let i = 1; i <= toPaginate.length; i++) {
    const paginateEl = document.createElement('div')
    paginateEl.classList.add('pagination')
    paginateEl.innerText = beforeText + (i + paginationStartPage) + afterText
  
    toPaginate[i-1].appendChild(paginateEl)
  }
}

pagination(startPaginate, sheets)
