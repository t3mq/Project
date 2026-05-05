import { useEffect, useState } from 'react'
import { api } from '../api'
import { Card, Badge, Table, Btn, Field, Input, Select, Alert, Spinner } from '../components/ui'

const EMPTY = { nom: '', variete: '', date_semis: '', date_recolte_prevue: '', statut: 'en cours', id_parcelle: '' }

export default function Cultures() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    api.cultures.getAll()
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
  const openEdit   = (c) => {
    setForm({ nom: c.nom, variete: c.variete ?? '', date_semis: c.date_semis?.slice(0, 10) ?? '', date_recolte_prevue: c.date_recolte_prevue?.slice(0, 10) ?? '', statut: c.statut, id_parcelle: c.id_parcelle })
    setEditId(c.id_culture); setShowForm(true)
  }

  const submit = async () => {
    const body = { ...form, id_parcelle: parseInt(form.id_parcelle), variete: form.variete || null, date_recolte_prevue: form.date_recolte_prevue || null }
    try {
      if (editId) {
        await api.cultures.update(editId, body)
        setSuccess('Culture modifiée.')
      } else {
        await api.cultures.create(body)
        setSuccess('Culture créée.')
      }
      setShowForm(false); load()
    } catch (e) { setError(e.message) }
  }

  const del = async (id) => {
    if (!confirm(`Supprimer la culture #${id} ?`)) return
    try { await api.cultures.delete(id); setSuccess('Culture supprimée.'); load() }
    catch (e) { setError(e.message) }
  }

  const columns = [
    { key: 'id_culture',       label: 'ID' },
    { key: 'nom',              label: 'Culture' },
    { key: 'variete',          label: 'Variété' },
    { key: 'parcelle_nom',     label: 'Parcelle' },
    { key: 'date_semis',       label: 'Semis',   render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
    { key: 'date_recolte_prevue', label: 'Récolte', render: v => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
    { key: 'statut',           label: 'Statut',  render: v => <Badge level={v}/> },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>🌱 Cultures</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={load} variant="ghost">↻ Rafraîchir</Btn>
          <Btn onClick={openCreate}>+ Nouvelle culture</Btn>
        </div>
      </div>

      <Alert msg={error}   type="error"   onClose={() => setError(null)}/>
      <Alert msg={success} type="success" onClose={() => setSuccess(null)}/>

      {showForm && (
        <Card title={editId ? `Modifier la culture #${editId}` : 'Nouvelle culture'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Nom"><Input value={form.nom} onChange={e => set('nom', e.target.value)}/></Field>
            <Field label="Variété"><Input value={form.variete} onChange={e => set('variete', e.target.value)} placeholder="Optionnel"/></Field>
            <Field label="Date semis"><Input type="date" value={form.date_semis} onChange={e => set('date_semis', e.target.value)}/></Field>
            <Field label="Date récolte prévue"><Input type="date" value={form.date_recolte_prevue} onChange={e => set('date_recolte_prevue', e.target.value)}/></Field>
            <Field label="Statut">
              <Select value={form.statut} onChange={e => set('statut', e.target.value)}>
                <option>en cours</option>
                <option>terminé</option>
                <option>attention</option>
                <option>problème</option>
              </Select>
            </Field>
            <Field label="ID Parcelle"><Input type="number" value={form.id_parcelle} onChange={e => set('id_parcelle', e.target.value)}/></Field>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Btn onClick={submit}>{editId ? 'Enregistrer' : 'Créer'}</Btn>
            <Btn onClick={() => setShowForm(false)} variant="ghost">Annuler</Btn>
          </div>
        </Card>
      )}

      <Card title={`${rows.length} culture(s)`}>
        {loading ? <Spinner/> : (
          <Table
            columns={columns}
            rows={rows}
            onAction={row => (
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn small onClick={() => openEdit(row)} variant="ghost">Éditer</Btn>
                <Btn small onClick={() => del(row.id_culture)} variant="danger">Suppr.</Btn>
              </div>
            )}
          />
        )}
      </Card>
    </>
  )
}
