import { useEffect, useState } from 'react'
import { api } from '../api'
import { KpiCard, Card, Badge, Alert, Spinner, Btn } from '../components/ui'
import dynamic from 'react-dynamic-import'
import MapLeaflet from '../components/MapLeaflet'

export default function Dashboard() {
  const [parcelles, setParcelles] = useState([])
  const [alertes, setAlertes]     = useState([])
  const [meteo, setMeteo]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    Promise.all([
      api.parcelles.getAll(),
      api.alertes.getAll(),
      api.meteo.latest(),
    ])
      .then(([p, a, m]) => {
        setParcelles(p)
        setAlertes(a.filter(a => a.statut === 'active'))
        setMeteo(m)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleResolve = async (id) => {
    await api.alertes.resolve(id)
    setAlertes(prev => prev.filter(a => a.id_alerte !== id))
  }

  if (loading) return <Spinner/>

  const activeAlerts  = alertes.filter(a => a.statut === 'active')
  const criticalCount = alertes.filter(a => a.niveau === 'critique').length

  return (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 800 }}>Tableau de bord</h2>
      <Alert msg={error} onClose={() => setError(null)}/>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12 }}>
        <KpiCard label="Parcelles" value={parcelles.length} sub="enregistrées"/>
        <KpiCard label="Alertes actives" value={activeAlerts.length} sub={criticalCount > 0 ? `dont ${criticalCount} critique(s)` : 'aucune critique'} color={activeAlerts.length > 0 ? '#dc2626' : '#4d7c2f'}/>
        <KpiCard label="Température" value={meteo ? `${Math.round(meteo.temperature)}°C` : '—'} sub={meteo ? `Humidité ${Math.round(meteo.humidite)}%` : 'pas de données'}/>
        <KpiCard label="Précipitations" value={meteo ? `${meteo.precipitation}mm` : '—'} sub={meteo ? new Date(meteo.date_meteo).toLocaleDateString('fr-FR') : ''}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

            {/* Map */}
            <div style={{ gridColumn: '1 / -1', height: 320 }}>
              <Card title="Carte des parcelles" style={{ height: '100%' }}>
                <div style={{ height: '260px' }}>
                  <MapLeaflet parcelles={parcelles} />
                </div>
              </Card>
            </div>

        {/* Parcelles */}
        <Card title="Dernières parcelles">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Nom', 'Surface', 'Cultures'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcelles.slice(0, 6).map(p => (
                <tr key={p.id_parcelle} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '7px 8px', fontWeight: 500 }}>{p.nom}</td>
                  <td style={{ padding: '7px 8px', color: '#6b7280' }}>{p.surface} ha</td>
                  <td style={{ padding: '7px 8px', color: '#6b7280' }}>{p.cultures?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Alertes */}
        <Card title="Alertes actives">
          {alertes.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 13 }}>✓ Aucune alerte active.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alertes.slice(0, 5).map(a => (
                <div key={a.id_alerte} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: '#f9fafb', borderRadius: 8 }}>
                  <Badge level={a.niveau}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{a.message}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.culture_nom} · {a.regle_nom}</div>
                  </div>
                  <button
                    onClick={() => handleResolve(a.id_alerte)}
                    style={{ padding: '3px 9px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >Résoudre</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
