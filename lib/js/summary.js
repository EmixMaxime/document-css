class Summary {

    constructor(container, navigationContainer) {
        this.container = container
        this.sections = $('#to-summarize').nextAll('.sheet')
        this.titles = this.sections.find('h1, h2, h3, h4, h5').toArray()

        const ulPrincipal = document.createElement('ul')
        ulPrincipal.classList.add('summary')
        navigationContainer.appendChild(ulPrincipal)

        this.uls = [ulPrincipal]
        this.buildStructure()
    }

    /**
     * 
     * @param {HTMLElement} title
     */
    searchSheetTitleContainer(title) {
        let section = title.parentNode

        for (let i = 0; i < 2; i++) {
            if (!section.classList.contains('sheet')) {
                section = section.parentNode
            }
        }

        if (!section.classList.contains('sheet')) {
            throw new Error(`title parent isn't section.sheet for title ${title.textContent} ${title}`)
        }

        return section
    }

    searchPageNumber(section) {
        const paginationElement = section.querySelector('.pagination')

        if (!paginationElement) {
            throw new Error(`Can't found paginationElement in section ${section}.`)
        }

        const pagination = paginationElement.textContent
        // Get the first number into a String
        // from https://stackoverflow.com/questions/609574/get-the-first-ints-in-a-string-with-javascript#609588
        const [pageNumber] = pagination.match(/\d+/)

        return pageNumber
    }

    /**
     * 
     * @param {HTMLElement} title
     * @returns {Number} 
     */
    getLevelOfTitle(title) {
        return parseInt(title.tagName.replace('H', ''), 10)
    }

    getNextTitleLevel(title, level, titleIndex) {
        const nextTitles = this.titles.slice(titleIndex+1)

        for (let i = 0; i < nextTitles.length; i++) {
            const currentTitle = nextTitles[i]
            const currentLevel = this.getLevelOfTitle(currentTitle)

            if (currentLevel === level) {
                return currentTitle
            }
        }
    }

    getPreviousTitleLevel(title, level, titleIndex) {
        const previousTitles = this.titles.slice(0, titleIndex)

        for (let i = previousTitles.length-1; i > 0; i--) {
            const currentTitle = previousTitles[i]
            const currentLevel = this.getLevelOfTitle(currentTitle)

            if (currentLevel === level) {
                return currentTitle
            }
        }
    }

    getPreviousTag(sections, tag) {
        for (let i = sections.length -1; i > 0; i--) {
            const section = sections[i]

            const sectionTitle = section.querySelector(tag)
            if (sectionTitle) return sectionTitle
        }
    }

    addSectitonHeader() {
        const {sections} = this

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]

            const sectionTitle = section.querySelector('h1')
            if (sectionTitle) continue

            const previousSections = sections.slice(0,i)

            const previousH2 = this.getPreviousTag(previousSections, 'h1')
            const previousH3 = this.getPreviousTag(previousSections, 'h2')

            const header = document.createElement('div')
            header.classList.add('section-header')

            header.textContent = previousH2.textContent

            if (previousH3 && !section.querySelector('h2')) {
                header.textContent += ' - ' + previousH3.textContent
            }
            
            section.appendChild(header)
        }
    }

    addSectionFooter() {
        const {sections} = this

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]

            const footer = document.createElement('div')
            footer.classList.add('section--footer')
            footer.textContent = "Rapport d'activités Airbus - 24 déc. 2018 au 23 fév. 2019."

            section.appendChild(footer)
        }
    }

    buildStructure() {
        // this.addSectitonHeader()
        this.addSectionFooter()

        let lastLevel = 0
        const pageRange = []
        let pageRangeString = ''

        for (let i = 0; i < this.titles.length; i++) {
            const title = this.titles[i]
            const level = this.getLevelOfTitle(title)

            // Don't go too deep please
            if (level >= 3) {
                continue
            }

            const section = this.searchSheetTitleContainer(title)


            if (level === 1) {
                const nextTitle = this.getNextTitleLevel(title, level, i)
                console.log({nextTitle})
                if (nextTitle) {
                    pageRange[0] = this.searchPageNumber(section)
    
                    const nextSection = this.searchSheetTitleContainer(nextTitle)
                    const nextLevelPage = this.searchPageNumber(nextSection)
                    pageRange[1] = nextLevelPage
    
                    pageRangeString = pageRange[0] + '-' + (pageRange[1] -1)
                }
            } else {
                pageRangeString = ''
            }

            if (level === 2) {
                // const previousTitle = this.getPreviousTitleLevel(title, 1, i)
                // if (previousTitle) {
                //     this.addSectitonHeader(previousTitle, section)
                // }

            }

            if (!title.getAttribute('id')) {
                title.setAttribute('id', title.textContent)
            }

            
            if (level - lastLevel > 1) {
                throw new Error(`Erreur dans la structure des titres ${lastLevel} to ${level} : ${title.textContent}`)
            }

            lastLevel = level

            const li = document.createElement('li')
            const a = document.createElement('a')

            a.setAttribute('href', '#' + title.getAttribute('id'))
            a.textContent = title.textContent
            
            const span = document.createElement('span')
            span.classList.add('summary--pagination')
            span.textContent = pageRangeString

            a.appendChild(span)
            a.classList.add('l-color-purple--hover')
            li.appendChild(a)

            // On a un <ul> parent ?
            if (!this.uls[level - 1]) {
                const ul = document.createElement('ul')
                ul.classList.add('summary')
                this.uls[level - 1] = ul
                this.uls[level - 2].lastChild.appendChild(ul)
            }

            this.uls[level] = null // Ce niveau n'a pas de <ul> enfant
            this.uls[level - 1].appendChild(li) // On place notre <li> dans le <ul> parent

        }
    }

}

new Summary(document.querySelector('#to-summarize'), document.querySelector('#summary-js'))
