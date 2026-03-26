import { useState } from 'react'
import BottomNav from './components/layout/BottomNav'
import Profil from './pages/Profil'
import Programme from './pages/Programme'
import SeanceDuJour from './pages/SeanceDuJour'
import Suivi from './pages/Suivi'

export default function App() {
  const [activeTab, setActiveTab] = useState('seance')

  return (
    <div className="h-full text-white">
      <div className="h-full">
        {activeTab === 'profil'    && <div key="profil"    className="h-full page-enter"><Profil /></div>}
        {activeTab === 'programme' && <div key="programme" className="h-full page-enter"><Programme /></div>}
        {activeTab === 'seance'    && <div key="seance"    className="h-full page-enter"><SeanceDuJour /></div>}
        {activeTab === 'suivi'     && <div key="suivi"     className="h-full page-enter"><Suivi /></div>}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
