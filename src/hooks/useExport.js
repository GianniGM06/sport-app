import { useCallback } from 'react'
import useAppStore from '../store/useAppStore'
import { buildExportPayload, downloadJSON } from '../utils/exportUtils'

export function useExport() {
  const profil = useAppStore((s) => s.profil)
  const programme = useAppStore((s) => s.programme)
  const prs = useAppStore((s) => s.prs)
  const logs = useAppStore((s) => s.logs)

  const exportJSON = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const payload = buildExportPayload(profil, programme, prs, logs)
    downloadJSON(payload, `export_sport_${today}.json`)
  }, [profil, programme, prs, logs])

  return { exportJSON }
}
