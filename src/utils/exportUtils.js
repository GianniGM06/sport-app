export function buildExportPayload(profil, programme, prs, logs) {
  const today = new Date().toISOString().split('T')[0]

  // Build semaines summary
  const semaines = {}
  logs.forEach((log) => {
    const d = new Date(log.date + 'T00:00:00')
    const year = d.getFullYear()
    const week = String(getWeekNum(d)).padStart(2, '0')
    const key = `${year}-W${week}`
    if (!semaines[key]) semaines[key] = { seancesRealisees: [], seancesManquees: [] }
    const session = programme.find((s) => s.id === log.sessionId)
    if (session) semaines[key].seancesRealisees.push(session.jour)
  })

  // Build prs map with exercise names
  const prsNamed = {}
  Object.entries(prs).forEach(([exId, pr]) => {
    if (!pr) return
    let nom = exId
    programme.forEach((s) => {
      const ex = s.exercices.find((e) => e.id === exId)
      if (ex) nom = ex.nom
    })
    prsNamed[nom] = pr
  })

  return {
    meta: {
      exportDate: today,
      exportVersion: '1.0',
      appName: 'SportApp Gianni',
    },
    profil,
    prs: prsNamed,
    logs,
    semaines,
  }
}

function getWeekNum(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
}

export function downloadJSON(payload, filename) {
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.open(url, '_blank')
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
