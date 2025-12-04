import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const DARK_MODE_KEY = "darkMode"
const THEME_KEY = "theme"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function readStoredTheme() {
  if (typeof window === "undefined") {
    return false
  }

  const storedDarkValue = window.localStorage.getItem(DARK_MODE_KEY)
  if (storedDarkValue !== null) {
    return storedDarkValue === "true"
  }

  return window.localStorage.getItem(THEME_KEY) === "dark"
}

export function persistThemePreference(isDarkMode) {
  if (typeof window === "undefined") {
    return
  }

  const nextTheme = isDarkMode ? "dark" : "light"
  const nextDarkValue = isDarkMode ? "true" : "false"
  const currentTheme = window.localStorage.getItem(THEME_KEY)
  const currentDarkValue = window.localStorage.getItem(DARK_MODE_KEY)

  window.localStorage.setItem(THEME_KEY, nextTheme)
  window.localStorage.setItem(DARK_MODE_KEY, nextDarkValue)

  if (currentTheme !== nextTheme || currentDarkValue !== nextDarkValue) {
    window.dispatchEvent(
      new CustomEvent("themeChange", { detail: { isDarkMode } })
    )
  }
}


