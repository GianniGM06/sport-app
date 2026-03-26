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

  // Avatar initiales
  const initiales = profil.nom
    ? profil.nom.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <PageWrapper>
      <div className="px-4 pt-12 pb-4 space-y-6">

        {/* Avatar + nom */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}
          >
            <span className="text-2xl font-bold text-white">{initiales}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profil.nom || 'Mon Profil'}</h1>
            <p className="text-[#64748B] text-sm">{profil.niveau} · {profil.sports || 'Sports'}</p>
          </div>
        </div>

        {/* Section identité */}
        <Section label="Identité">
          <Field label="Prénom">
            <input
              type="text"
              value={profil.nom}
              onChange={(e) => setProfil({ nom: e.target.value })}
              className="w-full"
            />
          </Field>
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
        </Section>

        {/* Section entraînement */}
        <Section label="Entraînement">
          <Field label={`Durée max : ${profil.dureeSeance} min`}>
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

          <Field label="Niveau">
            <div className="flex gap-2">
              {NIVEAUX.map((n) => (
                <button
                  key={n}
                  onClick={() => setProfil({ niveau: n })}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  style={profil.niveau === n
                    ? { background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Jours d'entraînement">
            <div className="flex flex-wrap gap-2">
              {DAY_FULL.map((jour) => {
                const active = profil.joursDisponibles.includes(jour)
                return (
                  <button
                    key={jour}
                    onClick={() => toggleJour(jour)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={active
                      ? { background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }
                    }
                  >
                    {jour.slice(0, 3)}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Sports pratiqués">
            <input
              type="text"
              value={profil.sports}
              onChange={(e) => setProfil({ sports: e.target.value })}
              className="w-full text-sm"
            />
          </Field>
        </Section>

        {/* Section objectifs */}
        <Section label="Objectifs">
          <div className="space-y-2">
            {profil.objectifs.map((obj, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
                className="btn-blue px-4 py-2 min-h-[44px]"
              >+</button>
            </div>
          </div>
        </Section>

        {/* Section santé */}
        <Section label="Santé">
          <Field label="Zones sensibles / blessures">
            <textarea
              value={profil.zonesSensibles}
              onChange={(e) => setProfil({ zonesSensibles: e.target.value })}
              rows={3}
              className="w-full text-sm resize-none"
            />
          </Field>
        </Section>

        {/* Export */}
        <button
          onClick={exportJSON}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}
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

function Section({ label, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest flex-shrink-0">{label}</p>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#64748B]">{label}</label>
      {children}
    </div>
  )
}
