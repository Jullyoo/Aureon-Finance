import {
  processStatement
} from "./parser.js"

import {
  updateDashboard
} from "./ui.js"

import {
  exportCSV
} from "./export.js"

import {
  loadTheme,
  saveTheme,
  saveGoal
} from "./storage.js"

const processBtn =
  document.getElementById(
    "processBtn"
  )

const clearBtn =
  document.getElementById(
    "clearBtn"
  )

const exportBtn =
  document.getElementById(
    "exportBtn"
  )

const fileInput =
  document.getElementById(
    "fileInput"
  )

const statementInput =
  document.getElementById(
    "statementInput"
  )

const themeBtn =
  document.getElementById(
    "toggleThemeBtn"
  )

const saveGoalBtn =
  document.getElementById(
    "saveGoalBtn"
  )

const goalInput =
  document.getElementById(
    "monthlyGoal"
  )

loadTheme()

processBtn.addEventListener(
  "click",
  handleProcess
)

clearBtn.addEventListener(
  "click",
  clearApp
)

exportBtn.addEventListener(
  "click",
  exportCSV
)

themeBtn.addEventListener(
  "click",
  toggleTheme
)

saveGoalBtn.addEventListener(
  "click",
  saveMonthlyGoal
)

fileInput.addEventListener(
  "change",
  importFile
)

function handleProcess() {

  const text =
    statementInput.value.trim()

  if (!text) {

    alert(
      "Informe um extrato."
    )

    return
  }

  const transactions =
    processStatement(text)

  updateDashboard(
    transactions
  )
}

function clearApp() {

  location.reload()
}

function toggleTheme() {

  document.body.classList.toggle(
    "light"
  )

  saveTheme(
    document.body.classList.contains(
      "light"
    )
  )
}

function saveMonthlyGoal() {

  saveGoal(goalInput.value)

  alert(
    "Meta salva."
  )
}

function importFile(event) {

  const file =
    event.target.files[0]

  if (!file) {
    return
  }

  const reader =
    new FileReader()

  reader.onload =
    function(e) {

      statementInput.value =
        e.target.result

      handleProcess()
    }

  reader.readAsText(file)
}