import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Table, Btn, Field, Input, Alert, Spinner } from '../components/ui'

const EMPTY = {
  nom: '',
  surface: '',
  latitude: '',
  longitude: '',
  description: '',
  id_utilisateur: 1
}

export default function Parcelles() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await api.parcelles.getAll()
      setRows(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => {
    setForm(EMPTY)
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (p) => {
    setForm({
      nom: p.nom,
      surface: p.surface,
      latitude: p.latitude,
      longitude: p.longitude,
      description: p.description ?? '',
      id_utilisateur: p.id_utilisateur
    })
    setEditId(p.id_parcelle)
    setShowForm(true)
  }

  const submit = async () => {
    try {
      const body = {
        ...form,
        surface: parseFloat(form.surface),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        id_utilisateur: parseInt(form.id_utilisateur)
      }

      if (editId) {
        await api.parcelles.update(editId, body)
        setSuccess('Parcelle modifiée')
      } else {
        await api.parcelles.create(body)
        setSuccess('Parcelle créée')
      }

      setShowForm(false)
      setEditId(null)
      load()

    } catch (e) {
      setError(e.message)
    }
  }

  const del = async (id) => {
    if (!confirm(`Supprimer la parcelle #${id} ?`)) return

    try {
      await api.parcelles.delete(id)
      setSuccess('Parcelle supprimée')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const columns = [
    { key: 'id_parcelle', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'surface', label: 'Surface', render: v => `${v} ha` },
    { key: 'latitude', label: 'Lat' },
    { key: 'longitude', label: 'Lon' },
    {
      key: 'cultures',
      label: 'Cultures',
      render: (v) => v?.length || 0
    },
    {
      key: 'date_creation',
      label: 'Créée le',
      render: v => new Date(v).toLocaleDateString('fr-FR')
    }
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🌾 Parcelles</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={load} variant="ghost">↻ Refresh</Btn>
          <Btn onClick={openCreate}>+ Ajouter</Btn>
        </div>
      </div>

      <Alert msg={error} type="error" onClose={() => setError(null)} />
      <Alert msg={success} type="success" onClose={() => setSuccess(null)} />

      {showForm && (
        <Card title={editId ? `Modifier #${editId}` : 'Nouvelle parcelle'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Nom">
              <Input value={form.nom} onChange={e => set('nom', e.target.value)} />
            </Field>

            <Field label="Surface">
              <Input type="number" value={form.surface} onChange={e => set('surface', e.target.value)} />
            </Field>

            <Field label="Latitude">
              <Input type="number" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
            </Field>

            <Field label="Longitude">
              <Input type="number" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
            </Field>

            <Field label="Description" style={{ gridColumn: '1/-1' }}>
              <Input value={form.description} onChange={e => set('description', e.target.value)} />
            </Field>

            <Field label="Utilisateur ID">
              <Input type="number" value={form.id_utilisateur} onChange={e => set('id_utilisateur', e.target.value)} />
            </Field>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <Btn onClick={submit}>
              {editId ? 'Modifier' : 'Créer'}
            </Btn>
            <Btn onClick={() => setShowForm(false)} variant="ghost">
              Annuler
            </Btn>
          </div>
        </Card>
      )}

      <Card title={`${rows.length} parcelle(s)`}>
        {loading ? <Spinner /> : (
          <Table
            columns={columns}
            rows={rows}
            onAction={(row) => (
              <div style={{ display: 'flex', gap: 5 }}>
                <Btn small onClick={() => openEdit(row)}>Edit</Btn>
                <Btn small variant="danger" onClick={() => del(row.id_parcelle)}>Delete</Btn>
              </div>
            )}
          />
        )}
      </Card>
    </>
  )
}