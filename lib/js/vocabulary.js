console.log('vocab')

const vocab = Array.from(document.querySelectorAll('.vocabulary'))
const vocabContainer = document.querySelector('#vocabulary')

const ul = document.createElement('ul')
vocabContainer.appendChild(ul)

vocab.map(v => {
  const li = document.createElement('li')
  li.textContent = v.textContent
  ul.appendChild(li)
})
