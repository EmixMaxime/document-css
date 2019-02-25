const images = Array.from(document.querySelectorAll('.sheet img'))

console.log('readable.js')
console.log(images)

const legendables = images.filter(img => img.hasAttribute('alt'))

legendables.map(legendable => {
  const figure = document.createElement('figure')
  const figcaption = document.createElement('figcaption')
  figcaption.classList.add('img-legend')

  // <img> are in <p> elements. So get this <p> and append figure child.
  legendable.parentElement.appendChild(figure)

  figcaption.textContent = legendable.getAttribute('alt')

  figure.appendChild(legendable)
  figure.appendChild(figcaption)
})
