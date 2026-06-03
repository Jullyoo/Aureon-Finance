import {
  formatCurrency
} from "./utils.js"

export function updateSimulation(
  wantsValue
) {

  const range =
    document.getElementById(
      "reductionRange"
    )

  const reductionValue =
    document.getElementById(
      "reductionValue"
    )

  const simulationValue =
    document.getElementById(
      "simulationValue"
    )

  const percent =
    Number(range.value)

  reductionValue.textContent =
    percent

  const annualEconomy =
    wantsValue *
    (percent / 100) *
    12

  simulationValue.textContent =
    formatCurrency(
      annualEconomy
    )
}