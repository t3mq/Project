import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Plus, RefreshCw, Pencil, Trash2, Filter, Palette, ChevronDown, Sprout, Calendar, Tag } from 'lucide-react';
import { api } from '../api';
import type { CultureBDD, ParcelleBDD, TypeCultureBDD } from '../api';
import { Btn, Badge, Field, Input, Select, AlertBanner, Modal, Skeleton } from '../components/Layout';

// ── Constants ────────────────────────────────────────────────────────────────

const CULTURE_EMPTY: Partial<CultureBDD> = {
    nom: '', variete: '', date_semis: '', date_recolte_prevue: '',
    statut: 'en cours', id_parcelle: undefined, id_type_culture: null,
};
const TYPE_EMPTY: Partial<TypeCultureBDD> = { nom: '', description: '', couleur: '#16A34A' };

const PRESET_COLORS = [
    '#16A34A', '#059669', '#0891B2', '#7C3AED', '#DC2626',
    '#EA580C', '#CA8A04', '#DB2777', '#0284C7', '#65A30D',
];

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

// ── Sub-components ───────────────────────────────────────────────────────────

const TypeChip = ({
    t, onEdit, onDelete,
}: { t: TypeCultureBDD; onEdit: () => void; onDelete: () => void }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-md)] border text-[12.5px] font-semibold overflow-hidden"
        style={{
            background: `${t.couleur}0f`,
            borderColor: `${t.couleur}28`,
            color: 'var(--text-primary)',
        }}
    >
        {/* Color accent left bar */}
        <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
            style={{ background: t.couleur }}
        />
        <div
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{ background: t.couleur, boxShadow: `0 0 0 2px ${t.couleur}28` }}
        />
        <span className="font-semibold text-[var(--text-primary)]">{t.nom}</span>
        {t.description && (
            <span className="text-[11px] text-[var(--text-muted)] font-normal leading-none">
                {t.description}
            </span>
        )}
        {/* Hover actions */}
        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
            <button
                onClick={onEdit}
                className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer border-none bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
                <Pencil size={11} />
            </button>
            <button
                onClick={onDelete}
                className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer border-none bg-transparent text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
            >
                <Trash2 size={11} />
            </button>
        </div>
    </motion.div>
);

const CultureTypeBadge = ({ nom, couleur }: { nom: string; couleur?: string }) => {
    const c = couleur ?? 'var(--accent)';
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-[var(--radius-sm)] border text-[11px] font-semibold whitespace-nowrap"
            style={{
                background: `${c}12`,
                borderColor: `${c}2a`,
                color: c,
            }}
        >
            <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: c }} />
            {nom}
        </span>
    );
};

const EmptyState = ({ onNew }: { onNew: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center py-20 px-6 text-center"
    >
        <div
            className="w-16 h-16 rounded-[var(--radius-xl)] flex items-center justify-center mb-5 relative"
            style={{ background: 'var(--accent-muted)', border: '1px solid var(--border)' }}
        >
            <Sprout size={28} strokeWidth={1.4} style={{ color: 'var(--accent)' }} />
            <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-surface)]"
                style={{ background: 'var(--accent)' }}
            >
                <Plus size={10} strokeWidth={2.8} className="text-white" />
            </div>
        </div>
        <div className="text-[15px] font-bold text-[var(--text-primary)] mb-1.5 tracking-[-0.02em]">
            Aucune culture enregistrée
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mb-6 max-w-[280px] leading-relaxed">
            Commencez par ajouter votre première culture pour suivre votre production.
        </div>
        <Btn onClick={onNew}>
            <Plus size={13} strokeWidth={2.2} />
            Nouvelle culture
        </Btn>
    </motion.div>
);

const LoadingRows = () => (
    <div className="p-5 flex flex-col gap-3">
        {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 py-1">
                <Skeleton className="w-8 h-8 rounded-[var(--radius-md)] shrink-0" />
                <Skeleton className="w-36 h-4" />
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-20 h-4 ml-auto" />
            </div>
        ))}
    </div>
);

// ── Main component ───────────────────────────────────────────────────────────

