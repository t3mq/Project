import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Table, Btn, Field, Input, Alert, Spinner } from '../components/ui'

export default function Meteo() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [limit, setLimit]     = useState(20)
  const [parcelleId, setParcelleId] = useState('')

  const load = () => {
    setLoading(true)
    api.meteo.get({ limit, id_parcelle: parcelleId || undefined })
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: 'date_meteo',     label: 'Date',          render: v => new Date(v).toLocaleDateString('fr-FR') },
    { key: 'temperature',    label: 'Temp. (°C)',     render: v => v != null ? `${parseFloat(v).toFixed(1)}°C` : '—' },
    { key: 'humidite',       label: 'Humidité (%)',   render: v => v != null ? `${parseFloat(v).toFixed(1)}%` : '—' },
    { key: 'precipitation',  label: 'Précip. (mm)',   render: v => v != null ? `${parseFloat(v).toFixed(1)} mm` : '—' },
    { key: 'vent_vitesse',   label: 'Vent (km/h)',    render: v => v != null ? `${parseFloat(v).toFixed(1)} km/h` : '—' },
    { key: 'ensoleillement', label: 'Ensoleil. (h)',  render: v => v != null ? `${parseFloat(v).toFixed(1)} h` : '—' },
    { key: 'parcelle_nom',   label: 'Parcelle' },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>Meteo</h2>
        <Btn onClick={load} variant="ghost">Rafraichir</Btn>
      </div>

      <Alert msg={error} type="error" onClose={() => setError(null)}/>

      <Card title="Filtres">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <Field label="Nombre de lignes">
            <Input type="number" value={limit} onChange={e => setLimit(e.target.value)} style={{ width: 100 }}/>
          </Field>
          <Field label="ID Parcelle (optionnel)">
            <Input type="number" value={parcelleId} onChange={e => setParcelleId(e.target.value)} placeholder="Toutes" style={{ width: 140 }}/>
          </Field>
          <Btn onClick={load}>Appliquer</Btn>
        </div>
      </Card>

      <Card title={`${rows.length} entree(s) meteo`}>
        {loading ? <Spinner/> : <Table columns={columns} rows={rows}/>}
      </Card>
    </>
  )
}
