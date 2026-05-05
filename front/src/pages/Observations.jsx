import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Table, Btn, Field, Input, Alert, Spinner } from '../components/ui'

export default function Observations() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [cultureId, setCultureId] = useState('')

  const load = () => {
    setLoading(true)
    api.observations.getAll(cultureId ? { id_culture: cultureId } : {})
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: 'id_observation', label: 'ID' },
    { key: 'type_observation', label: 'Type' },
    { key: 'valeur',          label: 'Valeur' },
    { key: 'unite',           label: 'Unite' },
    { key: 'culture_nom',     label: 'Culture' },
    { key: 'date_observation', label: 'Date', render: v => v ? new Date(v).toLocaleString('fr-FR') : '—' },
    { key: 'note',            label: 'Note' },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>Observations</h2>
        <Btn onClick={load} variant="ghost">Rafraichir</Btn>
      </div>

      <Alert msg={error} type="error" onClose={() => setError(null)}/>

      <Card title="Filtres">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <Field label="ID Culture (optionnel)">
            <Input type="number" value={cultureId} onChange={e => setCultureId(e.target.value)} placeholder="Toutes" style={{ width: 160 }}/>
          </Field>
          <Btn onClick={load}>Appliquer</Btn>
          {cultureId && <Btn onClick={() => { setCultureId(''); }} variant="ghost">Effacer</Btn>}
        </div>
      </Card>

      <Card title={`${rows.length} observation(s)`}>
        {loading ? <Spinner/> : <Table columns={columns} rows={rows}/>}
      </Card>
    </>
  )
}
