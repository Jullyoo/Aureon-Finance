import { state } from "./state.js"

import {
  formatCurrency
} from "./utils.js"

import {
  updateCharts
} from "./charts.js"

import {
  updateSimulation
} from "./simulator.js"

import {
  getGoal
} from "./storage.js"

export function updateDashboard(
  transactions
) {

  state.transactions =
    transactions

  renderTable()

  calculateFinancialData()

  updateCharts()
}

function renderTable() {

  const table =
    document.getElementById(
      "transactionsTable"
    )

  table.innerHTML = ""

  state.transactions.forEach(t => {

    const tr =
      document.createElement("tr")

    appendCell(
      tr,
      t.description
    )

    appendCell(
      tr,
      translateCategory(t.category)
    )

    appendCell(
      tr,
      translateType(t.type)
    )

    appendCell(
      tr,
      formatCurrency(
        Math.abs(t.value)
      )
    )

    table.appendChild(tr)
  })
}

function appendCell(
  row,
  text
) {

  const td =
    document.createElement("td")

  td.textContent = text

  row.appendChild(td)
}

function translateType(type) {

  const types = {
    income: "Crédito",
    expense: "Débito"
  }

  return types[type] || type
}

function translateCategory(category) {

  const categories = {
    mercado: "Mercado",
    moradia: "Moradia",
    transporte: "Transporte",
    saude: "Saúde",
    investimento: "Investimento",
    delivery: "Delivery",
    lazer: "Lazer",
    educacao: "Educação",
    outros: "Outros"
  }

  return categories[category] || category
}

function calculateFinancialData() {

  let income = 0
  let expense = 0
  let invest = 0

  let needs = 0
  let wants = 0

  state.transactions.forEach(t => {

    const value =
      Math.abs(t.value)

    if (t.type === "income") {

      income += value

    } else {

      expense += value

      if (
        [
          "mercado",
          "moradia",
          "saude",
          "transporte"
        ].includes(t.category)
      ) {

        needs += value

      } else {

        wants += value
      }

    }

    if (
      t.category ===
      "investimento"
    ) {
      invest += value
    }

  })

  state.wantsValue =
    wants

  const balance =
    income - expense

  setText(
    "incomeValue",
    formatCurrency(income)
  )

  setText(
    "expenseValue",
    formatCurrency(expense)
  )

  setText(
    "balanceValue",
    formatCurrency(balance)
  )

  setPercentages(
    income,
    needs,
    wants,
    invest
  )

  updateSimulation(wants)

  validateGoal(
    expense + invest
  )
}

function setPercentages(
  income,
  needs,
  wants,
  invest
) {

  const needsPercent =
    income
      ? ((needs / income) * 100)
        .toFixed(1)
      : 0

  const wantsPercent =
    income
      ? ((wants / income) * 100)
        .toFixed(1)
      : 0

  const investPercent =
    income
      ? ((invest / income) * 100)
        .toFixed(1)
      : 0

  setText(
    "needsPercent",
    `${needsPercent}%`
  )

  setText(
    "wantsPercent",
    `${wantsPercent}%`
  )

  setText(
    "investPercent",
    `${investPercent}%`
  )
}

function validateGoal(
  total
) {

  const goal =
    getGoal()

  const result =
    document.getElementById(
      "goalResult"
    )

  result.textContent =
    total <= goal
      ? "Meta financeira atingida."
      : "Meta financeira ultrapassada."

  result.className =
    total <= goal
      ? "meta-success"
      : "meta-error"
}

function setText(
  id,
  value
) {

  document.getElementById(
    id
  ).textContent = value
}