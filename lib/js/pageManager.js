const sheet = document.querySelector('.sheet')
const body = document.querySelector('body')

// Determines if the passed element is overflowing its bounds,
// either vertically or horizontally.
// Will temporarily modify the "overflow" style to detect this
// if necessary.
function checkOverflow(el, extraSize = 0)
{
  //  const curOverflow = el.style.overflow

  //  if (!curOverflow || curOverflow === "visible") {
  //   el.style.overflow = "hidden"
  //  }

   const isOverflowing = (el.offsetHeight + extraSize) < el.scrollHeight

  //  el.style.overflow = curOverflow

   return isOverflowing
}


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
  return checkOverflow(section, futurEl.offsetHeight)
}

if (checkOverflow(sheet)) {
  let fillingSection = createAndAddNewSection()

  do {
    const lastChild = sheet.lastElementChild
    console.log(lastChild)

    if (sectionWillOverflow(fillingSection, lastChild)) {
      console.log('will overflow', fillingSection, lastChild)
      fillingSection = createAndAddNewSection(fillingSection)
    }

    prependChild(fillingSection, lastChild)
  } while(checkOverflow(sheet))

}

console.log('pageManaffger')
