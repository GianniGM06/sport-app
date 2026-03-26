import { useState } from 'react'
import BottomNav from './components/layout/BottomNav'
import Profil from './pages/Profil'
import Programme from './pages/Programme'
import SeanceDuJour from './pages/SeanceDuJour'
import Suivi from './pages/Suivi'

export default function App() {
  const [activeTab, setActiveTab] = useState('seance')

  return (
    <div className="h-full bg-[#0F172A] text-white">
      <div className="h-full">
        {activeTab === 'profil' && <Profil />}
        {activeTab === 'programme' && <Programme />}
        {activeTab === 'seance' && <SeanceDuJour />}
        {activeTab === 'suivi' && <Suivi />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
