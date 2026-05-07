import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Plus, RefreshCw, Pencil, Trash2, MapPin, Layers, Calendar, Hash, Sprout } from 'lucide-react';
import { api } from '../api';
import type { ParcelleBDD } from '../api';
import { Btn, Field, Input, AlertBanner, Modal, Skeleton } from '../components/Layout';

const EMPTY: Partial<ParcelleBDD> = { nom: '', surface: 0, latitude: 0, longitude: 0, description: '', id_utilisateur: 1 };

const COL_HEADERS = [
    { label: 'ID',       icon: <Hash size={11} />       },
    { label: 'Parcelle', icon: <Map size={11} />         },
    { label: 'Surface',  icon: <Layers size={11} />      },
    { label: 'Latitude', icon: <MapPin size={11} />      },
    { label: 'Longitude',icon: <MapPin size={11} />      },
    { label: 'Cultures', icon: <Sprout size={11} />      },
    { label: 'Créée le', icon: <Calendar size={11} />    },
    { label: '',         icon: null                      },
];

export const Parcelles = () => {
    const [rows, setRows]         = useState<ParcelleBDD[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [success, setSuccess]   = useState<string | null>(null);
    const [form, setForm]         = useState<Partial<ParcelleBDD>>(EMPTY);
    const [editId, setEditId]     = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const load = () => {
        setLoading(true);
        api.parcelles.getAll()
            .then(setRows)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const set = (k: keyof ParcelleBDD, v: unknown) => setForm(f => ({ ...f, [k]: v }));
    const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
    const openEdit = (p: ParcelleBDD) => {
        setForm({ nom: p.nom, surface: p.surface, latitude: p.latitude, longitude: p.longitude, description: p.description ?? '', id_utilisateur: p.id_utilisateur });
        setEditId(p.id_parcelle);
        setShowForm(true);
    };

    const submit = async () => {
        const body = { ...form, surface: Number(form.surface), latitude: Number(form.latitude), longitude: Number(form.longitude) };
        try {
            if (editId) {
                await api.parcelles.update(editId, body);
                setSuccess('Parcelle modifiée avec succès.');
            } else {
                await api.parcelles.create(body);
                setSuccess('Parcelle créée avec succès.');
            }
            setShowForm(false);
            load();
        } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    const del = async (id: number) => {
        if (!confirm(`Supprimer la parcelle #${id} ?`)) return;
        try { await api.parcelles.delete(id); setSuccess('Parcelle supprimée.'); load(); }
        catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    const culturesCount = (r: ParcelleBDD) => r.cultures?.length ?? 0;

    return (
        <div
            className="flex-1 overflow-auto flex flex-col gap-6"
            style={{ padding: '28px 32px', background: 'var(--bg-primary)' }}
        >
            {/* ── Page header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    {/* Icon badge */}
                    <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                            width: 48, height: 48,
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, #059669) 100%)',
                            boxShadow: '0 4px 14px color-mix(in srgb, var(--accent) 30%, transparent)',
                        }}
                    >
                        <Map size={22} color="white" strokeWidth={1.8} />
                    </div>
                    <div>
                        <h1
                            className="font-bold tracking-tight leading-none"
                            style={{ fontSize: 22, color: 'var(--text-primary)' }}
                        >
                            Parcelles
                        </h1>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 5 }}>
                            {loading ? 'Chargement…' : `${rows.length} parcelle${rows.length !== 1 ? 's' : ''} enregistrée${rows.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Btn onClick={load} variant="ghost">
                        <RefreshCw size={13} />
                        Rafraîchir
                    </Btn>
                    <Btn onClick={openCreate}>
                        <Plus size={14} strokeWidth={2.5} />
                        Nouvelle parcelle
                    </Btn>
                </div>
            </div>

            {/* ── Alerts ── */}
            <AnimatePresence>
                {error && (
                    <motion.div key="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                        <AlertBanner msg={error} type="error" onClose={() => setError(null)} />
                    </motion.div>
                )}
                {success && (
                    <motion.div key="ok" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                        <AlertBanner msg={success} type="success" onClose={() => setSuccess(null)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Table card ── */}
            <div
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-md)',
                    overflow: 'hidden',
                }}
            >
                {/* Card top bar */}
                <div
                    className="flex items-center justify-between"
                    style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: 'var(--bg-elevated)',
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <Map size={14} style={{ color: 'var(--accent)' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            Liste des parcelles
                        </span>
                    </div>
                    {!loading && rows.length > 0 && (
                        <span
                            className="flex items-center justify-center"
                            style={{
                                height: 22, padding: '0 9px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--accent-muted)',
                                fontSize: 11.5, fontWeight: 700,
                                color: 'var(--accent)',
                            }}
                        >
                            {rows.length}
                        </span>
                    )}
                </div>

                {/* ── Loading ── */}
                {loading ? (
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="w-7 h-7 rounded-lg" />
                                <Skeleton className="w-36 h-4" />
                                <Skeleton className="w-16 h-4" />
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-20 h-4" />
                            </div>
                        ))}
                    </div>

                /* ── Empty state ── */
                ) : rows.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center justify-center text-center"
                        style={{ padding: '64px 24px' }}
                    >
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: 64, height: 64, marginBottom: 20,
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--bg-inset)',
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            <Map size={28} style={{ color: 'var(--text-muted)' }} strokeWidth={1.4} />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                            Aucune parcelle enregistrée
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 280 }}>
                            Ajoutez votre première parcelle pour commencer à gérer vos cultures et observations.
                        </p>
                        <Btn onClick={openCreate}>
                            <Plus size={14} strokeWidth={2.5} />
                            Nouvelle parcelle
                        </Btn>
                    </motion.div>

                /* ── Table ── */
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-inset)' }}>
                                    {COL_HEADERS.map(({ label, icon }) => (
                                        <th
                                            key={label}
                                            style={{
                                                padding: '10px 16px',
                                                textAlign: 'left',
                                                fontSize: 10.5,
                                                fontWeight: 700,
                                                letterSpacing: '0.07em',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-muted)',
                                                borderBottom: '1px solid var(--border-subtle)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {label && (
                                                <span className="flex items-center gap-1.5">
                                                    <span style={{ opacity: 0.7 }}>{icon}</span>
                                                    {label}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <motion.tr
                                        key={r.id_parcelle}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04, duration: 0.28, ease: 'easeOut' }}
                                        className="group"
                                        style={{
                                            borderBottom: '1px solid var(--border-subtle)',
                                            cursor: 'default',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* ID */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    fontFamily: 'monospace',
                                                    color: 'var(--text-muted)',
                                                    background: 'var(--bg-inset)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '2px 7px',
                                                }}
                                            >
                                                #{r.id_parcelle}
                                            </span>
                                        </td>

                                        {/* Nom */}
                                        <td style={{ padding: '13px 16px', minWidth: 160 }}>
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className="flex items-center justify-center shrink-0"
                                                    style={{
                                                        width: 30, height: 30,
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'var(--accent-muted)',
                                                        border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                                                    }}
                                                >
                                                    <Map size={13} style={{ color: 'var(--accent)' }} strokeWidth={1.8} />
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {r.nom}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Surface */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {r.surface}
                                            </span>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 3 }}>ha</span>
                                        </td>

                                        {/* Latitude */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontFamily: 'monospace',
                                                    color: 'var(--text-secondary)',
                                                }}
                                            >
                                                {Number(r.latitude).toFixed(4)}
                                            </span>
                                        </td>

                                        {/* Longitude */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontFamily: 'monospace',
                                                    color: 'var(--text-secondary)',
                                                }}
                                            >
                                                {Number(r.longitude).toFixed(4)}
                                            </span>
                                        </td>

                                        {/* Cultures count */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span
                                                className="flex items-center gap-1.5"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    padding: '3px 9px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: culturesCount(r) > 0 ? 'var(--accent-muted)' : 'var(--bg-inset)',
                                                    border: `1px solid ${culturesCount(r) > 0 ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'var(--border-subtle)'}`,
                                                    fontSize: 11.5,
                                                    fontWeight: 700,
                                                    color: culturesCount(r) > 0 ? 'var(--accent)' : 'var(--text-muted)',
                                                }}
                                            >
                                                <Sprout size={10} strokeWidth={2} />
                                                {culturesCount(r)} culture{culturesCount(r) !== 1 ? 's' : ''}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                {r.date_creation
                                                    ? new Date(r.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                                                    : '—'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                                            <div
                                                className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
                                                style={{ transition: 'opacity 0.15s ease' }}
                                            >
                                                <button
                                                    onClick={() => openEdit(r)}
                                                    title="Modifier"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        width: 30, height: 30,
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--border)',
                                                        background: 'var(--bg-surface)',
                                                        color: 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
                                                    }}
                                                    onMouseEnter={e => {
                                                        const el = e.currentTarget as HTMLButtonElement;
                                                        el.style.background = 'var(--accent-muted)';
                                                        el.style.borderColor = 'color-mix(in srgb, var(--accent) 30%, transparent)';
                                                        el.style.color = 'var(--accent)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        const el = e.currentTarget as HTMLButtonElement;
                                                        el.style.background = 'var(--bg-surface)';
                                                        el.style.borderColor = 'var(--border)';
                                                        el.style.color = 'var(--text-secondary)';
                                                    }}
                                                >
                                                    <Pencil size={13} strokeWidth={1.8} />
                                                </button>
                                                <button
                                                    onClick={() => del(r.id_parcelle)}
                                                    title="Supprimer"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        width: 30, height: 30,
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--border)',
                                                        background: 'var(--bg-surface)',
                                                        color: 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
                                                    }}
                                                    onMouseEnter={e => {
                                                        const el = e.currentTarget as HTMLButtonElement;
                                                        el.style.background = 'var(--danger-soft)';
                                                        el.style.borderColor = 'color-mix(in srgb, var(--danger) 25%, transparent)';
                                                        el.style.color = 'var(--danger)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        const el = e.currentTarget as HTMLButtonElement;
                                                        el.style.background = 'var(--bg-surface)';
                                                        el.style.borderColor = 'var(--border)';
                                                        el.style.color = 'var(--text-secondary)';
                                                    }}
                                                >
                                                    <Trash2 size={13} strokeWidth={1.8} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            <Modal
                open={showForm}
                onClose={() => setShowForm(false)}
                title={editId ? `Modifier la parcelle #${editId}` : 'Nouvelle parcelle'}
            >
                {/* Modal body */}
                <div style={{ padding: '24px 24px 8px' }}>
                    {/* Section: Identité */}
                    <div style={{ marginBottom: 20 }}>
                        <p
                            style={{
                                fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
                                textTransform: 'uppercase', color: 'var(--text-muted)',
                                marginBottom: 12,
                            }}
                        >
                            Informations générales
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <Field label="Nom de la parcelle">
                                    <Input
                                        value={String(form.nom ?? '')}
                                        onChange={e => set('nom', e.target.value)}
                                        placeholder="Ex : Champ Nord, Parcelle A…"
                                    />
                                </Field>
                            </div>
                            <Field label="Surface (ha)">
                                <Input
                                    type="number"
                                    value={String(form.surface ?? '')}
                                    onChange={e => set('surface', e.target.value)}
                                    step="0.1"
                                    placeholder="0.00"
                                />
                            </Field>
                            <Field label="Description (optionnel)">
                                <Input
                                    value={String(form.description ?? '')}
                                    onChange={e => set('description', e.target.value)}
                                    placeholder="Informations complémentaires…"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

                    {/* Section: Coordonnées */}
                    <div style={{ marginBottom: 8 }}>
                        <p
                            style={{
                                fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
                                textTransform: 'uppercase', color: 'var(--text-muted)',
                                marginBottom: 12,
                            }}
                        >
                            Coordonnées GPS
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Latitude">
                                <Input
                                    type="number"
                                    value={String(form.latitude ?? '')}
                                    onChange={e => set('latitude', e.target.value)}
                                    step="0.0001"
                                    placeholder="48.8566"
                                />
                            </Field>
                            <Field label="Longitude">
                                <Input
                                    type="number"
                                    value={String(form.longitude ?? '')}
                                    onChange={e => set('longitude', e.target.value)}
                                    step="0.0001"
                                    placeholder="2.3522"
                                />
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Modal footer */}
                <div
                    className="flex items-center justify-end gap-2"
                    style={{
                        padding: '14px 24px',
                        borderTop: '1px solid var(--border-subtle)',
                        background: 'var(--bg-elevated)',
                    }}
                >
                    <Btn onClick={() => setShowForm(false)} variant="ghost">
                        Annuler
                    </Btn>
                    <Btn onClick={submit}>
                        {editId ? (
                            <>
                                <Pencil size={13} strokeWidth={2} />
                                Enregistrer les modifications
                            </>
                        ) : (
                            <>
                                <Plus size={14} strokeWidth={2.5} />
                                Créer la parcelle
                            </>
                        )}
                    </Btn>
                </div>
            </Modal>
        </div>
    );
};
