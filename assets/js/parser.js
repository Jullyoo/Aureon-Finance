import {
  identifyCategory
} from "./categories.js"

export function processStatement(text) {

  const lines =
    text
      .split("\n")
      .filter(Boolean)

  return lines
    .map(parseLine)
    .filter(Boolean)
}

function parseLine(line) {

  const regex =
    /-?\d{1,3}(?:\.\d{3})*,\d{2}/

  const match =
    line.match(regex)

  if (!match) {
    return null
  }

  const rawValue =
    match[0]

  const value =
    Number(
      rawValue
        .replace(/\./g, "")
        .replace(",", ".")
    )

  const description =
    line
      .replace(rawValue, "")
      .trim()

  const category =
    identifyCategory(description)

  return {
    description,
    category,
    value,
    type:
      value >= 0
        ? "income"
        : "expense"
  }
}