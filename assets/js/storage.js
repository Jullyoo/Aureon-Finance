export function saveTheme(isLight) {

  localStorage.setItem(
    "theme-light",
    isLight
  )
}

export function loadTheme() {

  const isLight =
    localStorage.getItem(
      "theme-light"
    ) === "true"

  if (isLight) {
    document.body.classList.add(
      "light"
    )
  }
}

export function saveGoal(value) {

  localStorage.setItem(
    "monthly-goal",
    value
  )
}

export function getGoal() {

  return Number(
    localStorage.getItem(
      "monthly-goal"
    ) || 0
  )
}