export const Cultures = () => {
    const [rows, setRows]           = useState<CultureBDD[]>([]);
    const [parcelles, setParcelles] = useState<ParcelleBDD[]>([]);
    const [types, setTypes]         = useState<TypeCultureBDD[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [success, setSuccess]     = useState<string | null>(null);

    const [form, setForm]           = useState<Partial<CultureBDD>>(CULTURE_EMPTY);
    const [editId, setEditId]       = useState<number | null>(null);
    const [showForm, setShowForm]   = useState(false);

    const [typeForm, setTypeForm]             = useState<Partial<TypeCultureBDD>>(TYPE_EMPTY);
    const [typeEditId, setTypeEditId]         = useState<number | null>(null);
    const [showTypeForm, setShowTypeForm]     = useState(false);
    const [showTypesPanel, setShowTypesPanel] = useState(false);

    // ── Data ────────────────────────────────────────────────────────────────

    const load = () => {
        setLoading(true);
        Promise.all([api.cultures.getAll(), api.parcelles.getAll(), api.typeCultures.getAll()])
            .then(([c, p, t]) => { setRows(c); setParcelles(p); setTypes(t); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    // ── Culture form ─────────────────────────────────────────────────────────

    const set = (k: keyof CultureBDD, v: unknown) => setForm(f => ({ ...f, [k]: v }));
    const setT = (k: keyof TypeCultureBDD, v: unknown) => setTypeForm(f => ({ ...f, [k]: v }));

    const openCreate = () => { setForm(CULTURE_EMPTY); setEditId(null); setShowForm(true); };
    const openEdit = (c: CultureBDD) => {
        setForm({
            nom: c.nom,
            variete: c.variete ?? '',
            statut: c.statut,
            id_parcelle: c.id_parcelle,
            id_type_culture: c.id_type_culture,
            date_semis: c.date_semis?.slice(0, 10) ?? '',
            date_recolte_prevue: c.date_recolte_prevue?.slice(0, 10) ?? '',
        });
        setEditId(c.id_culture);
        setShowForm(true);
    };

    const submit = async () => {
        const body: Partial<CultureBDD> = {
            ...form,
            id_parcelle: Number(form.id_parcelle),
            id_type_culture: form.id_type_culture ? Number(form.id_type_culture) : null,
            variete: form.variete || null,
            date_recolte_prevue: form.date_recolte_prevue || null,
        };
        try {
            if (editId) { await api.cultures.update(editId, body); setSuccess('Culture modifiée avec succès.'); }
            else        { await api.cultures.create(body);          setSuccess('Culture créée avec succès.');   }
            setShowForm(false);
            load();
        } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    const del = async (id: number) => {
        if (!confirm(`Supprimer la culture #${id} ?`)) return;
        try { await api.cultures.delete(id); setSuccess('Culture supprimée.'); load(); }
        catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    // ── Type form ────────────────────────────────────────────────────────────

    const openTypeCreate = () => { setTypeForm(TYPE_EMPTY); setTypeEditId(null); setShowTypeForm(true); };
    const openTypeEdit = (t: TypeCultureBDD) => {
        setTypeForm({ nom: t.nom, description: t.description ?? '', couleur: t.couleur });
        setTypeEditId(t.id_type_culture);
        setShowTypeForm(true);
    };

    const submitType = async () => {
        try {
            if (typeEditId) { await api.typeCultures.update(typeEditId, typeForm); setSuccess('Type modifié.'); }
            else            { await api.typeCultures.create(typeForm);              setSuccess('Type créé.');   }
            setShowTypeForm(false);
            const t = await api.typeCultures.getAll();
            setTypes(t);
        } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    const delType = async (id: number) => {
        if (!confirm('Supprimer ce type ?')) return;
        try {
            await api.typeCultures.delete(id);
            setSuccess('Type supprimé.');
            const t = await api.typeCultures.getAll();
            setTypes(t);
        } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex-1 overflow-auto flex flex-col gap-5 p-5 min-h-0">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                            boxShadow: '0 2px 10px var(--accent)/30',
                        }}
                    >
                        <Leaf size={18} strokeWidth={2} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-[20px] font-bold text-[var(--text-primary)] tracking-[-0.03em] leading-none">
                            Cultures
                        </h1>
                        <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-none">
                            <span className="font-semibold text-[var(--text-secondary)]">{rows.length}</span>
                            {' '}culture{rows.length !== 1 ? 's' : ''}
                            <span className="mx-1.5 opacity-30">·</span>
                            <span className="font-semibold text-[var(--text-secondary)]">{types.length}</span>
                            {' '}type{types.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Btn
                        onClick={() => setShowTypesPanel(v => !v)}
                        variant="ghost"
                        className={showTypesPanel ? 'border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent-muted)]' : ''}
                    >
                        <Filter size={13} />
                        Types
                        <ChevronDown
                            size={12}
                            style={{ transform: showTypesPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        />
                    </Btn>
                    <Btn onClick={load} variant="ghost">
                        <RefreshCw size={13} />
                        Rafraîchir
                    </Btn>
                    <Btn onClick={openCreate}>
                        <Plus size={13} strokeWidth={2.2} />
                        Nouvelle culture
                    </Btn>
                </div>
            </div>

            {/* ── Alerts ── */}
            <AlertBanner msg={error}   type="error"   onClose={() => setError(null)} />
            <AlertBanner msg={success} type="success" onClose={() => setSuccess(null)} />

            {/* ── Types panel ── */}
            <AnimatePresence>
                {showTypesPanel && (
                    <motion.div
                        key="types-panel"
                        initial={{ opacity: 0, height: 0, marginTop: -8 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: -8 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden"
                            style={{ boxShadow: 'var(--shadow-sm)' }}
                        >
                            {/* Panel header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)]">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center"
                                        style={{ background: 'var(--accent-muted)' }}
                                    >
                                        <Tag size={12} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
                                        Types de culture
                                    </span>
                                    <span
                                        className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                        style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}
                                    >
                                        {types.length}
                                    </span>
                                </div>
                                <Btn small onClick={openTypeCreate}>
                                    <Plus size={11} strokeWidth={2.4} />
                                    Nouveau type
                                </Btn>
                            </div>

                            {/* Panel body */}
                            <div className="p-4">
                                {types.length === 0 ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <Palette size={22} strokeWidth={1.3} className="mb-2.5" style={{ color: 'var(--text-muted)' }} />
                                        <p className="text-[12.5px] text-[var(--text-muted)]">Aucun type défini.</p>
                                        <p className="text-[11.5px] text-[var(--text-muted)] opacity-60 mt-0.5">
                                            Créez des types pour organiser vos cultures.
                                        </p>
                                    </div>
                                ) : (
                                    <motion.div layout className="flex flex-wrap gap-2">
                                        <AnimatePresence mode="popLayout">
                                            {types.map(t => (
                                                <TypeChip
                                                    key={t.id_type_culture}
                                                    t={t}
                                                    onEdit={() => openTypeEdit(t)}
                                                    onDelete={() => delType(t.id_type_culture)}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Cultures table ── */}
            <div
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden flex-1 min-h-0 flex flex-col"
                style={{ boxShadow: 'var(--shadow-sm)' }}
            >
                {/* Table header bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
                            Toutes les cultures
                        </span>
                        {!loading && rows.length > 0 && (
                            <span
                                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}
                            >
                                {rows.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                {loading ? (
                    <LoadingRows />
                ) : rows.length === 0 ? (
                    <EmptyState onNew={openCreate} />
                ) : (
                    <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr style={{ background: 'var(--bg-secondary)' }}>
                                    {[
                                        { label: 'Culture',        w: '' },
                                        { label: 'Type',           w: 'w-[130px]' },
                                        { label: 'Variété',        w: 'w-[120px]' },
                                        { label: 'Parcelle',       w: 'w-[120px]' },
                                        { label: 'Semis',          w: 'w-[110px]' },
                                        { label: 'Récolte prévue', w: 'w-[120px]' },
                                        { label: 'Statut',         w: 'w-[100px]' },
                                        { label: '',               w: 'w-[90px]' },
                                    ].map(({ label, w }) => (
                                        <th
                                            key={label}
                                            className={`text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.09em] whitespace-nowrap border-b border-[var(--border-subtle)] ${w}`}
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <motion.tr
                                        key={r.id_culture}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.035, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="group border-b border-[var(--border-subtle)] last:border-b-0 transition-colors duration-100"
                                        style={{ background: 'transparent' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Culture name */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: r.type_culture_couleur
                                                            ? `${r.type_culture_couleur}18`
                                                            : 'var(--accent-muted)',
                                                        border: `1px solid ${r.type_culture_couleur ? `${r.type_culture_couleur}28` : 'var(--border)'}`,
                                                    }}
                                                >
                                                    <Leaf
                                                        size={14}
                                                        strokeWidth={1.8}
                                                        style={{ color: r.type_culture_couleur ?? 'var(--accent)' }}
                                                    />
                                                </div>
                                                <span className="text-[13px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
                                                    {r.nom}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3">
                                            {r.type_culture_nom
                                                ? <CultureTypeBadge nom={r.type_culture_nom} couleur={r.type_culture_couleur} />
                                                : <span className="text-[12px] text-[var(--text-muted)] opacity-40">—</span>
                                            }
                                        </td>

                                        {/* Variete */}
                                        <td className="px-4 py-3">
                                            {r.variete
                                                ? <span className="text-[12.5px] text-[var(--text-secondary)]">{r.variete}</span>
                                                : <span className="text-[12px] text-[var(--text-muted)] opacity-40">—</span>
                                            }
                                        </td>

                                        {/* Parcelle */}
                                        <td className="px-4 py-3">
                                            <span className="text-[12.5px] font-medium text-[var(--text-secondary)]">
                                                {r.parcelle_nom ?? `Parcelle #${r.id_parcelle}`}
                                            </span>
                                        </td>

                                        {/* Semis */}
                                        <td className="px-4 py-3">
                                            {fmtDate(r.date_semis)
                                                ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={11} style={{ color: 'var(--text-muted)' }} />
                                                        <span className="text-[12px] text-[var(--text-secondary)] whitespace-nowrap">
                                                            {fmtDate(r.date_semis)}
                                                        </span>
                                                    </div>
                                                )
                                                : <span className="text-[12px] text-[var(--text-muted)] opacity-40">—</span>
                                            }
                                        </td>

                                        {/* Recolte */}
                                        <td className="px-4 py-3">
                                            {fmtDate(r.date_recolte_prevue)
                                                ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={11} style={{ color: 'var(--text-muted)' }} />
                                                        <span className="text-[12px] text-[var(--text-secondary)] whitespace-nowrap">
                                                            {fmtDate(r.date_recolte_prevue)}
                                                        </span>
                                                    </div>
                                                )
                                                : <span className="text-[12px] text-[var(--text-muted)] opacity-40">—</span>
                                            }
                                        </td>

                                        {/* Statut */}
                                        <td className="px-4 py-3">
                                            <Badge level={r.statut} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <button
                                                    onClick={() => openEdit(r)}
                                                    className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer border border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-focus)] transition-all duration-150"
                                                    title="Modifier"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    onClick={() => del(r.id_culture)}
                                                    className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer border border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:border-red-200/60 transition-all duration-150"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={12} />
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

            {/* ── Culture modal ── */}
            <Modal
                open={showForm}
                onClose={() => setShowForm(false)}
                title={editId ? `Modifier la culture` : 'Nouvelle culture'}
                maxWidth={560}
            >
                <div className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Nom de la culture">
                            <Input
                                value={String(form.nom ?? '')}
                                onChange={e => set('nom', e.target.value)}
                                placeholder="Ex: Blé d'hiver"
                                autoFocus
                            />
                        </Field>
                        <Field label="Variété">
                            <Input
                                value={String(form.variete ?? '')}
                                onChange={e => set('variete', e.target.value)}
                                placeholder="Optionnel"
                            />
                        </Field>

                        <div className="col-span-2">
                            <Field label="Type de culture">
                                <div className="flex gap-2">
                                    <Select
                                        value={String(form.id_type_culture ?? '')}
                                        onChange={e => set('id_type_culture', e.target.value || null)}
                                        className="flex-1"
                                    >
                                        <option value="">— Aucun type —</option>
                                        {types.map(t => (
                                            <option key={t.id_type_culture} value={t.id_type_culture}>{t.nom}</option>
                                        ))}
                                    </Select>
                                    <button
                                        onClick={() => { setTypeForm(TYPE_EMPTY); setTypeEditId(null); setShowTypeForm(true); }}
                                        className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border)] flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0"
                                        style={{ background: 'var(--bg-inset)', color: 'var(--accent)' }}
                                        title="Créer un nouveau type"
                                    >
                                        <Plus size={16} strokeWidth={2.2} />
                                    </button>
                                </div>
                            </Field>
                        </div>

                        <Field label="Date de semis">
                            <Input
                                type="date"
                                value={String(form.date_semis ?? '')}
                                onChange={e => set('date_semis', e.target.value)}
                            />
                        </Field>
                        <Field label="Date récolte prévue">
                            <Input
                                type="date"
                                value={String(form.date_recolte_prevue ?? '')}
                                onChange={e => set('date_recolte_prevue', e.target.value)}
                            />
                        </Field>

                        <Field label="Statut">
                            <Select
                                value={String(form.statut ?? 'en cours')}
                                onChange={e => set('statut', e.target.value)}
                            >
                                <option value="en cours">En cours</option>
                                <option value="terminé">Terminé</option>
                                <option value="attention">Attention</option>
                                <option value="problème">Problème</option>
                            </Select>
                        </Field>
                        <Field label="Parcelle">
                            <Select
                                value={String(form.id_parcelle ?? '')}
                                onChange={e => set('id_parcelle', e.target.value)}
                            >
                                <option value="">Sélectionner une parcelle…</option>
                                {parcelles.map(p => (
                                    <option key={p.id_parcelle} value={p.id_parcelle}>{p.nom}</option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                </div>
                <div
                    className="flex gap-3 justify-end px-6 py-4 border-t border-[var(--border-subtle)]"
                    style={{ background: 'var(--bg-secondary)' }}
                >
                    <Btn onClick={() => setShowForm(false)} variant="ghost">Annuler</Btn>
                    <Btn onClick={submit}>{editId ? 'Enregistrer les modifications' : 'Créer la culture'}</Btn>
                </div>
            </Modal>

            {/* ── Type modal ── */}
            <Modal
                open={showTypeForm}
                onClose={() => setShowTypeForm(false)}
                title={typeEditId ? 'Modifier le type' : 'Nouveau type de culture'}
                maxWidth={420}
            >
                <div className="p-6 flex flex-col gap-4">
                    <Field label="Nom du type">
                        <Input
                            value={String(typeForm.nom ?? '')}
                            onChange={e => setT('nom', e.target.value)}
                            placeholder="Ex: Céréales, Légumineuses…"
                            autoFocus
                        />
                    </Field>
                    <Field label="Description">
                        <Input
                            value={String(typeForm.description ?? '')}
                            onChange={e => setT('description', e.target.value)}
                            placeholder="Optionnel"
                        />
                    </Field>
                    <Field label="Couleur d'identification">
                        <div className="flex flex-col gap-3">
                            {/* Preset swatches */}
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setT('couleur', c)}
                                        className="w-7 h-7 rounded-[var(--radius-sm)] cursor-pointer border-2 transition-all duration-150 shrink-0"
                                        style={{
                                            background: c,
                                            borderColor: typeForm.couleur === c ? 'var(--border-focus)' : 'transparent',
                                            boxShadow: typeForm.couleur === c ? `0 0 0 3px ${c}35` : 'none',
                                            transform: typeForm.couleur === c ? 'scale(1.15)' : 'scale(1)',
                                        }}
                                        title={c}
                                    />
                                ))}
                            </div>
                            {/* Custom picker row */}
                            <div
                                className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--border)]"
                                style={{ background: 'var(--bg-inset)' }}
                            >
                                <div className="relative">
                                    <div
                                        className="w-9 h-9 rounded-[var(--radius-sm)] border-2 border-white/30 shadow-md cursor-pointer overflow-hidden"
                                        style={{ background: String(typeForm.couleur ?? '#16A34A') }}
                                    >
                                        <input
                                            type="color"
                                            value={String(typeForm.couleur ?? '#16A34A')}
                                            onChange={e => setT('couleur', e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Personnalisé</span>
                                    <span className="text-[12.5px] font-mono font-semibold text-[var(--text-secondary)]">
                                        {typeForm.couleur}
                                    </span>
                                </div>
                                <div
                                    className="ml-auto w-8 h-8 rounded-full border-[3px] border-[var(--bg-surface)] shadow-md shrink-0"
                                    style={{ background: String(typeForm.couleur ?? '#16A34A') }}
                                />
                            </div>
                        </div>
                    </Field>
                </div>
                <div
                    className="flex gap-3 justify-end px-6 py-4 border-t border-[var(--border-subtle)]"
                    style={{ background: 'var(--bg-secondary)' }}
                >
                    <Btn onClick={() => setShowTypeForm(false)} variant="ghost">Annuler</Btn>
                    <Btn onClick={submitType}>{typeEditId ? 'Enregistrer' : 'Créer le type'}</Btn>
                </div>
            </Modal>
        </div>
    );
};
