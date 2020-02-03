#!/usr/bin/env node

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const clearScreen = () => {
  process.stdout.write("\u001b[2J\u001b[0;0H")
}

const updatePriorityLevel = (priorityLevel, priorityValue, initiativeObject) => {
  priorityLevel += parseInt(priorityValue)
  initiativeObject.priority = priorityLevel
}

const sortByPriorityLevel = (priorities) => {
  priorities.sort((a, b) => {
    return b.priority - a.priority
  })
}

const timeToSpendOnPriority = (deepPrioritiesArray, shallowPrioritiesArray, timeFactorsObject) => {
  // How many hours we work per week on average
  const workingHoursPerWeek = timeFactorsObject.isFridayHalfday === 'y'
    ? (timeFactorsObject.numberOfWorkDays * 8) - 4
    : timeFactorsObject.numberOfWorkDays * 8

  const actualWorkingHours = workingHoursPerWeek - timeFactorsObject.timeInMeetings
  
  // 75 percent of hour time dedicated to 'deep work'
  const deepWorkTimeAllocation = .75 * actualWorkingHours

  // 25 percent of our time dedicated to 'shallow work'
  const shallowWorkTimeAllocation = .25 * actualWorkingHours

  // How much time we should spend on each deep work dependant priority this week
  const deepWorkTime = shallowPrioritiesArray.length === 0
    ? actualWorkingHours
    : deepWorkTimeAllocation / deepPrioritiesArray.length

  // How much time we should spend on each shallow work dependant prioirty this week
  const shallowWorkTime = deepPrioritiesArray.length === 0
    ? actualWorkingHours 
    : shallowWorkTimeAllocation / shallowPrioritiesArray.length

  return [deepWorkTime, shallowWorkTime]
}

const printPriorities = (prioritiesArray, allottedTime) => {
  sortByPriorityLevel(prioritiesArray)
  prioritiesArray.map(priority => {
    if (allottedTime) {
      console.log(priority.name.toUpperCase(), `– Time Available:`, allottedTime.toFixed(2), 'hours')
    } else {
      console.log(priority.name.toUpperCase(), `– Priority Level:`, priority.priority, `, Type:`, priority.type)
    }
  })
}

const printWeeklyPriorities = (prioritiesArray, timeFactorsObject) => {
  const companyPriorities = prioritiesArray.filter(i => i.bucket === 'employer')
  const ossPriorities = prioritiesArray.filter(i => i.bucket === 'oss')
  const personalPriorities = prioritiesArray.filter(i => i.bucket === 'personal')
  const deepWork = prioritiesArray.filter(i => i.type === 'deep')
  const shallowWork = prioritiesArray.filter(i => i.type === 'shallow')

  const timeAllocationByWorkType = timeToSpendOnPriority(deepWork, shallowWork, timeFactorsObject)

  clearScreen()

  console.log(`\x1b[0m`, `\n### PRIORITIES FOR THIS WEEK BY BUCKET ###`)

  console.log(`\n**** COMPANY ORIENTED ****`)
  printPriorities(companyPriorities)

  console.log(`\n**** OPEN SOURCE ****`)
  printPriorities(ossPriorities)

  console.log(`\n**** PERSONAL DEVELOPMENT ****`)
  printPriorities(personalPriorities)

  console.log(`\n\n### PRIORITIES FOR THIS WEEK BY TYPE ###`)

  console.log(`\n**** DEEP WORK ****`)
  printPriorities(deepWork, timeAllocationByWorkType[0])

  console.log(`\n**** SHALLOW WORK ****`)
  printPriorities(shallowWork, timeAllocationByWorkType[1])

  console.log(`\n### TIME SPENT IN MEETINGS THIS WEEK ###`)

  console.log(`\nYour time for deliverable work has been reduced this week by:`, timeFactorsObject.timeInMeetings, 'hours.\n')
}

module.exports = {
  readline: readline,
  clearScreen: clearScreen,
  updatePriorityLevel: updatePriorityLevel,
  sortByPriorityLevel: sortByPriorityLevel,
  timeToSpendOnPriority: timeToSpendOnPriority,
  printPriorities: printPriorities,
  printWeeklyPriorities: printWeeklyPriorities
}
