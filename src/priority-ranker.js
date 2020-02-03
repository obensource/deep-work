#!/usr/bin/env node
var cowsay = require("cowsay");

const {
  timeAllocationQuestion,
  timeAllocationQuestions,
  initiativeQuestion1,
  initiativeQuestion2,
  initiativeQuestion3,
  rankingQuestion,
  rankingQuestions } = require('./questions')

const {
  clearScreen,
  sortByPriorityLevel,
  printWeeklyPriorities,
  readline } = require('./utils')

const initiatives = []
let initiative = {}
let priorityLevel = 0
let timeAllocationFactors = {}

// [white, red, green, yellow, blue, magenta, cyan]
const terminalColors = [
  '\x1b[37m',
  '\x1b[31m',
  '\x1b[32m',
  '\x1b[33m',
  '\x1b[35m',
  '\x1b[36m'
]

// How many initatives can we handle per week?
const bandwidthCeiling = 8
const averageWeeklyWorkingHours = 40

const questionnaire = async () => {
  clearScreen()

  console.log(terminalColors[2], cowsay.say({
	  text: '\\o/ Let\'s prioritize our work for the week! \\o/',
	  e: '👀',
    T: '⏰'
  }));
  
  // Allocate time for meetings
  await timeAllocationQuestion(timeAllocationFactors, 'numberOfWorkDays', timeAllocationQuestions[0])
  await timeAllocationQuestion(timeAllocationFactors, 'timeInMeetings', timeAllocationQuestions[1])

  while (initiatives.length <= bandwidthCeiling - 1) {

    initiatives.length >= terminalColors.length
      ? console.log(terminalColors[initiatives.length % terminalColors.length], cowsay.say({
	        text: `You have ${bandwidthCeiling - initiatives.length} initatives left to prioritize.`,
	        e: '👀',
          T: '📊'
        }))
      : console.log(terminalColors[initiatives.length], cowsay.say({
	        text : `You have ${bandwidthCeiling - initiatives.length} initatives left to prioritize.`,
	        e: '👀',
          T: '📊'
        }))

    // Initiative Qualifiers
    await initiativeQuestion1(initiative)
    await initiativeQuestion2(initiative)
    await initiativeQuestion3(initiative)

    // Scoring: 10 points per question, 100 points total
    await rankingQuestion(initiative, rankingQuestions[0], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[1], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[2], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[3], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[4], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[5], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[6], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[7], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[8], priorityLevel)
    await rankingQuestion(initiative, rankingQuestions[9], priorityLevel)
 
    initiatives.push(initiative)
    initiative = {}
    priorityLevel = 0
  }

  // Sort initiative priorities based on priority level
  sortByPriorityLevel(initiatives)

  // Print out our priorties for the week
  printWeeklyPriorities(initiatives, timeAllocationFactors)
  readline.close()
}

module.exports = questionnaire