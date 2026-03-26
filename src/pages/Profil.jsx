import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { useExport } from '../hooks/useExport'
import { DAY_FULL } from '../utils/dateUtils'

const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé']

export default function Profil() {
  const profil = useAppStore((s) => s.profil)
  const setProfil = useAppStore((s) => s.setProfil)
  const updatePoids = useAppStore((s) => s.updatePoids)
  const { exportJSON } = useExport()
  const [newObjectif, setNewObjectif] = useState('')
  const [poidsInput, setPoidsInput] = useState(String(profil.poids))

  const handlePoidsBlur = () => {
    const v = parseFloat(poidsInput)
    if (!isNaN(v) && v > 0) updatePoids(v)
  }

  const toggleJour = (jour) => {
    const jours = profil.joursDisponibles.includes(jour)
      ? profil.joursDisponibles.filter((j) => j !== jour)
      : [...profil.joursDisponibles, jour]
    setProfil({ joursDisponibles: jours })
  }

  const addObjectif = () => {
    if (!newObjectif.trim()) return
    setProfil({ objectifs: [...profil.objectifs, newObjectif.trim()] })
    setNewObjectif('')
  }

  const removeObjectif = (i) =>
    setProfil({ objectifs: profil.objectifs.filter((_, idx) => idx !== i) })

  return (
    <PageWrapper title="Mon Profil">
      <div className="px-4 py-4 space-y-5">

        {/* Prénom */}
        <Field label="Prénom">
          <input
            type="text"
            value={profil.nom}
            onChange={(e) => setProfil({ nom: e.target.value })}
            className="w-full"
          />
        </Field>

        {/* Poids */}
        <Field label="Poids (kg)">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={poidsInput}
              onChange={(e) => setPoidsInput(e.target.value)}
              onBlur={handlePoidsBlur}
              className="w-28"
              step="0.5"
              min="30"
              max="300"
            />
            <span className="text-[#64748B] text-sm">
              {profil.historiquePoids.length} enregistrement(s)
            </span>
          </div>
        </Field>

        {/* Objectifs */}
        <Field label="Objectifs">
          <div className="space-y-2">
            {profil.objectifs.map((obj, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#1E293B] rounded-lg px-3 py-2">
                <span className="flex-1 text-sm text-white">{obj}</span>
                <button
                  onClick={() => removeObjectif(i)}
                  className="text-[#EF4444] text-lg leading-none flex-shrink-0"
                >×</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newObjectif}
                onChange={(e) => setNewObjectif(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addObjectif()}
                placeholder="Ajouter un objectif…"
                className="flex-1 text-sm"
              />
              <button
                onClick={addObjectif}
                className="bg-[#3B82F6] text-white px-3 py-2 rounded-lg text-sm font-medium min-h-[44px]"
              >+</button>
            </div>
          </div>
        </Field>

        {/* Zones sensibles */}
        <Field label="Zones sensibles / blessures">
          <textarea
            value={profil.zonesSensibles}
            onChange={(e) => setProfil({ zonesSensibles: e.target.value })}
            rows={3}
            className="w-full text-sm resize-none"
          />
        </Field>

        {/* Jours disponibles */}
        <Field label="Jours d'entraînement">
          <div className="flex flex-wrap gap-2">
            {DAY_FULL.map((jour) => (
              <button
                key={jour}
                onClick={() => toggleJour(jour)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  profil.joursDisponibles.includes(jour)
                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                    : 'bg-transparent border-[#334155] text-[#64748B]'
                }`}
              >
                {jour.slice(0, 3)}
              </button>
            ))}
          </div>
        </Field>

        {/* Durée max */}
        <Field label={`Durée max par séance : ${profil.dureeSeance} min`}>
          <input
            type="range"
            min={30}
            max={120}
            step={5}
            value={profil.dureeSeance}
            onChange={(e) => setProfil({ dureeSeance: Number(e.target.value) })}
            className="w-full accent-[#3B82F6]"
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-1">
            <span>30 min</span><span>2h</span>
          </div>
        </Field>

        {/* Niveau */}
        <Field label="Niveau">
          <div className="flex gap-2">
            {NIVEAUX.map((n) => (
              <button
                key={n}
                onClick={() => setProfil({ niveau: n })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  profil.niveau === n
                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                    : 'bg-transparent border-[#334155] text-[#64748B]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Field>

        {/* Sports */}
        <Field label="Sports pratiqués">
          <input
            type="text"
            value={profil.sports}
            onChange={(e) => setProfil({ sports: e.target.value })}
            className="w-full text-sm"
          />
        </Field>

        {/* Export */}
        <button
          onClick={exportJSON}
          className="w-full flex items-center justify-center gap-2 bg-[#1E293B] border border-[#334155] text-white py-3 rounded-xl font-medium hover:bg-[#334155] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter pour Claude
        </button>

      </div>
    </PageWrapper>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
