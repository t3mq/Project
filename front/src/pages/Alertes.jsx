import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Badge, Table, Btn, Alert, Spinner } from '../components/ui'

export default function Alertes() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(null)
  const [running, setRunning]   = useState(false)

  const load = () => {
    setLoading(true)
    api.alertes.getAll()
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resolve = async (id) => {
    try {
      await api.alertes.resolve(id)
      setSuccess(`Alerte #${id} résolue.`)
      load()
    } catch (e) { setError(e.message) }
  }

  const runEngine = async () => {
    setRunning(true)
    try {
      const res = await api.alertes.run()
      setSuccess(`Moteur exécuté — ${res.alertes_creees} alerte(s) créée(s).`)
      load()
    } catch (e) { setError(e.message) }
    finally { setRunning(false) }
  }

  const active  = rows.filter(a => a.statut === 'active')
  const resolue = rows.filter(a => a.statut === 'resolue')

  const columns = [
    { key: 'id_alerte',   label: 'ID' },
    { key: 'niveau',      label: 'Niveau',  render: v => <Badge level={v}/> },
    { key: 'statut',      label: 'Statut',  render: v => <Badge level={v}/> },
    { key: 'message',     label: 'Message' },
    { key: 'culture_nom', label: 'Culture' },
    { key: 'regle_nom',   label: 'Règle' },
    { key: 'date_alerte', label: 'Date',    render: v => new Date(v).toLocaleString('fr-FR') },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>🔔 Alertes</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={load} variant="ghost">↻ Rafraîchir</Btn>
          <Btn onClick={runEngine} variant="warning" disabled={running}>
            {running ? 'Exécution…' : '⚡ Déclencher le moteur'}
          </Btn>
        </div>
      </div>

      <Alert msg={error}   type="error"   onClose={() => setError(null)}/>
      <Alert msg={success} type="success" onClose={() => setSuccess(null)}/>

      <Card title={`Actives (${active.length})`}>
        {loading ? <Spinner/> : (
          <Table
            columns={columns}
            rows={active}
            onAction={row => row.statut === 'active'
              ? <Btn small onClick={() => resolve(row.id_alerte)} variant="ghost">Résoudre</Btn>
              : null
            }
          />
        )}
      </Card>

      <Card title={`Historique résolues (${resolue.length})`}>
        {loading ? <Spinner/> : <Table columns={columns} rows={resolue}/>}
      </Card>
    </>
  )
}
