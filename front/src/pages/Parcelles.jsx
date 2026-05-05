import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Badge, Table, Btn, Field, Input, Alert, Spinner } from '../components/ui'

const EMPTY = { nom: '', surface: '', latitude: '', longitude: '', description: '', id_utilisateur: 1 }

export default function Parcelles() {
  const [rows, setRows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [success, setSuccess] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    api.parcelles.getAll()
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
  const openEdit   = (p) => {
    setForm({ nom: p.nom, surface: p.surface, latitude: p.latitude, longitude: p.longitude, description: p.description ?? '', id_utilisateur: p.id_utilisateur })
    setEditId(p.id_parcelle)
    setShowForm(true)
  }

  const submit = async () => {
    const body = { ...form, surface: parseFloat(form.surface), latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), id_utilisateur: parseInt(form.id_utilisateur) }
    try {
      if (editId) {
        await api.parcelles.update(editId, body)
        setSuccess('Parcelle modifiée.')
      } else {
        await api.parcelles.create(body)
        setSuccess('Parcelle créée.')
      }
      setShowForm(false); setEditId(null)
      load()
    } catch (e) { setError(e.message) }
  }

  const del = async (id) => {
    if (!confirm(`Supprimer la parcelle #${id} ?`)) return
    try {
      await api.parcelles.delete(id)
      setSuccess('Parcelle supprimée.')
      load()
    } catch (e) { setError(e.message) }
  }

  const columns = [
    { key: 'id_parcelle', label: 'ID' },
    { key: 'nom',         label: 'Nom' },
    { key: 'surface',     label: 'Surface', render: v => `${v} ha` },
    { key: 'latitude',    label: 'Lat' },
    { key: 'longitude',   label: 'Lon' },
    { key: 'cultures',    label: 'Cultures', render: (v) => v?.length ?? 0 },
    { key: 'date_creation', label: 'Créée le', render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>🌾 Parcelles</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={load} variant="ghost">↻ Rafraîchir</Btn>
          <Btn onClick={openCreate}>+ Nouvelle parcelle</Btn>
        </div>
      </div>

      <Alert msg={error}   type="error"   onClose={() => setError(null)}/>
      <Alert msg={success} type="success" onClose={() => setSuccess(null)}/>

      {showForm && (
        <Card title={editId ? `Modifier la parcelle #${editId}` : 'Nouvelle parcelle'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Nom"><Input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Nom de la parcelle"/></Field>
            <Field label="Surface (ha)"><Input type="number" value={form.surface} onChange={e => set('surface', e.target.value)} step="0.1"/></Field>
            <Field label="Latitude"><Input type="number" value={form.latitude} onChange={e => set('latitude', e.target.value)} step="0.001"/></Field>
            <Field label="Longitude"><Input type="number" value={form.longitude} onChange={e => set('longitude', e.target.value)} step="0.001"/></Field>
            <Field label="Description" style={{ gridColumn: '1/-1' }}><Input value={form.description} onChange={e => set('description', e.target.value)}/></Field>
            <Field label="ID Utilisateur"><Input type="number" value={form.id_utilisateur} onChange={e => set('id_utilisateur', e.target.value)}/></Field>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Btn onClick={submit}>{editId ? 'Enregistrer' : 'Créer'}</Btn>
            <Btn onClick={() => setShowForm(false)} variant="ghost">Annuler</Btn>
          </div>
        </Card>
      )}

      <Card title={`${rows.length} parcelle(s)`}>
        {loading ? <Spinner/> : (
          <Table
            columns={columns}
            rows={rows}
            onAction={row => (
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn small onClick={() => openEdit(row)} variant="ghost">Éditer</Btn>
                <Btn small onClick={() => del(row.id_parcelle)} variant="danger">Suppr.</Btn>
              </div>
            )}
          />
        )}
      </Card>
    </>
  )
}
