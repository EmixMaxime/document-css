const summary = require('summary-js')

const contentContainer = document.querySelector('#to-summarize')
const whereShouldIPutTheSummary = document.querySelector('#summary-js')

summary(contentContainer, whereShouldIPutTheSummary)
