import ru from "@/messages/ru.json"

export function getTranslation(key: string, defaultValue = ""): string {
  const keys = key.split(".")
  let value: any = ru

  for (const k of keys) {
    if (typeof value === "object" && value !== null && k in value) {
      value = value[k]
    } else {
      return defaultValue
    }
  }

  return typeof value === "string" ? value : defaultValue
}

export function t(key: string): string {
  return getTranslation(key, key)
}
