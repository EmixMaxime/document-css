const sheet = document.querySelector('.sheet')
const body = document.querySelector('body')

/**
 * Determines if the passed element is overflowing its bounds,
 * either vertically or horizontally.
 * Will temporarily modify the "overflow" style to detect this
 * if necessary.
 * 
 * @param {HTMLElement} el 
 * @param {Number} extraSize 
 */
function checkOverflow(el, extraSize = 0) {
  //  const curOverflow = el.style.overflow

  //  if (!curOverflow || curOverflow === "visible") {
  //   el.style.overflow = "hidden"
  //  }

   const isOverflowing = (el.offsetHeight + extraSize) < el.scrollHeight

  //  el.style.overflow = curOverflow

   return isOverflowing
}


/**
 * 
 * @param {HTMLElement} el 
 * @param {HTMLElement} child
 */
function prependChild(el, child) {
  el.insertBefore(child, el.firstChild)
}

function addAfter(el, newEl) {
  el.parentNode.insertBefore(newEl, el.nextSibling)
}

/**
 * @returns {HTMLElement} - not added to the DOM, just in memory.
 */
function createSection() {
  const section = document.createElement('section')
  section.classList.add('sheet')

  return section
}

function createAndAddNewSection(oldSection) {
  const newSection = document.createElement('section')
  newSection.classList.add('sheet')

  if (oldSection) {
    body.insertBefore(newSection, oldSection)
  } else {
    body.appendChild(newSection)
  }

  return newSection
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {HTMLElement} futurEl 
 */
const elementWillOverflow = (el, futurEl) =>
  checkOverflow(el, futurEl.offsetHeight + 1000)


/**
 * 
 * @param {HTMLElement} container 
 */
function pageManager(container) {

  // Do I need to create pages?
  if (checkOverflow(sheet)) {
    let currentFillingSection = createSection()
    addAfter(sheet, currentFillingSection)
  
    do {
      const lastChild = sheet.lastElementChild
  
      if (elementWillOverflow(currentFillingSection, lastChild)) {
        console.log('will overflow', currentFillingSection, lastChild)

        oldSection = currentFillingSection
        currentFillingSection = createSection()
        addAfter(sheet, currentFillingSection)
      }
  
      prependChild(currentFillingSection, lastChild)
    } while(checkOverflow(sheet))
  
  }
}

/**
 * 
 * @returns {HTMLElement} - document container will contains sheets.
 */
function createStructure() {
  const sheet = body.querySelector('.sheet')
  const container = document.createElement('div')
  container.classList.add('container')

  body.appendChild(container)
  container.appendChild(sheet)

  return container
}

const container = createStructure()
pageManager(container)

console.log('pageManaffger')
