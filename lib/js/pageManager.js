const ss = document.querySelectorAll('.sheet')
const body = document.querySelector('body')

function prependChild(el, child) {
  el.insertBefore(child, el.firstChild)
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

function sectionWillOverflow(section, futurEl) {
  return checkOverflow(section, futurEl.clientHeight)
}

ss.forEach(sheet => {
  if (checkOverflow(sheet)) {
    let fillingSection = createAndAddNewSection()

    let i = 1
    do {
      const children = sheet.children
      const lastChild = children[children.length - i]

      if (sectionWillOverflow(fillingSection, lastChild)) {
        fillingSection = createAndAddNewSection(fillingSection)
      }
      
      // sheet.removeChild(lastChild)
      prependChild(fillingSection, lastChild)
    } while(checkOverflow(sheet))

  }
})

// Determines if the passed element is overflowing its bounds,
// either vertically or horizontally.
// Will temporarily modify the "overflow" style to detect this
// if necessary.
function checkOverflow(el, extraSize = 0)
{
   const curOverflow = el.style.overflow

   if (!curOverflow || curOverflow === "visible")
      el.style.overflow = "hidden"

   const isOverflowing = (el.clientHeight + extraSize) < el.scrollHeight

   el.style.overflow = curOverflow

   return isOverflowing
}

console.log('pageManager')
