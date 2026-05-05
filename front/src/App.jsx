import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Parcelles from './pages/Parcelles'
import Cultures from './pages/Cultures'
import Alertes from './pages/Alertes'
import Meteo from './pages/Meteo'
import Observations from './pages/Observations'

const PAGES = {
  dashboard:    Dashboard,
  parcelles:    Parcelles,
  cultures:     Cultures,
  alertes:      Alertes,
  meteo:        Meteo,
  observations: Observations,
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page]
  return (
    <Layout page={page} setPage={setPage}>
      <Page/>
    </Layout>
  )
}
