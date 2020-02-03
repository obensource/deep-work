#!/usr/bin/env node

const utils = require('./utils')

const timeAllocationQuestions = [
  'How many days will you be working this week? (integer only):',
  'How many hours will you spend in meetings this week? (integer or decimal):',
]

const rankingQuestions = [
  'is fundamental to your current personal strategy and roadmap.',
  'is fundamental to the current strategy and roadmap of your company (or the company you wish to work for).',
  'will deliver a competative advantage for you, and help you stand out in your space.',
  'will reduce operational costs and/or increase revenues.',
  'will increase user satisfaction (your partners, the public).',
  'will increase your satisfaction in your job.',
  'will affect the continuity of your company (or the company you wish to work for) if it\'s not completed.',
  'will affect your, or your company\'s reputation if delivery is delayed.',
  'costs more than the average project.',
  'has other initiatives that are dependent on its success or implementation.',
]

const timeAllocationQuestion = (timeObject, timeProp, timeQuestion) => {
  return new Promise((resolve, reject) => {
    utils.readline.question(`\n> ${timeQuestion} `, (value => {
      timeObject[timeProp] = value
      resolve()
    }))
  })
}

const initiativeQuestion1 = (initiativeObject) => {
  return new Promise((resolve, reject) => {
    utils.readline.question(`\n> Enter initiative name: `, (name => {
      initiativeObject.name = name
      resolve()
    }))
  })
}

const initiativeQuestion2 = (initiativeObject) => {
  return new Promise((resolve, reject) => {
    utils.readline.question(`\n> Which priority bucket does '${initiativeObject.name}' fit in ('company', 'oss', or 'personal')? `, (bucket => {
      initiativeObject.bucket = bucket
      resolve()
    }))
  })
}

const initiativeQuestion3 = (initiativeObject) => {
  return new Promise((resolve, reject) => {
    utils.readline.question(`\n> Is '${initiativeObject.name}' deep, or shallow work ('deep', 'shallow')? `, (type => {
      initiativeObject.type = type
      resolve()
    }))
  })
}

const rankingQuestion = (initiativeObject, question, priorityLevel) => {
  return new Promise((resolve, reject) => {
    utils.readline.question(`\n> ${initiativeObject.name.toUpperCase()} ${question} (1–10): `, (priorityValue => {
      if (isNaN(priorityValue)) {
        console.log('\n\nError: The priority level you entered wasn\'t a number, sorry – now your data is bad. :( \n\nI\'ll add more handling for this soon.')
        process.exit(1)
      }
      utils.updatePriorityLevel(priorityLevel, priorityValue, initiativeObject)
      resolve()
    }))
  })
}

module.exports = {
  timeAllocationQuestions: timeAllocationQuestions,
  rankingQuestions: rankingQuestions,
  timeAllocationQuestion: timeAllocationQuestion,
  initiativeQuestion1: initiativeQuestion1,
  initiativeQuestion2: initiativeQuestion2,
  initiativeQuestion3: initiativeQuestion3,
  rankingQuestion: rankingQuestion
}
