export function formatRelativeTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diffMs < minute) {
    return "az önce"
  }
  if (diffMs < hour) {
    const m = Math.floor(diffMs / minute)
    return `${m} dakika önce`
  }
  if (diffMs < day) {
    if (diffMs >= 15 * hour) {
      return "dün"
    }
    const h = Math.floor(diffMs / hour)
    return `${h} saat önce`
  }
  // calendar-based "dün" check
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday.getTime() - day)
  if (date >= startOfYesterday && date < startOfToday) {
    return "dün"
  }
  if (diffMs < week) {
    const d = Math.floor(diffMs / day)
    return `${d} gün önce`
  }
  if (diffMs < month) {
    const w = Math.floor(diffMs / week)
    return `${w} hafta önce`
  }
  if (diffMs < year) {
    const mo = Math.floor(diffMs / month)
    return `${mo} ay önce`
  }
  const y = Math.floor(diffMs / year)
  return `${y} yıl önce`
}


