import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Sun, FileText, Bell, RefreshCw, Zap,
    CheckCircle2, Leaf, Clock, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { api } from '../api';
import type { AlerteBDD } from '../api';
import { useAuth } from '../context/AuthContext';
import { Btn, Badge, AlertBanner, Skeleton } from '../components/Layout';

// ── Level config ────────────────────────────────────────────────────────────
const LEVEL_CFG = {
    critique: {
        Icon: AlertTriangle,
        accentColor: 'var(--danger)',
        accentBg: 'var(--danger-soft)',
        accentBorder: 'rgba(220,38,38,0.18)',
        iconColor: 'var(--danger)',
        labelColor: 'var(--danger-text)',
        barColor: '#DC2626',
    },
    warning: {
        Icon: Sun,
        accentColor: 'var(--warning)',
        accentBg: 'var(--warning-soft)',
        accentBorder: 'rgba(217,119,6,0.18)',
        iconColor: 'var(--warning)',
        labelColor: 'var(--warning-text)',
        barColor: '#D97706',
    },
    info: {
        Icon: FileText,
        accentColor: 'var(--info)',
        accentBg: 'var(--info-soft)',
        accentBorder: 'rgba(37,99,235,0.18)',
        iconColor: 'var(--info)',
        labelColor: 'var(--info-text)',
        barColor: '#2563EB',
    },
} as const;

type NiveauKey = keyof typeof LEVEL_CFG;

function getCfg(niveau: string) {
    return LEVEL_CFG[niveau as NiveauKey] ?? LEVEL_CFG.info;
}

function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

// ── Active alert card ────────────────────────────────────────────────────────
const AlertCard = ({
    a,
    onResolve,
    index,
}: {
    a: AlerteBDD;
    onResolve: (id: number) => void;
    index: number;
}) => {
    const cfg = getCfg(a.niveau);
    const { Icon } = cfg;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ delay: index * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex items-stretch overflow-hidden rounded-[var(--radius-md)] border"
            style={{
                borderColor: cfg.accentBorder,
                backgroundColor: cfg.accentBg,
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            {/* Left accent bar */}
            <div
                className="w-[3px] shrink-0 rounded-l-[var(--radius-md)]"
                style={{ backgroundColor: cfg.barColor }}
            />

            {/* Icon column */}
            <div className="flex items-start pt-4 pl-4 pr-3 shrink-0">
                <div
                    className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        boxShadow: 'var(--shadow-sm)',
                        border: `1px solid ${cfg.accentBorder}`,
                    }}
                >
                    <Icon size={14} strokeWidth={2} color={cfg.barColor} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-4 pr-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-[13px] font-semibold leading-snug mb-1.5"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {a.message}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            {a.culture_nom && (
                                <span
                                    className="inline-flex items-center gap-1 text-[11px] font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    <Leaf size={10} strokeWidth={2} color="var(--text-muted)" />
                                    {a.culture_nom}
                                </span>
                            )}
                            {a.regle_nom && (
                                <span
                                    className="inline-flex items-center gap-1 text-[11px]"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <ChevronRight size={9} strokeWidth={2.5} />
                                    {a.regle_nom}
                                </span>
                            )}
                            <span
                                className="inline-flex items-center gap-1 text-[11px]"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <Clock size={9} strokeWidth={2} />
                                {fmtDate(a.date_alerte)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <Badge level={a.niveau} />
                        <button
                            onClick={() => onResolve(a.id_alerte)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-[11.5px] font-semibold cursor-pointer transition-all duration-200 border active:scale-[0.97]"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.85)',
                                borderColor: 'rgba(255,255,255,0.6)',
                                color: 'var(--text-secondary)',
                                boxShadow: 'var(--shadow-sm)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,1)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.85)';
                            }}
                        >
                            <CheckCircle2 size={11} strokeWidth={2.5} />
                            Résoudre
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({
    icon: Icon,
    title,
    count,
    countVariant = 'neutral',
}: {
    icon: typeof Bell;
    title: string;
    count: number;
    countVariant?: 'danger' | 'neutral';
}) => (
    <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
    >
        <div
            className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
            style={{
                backgroundColor: countVariant === 'danger' ? 'var(--danger-soft)' : 'var(--bg-secondary)',
                border: `1px solid ${countVariant === 'danger' ? 'rgba(220,38,38,0.15)' : 'var(--border-subtle)'}`,
            }}
        >
            <Icon
                size={13}
                strokeWidth={2}
                color={countVariant === 'danger' ? 'var(--danger)' : 'var(--text-muted)'}
            />
        </div>
        <span
            className="text-[13px] font-semibold flex-1"
            style={{ color: 'var(--text-primary)' }}
        >
            {title}
        </span>
        {count > 0 && (
            <span
                className="px-2 py-0.5 rounded-full text-[10.5px] font-bold border"
                style={
                    countVariant === 'danger'
                        ? {
                              backgroundColor: 'var(--danger-soft)',
                              borderColor: 'rgba(220,38,38,0.2)',
                              color: 'var(--danger-text)',
                          }
                        : {
                              backgroundColor: 'var(--bg-inset)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-muted)',
                          }
                }
            >
                {count}
            </span>
        )}
    </div>
);

// ── Skeleton rows ────────────────────────────────────────────────────────────
const CardSkeletons = () => (
    <div className="flex flex-col gap-2.5 p-4">
        {[0, 1].map(i => (
            <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-[var(--radius-md)]"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
                <Skeleton className="w-8 h-8 rounded-[var(--radius-sm)] shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-3.5 w-2/3 rounded-[var(--radius-sm)]" />
                    <Skeleton className="h-2.5 w-1/3 rounded-[var(--radius-sm)]" />
                </div>
                <Skeleton className="h-7 w-20 rounded-[var(--radius-sm)] shrink-0" />
            </div>
        ))}
    </div>
);

const TableSkeletons = () => (
    <div className="flex flex-col gap-0 p-4">
        {[0, 1, 2].map(i => (
            <div
                key={i}
                className="flex items-center gap-4 py-3 border-b last:border-0"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <Skeleton className="h-3 w-1/3 rounded-[var(--radius-sm)]" />
                <Skeleton className="h-5 w-14 rounded-full shrink-0" />
                <Skeleton className="h-3 w-20 rounded-[var(--radius-sm)]" />
                <Skeleton className="h-3 w-24 rounded-[var(--radius-sm)]" />
                <Skeleton className="h-3 w-20 rounded-[var(--radius-sm)] ml-auto" />
            </div>
        ))}
    </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
export const Alertes = () => {
    const { refreshAlerts } = useAuth();
    const [rows, setRows]       = useState<AlerteBDD[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

    const load = () => {
        setLoading(true);
        api.alertes.getAll()
            .then(setRows)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const resolve = async (id: number) => {
        try {
            await api.alertes.resolve(id);
            setSuccess(`Alerte #${id} marquée comme résolue.`);
            refreshAlerts();
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const runEngine = async () => {
        setRunning(true);
        try {
            const res = await api.alertes.run();
            setSuccess(`Moteur exécuté — ${res.alertes_creees} alerte(s) créée(s).`);
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setRunning(false);
        }
    };

    const active  = rows.filter(a => a.statut === 'active');
    const resolue = rows.filter(a => a.statut === 'resolue');

    return (
        <div
            className="flex flex-col gap-5 p-5"
            style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100%' }}
        >

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div
                            className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #f87171 0%, #DC2626 100%)',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                            }}
                        >
                            <Bell size={15} strokeWidth={2.2} color="white" />
                        </div>
                        <h1
                            className="text-[22px] font-bold tracking-tight leading-none"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Alertes
                        </h1>
                    </div>
                    <p className="text-[13px] ml-[42px]" style={{ color: 'var(--text-muted)' }}>
                        <span
                            className="font-bold"
                            style={{ color: active.length > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}
                        >
                            {active.length}
                        </span>{' '}
                        active{active.length !== 1 ? 's' : ''}{' '}
                        <span style={{ color: 'var(--border)' }}>·</span>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{resolue.length}</span>{' '}
                        résolue{resolue.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Btn onClick={load} variant="ghost">
                        <RefreshCw size={12} strokeWidth={2.5} />
                        Rafraîchir
                    </Btn>
                    <Btn onClick={runEngine} variant="warning" disabled={running}>
                        <Zap size={12} strokeWidth={2.5} />
                        {running ? 'Exécution…' : 'Déclencher le moteur'}
                    </Btn>
                </div>
            </div>

            {/* ── Banners ───────────────────────────────────────────── */}
            <AnimatePresence>
                {error && (
                    <AlertBanner msg={error} type="error" onClose={() => setError(null)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {success && (
                    <AlertBanner msg={success} type="success" onClose={() => setSuccess(null)} />
                )}
            </AnimatePresence>

            {/* ── Active alerts ─────────────────────────────────────── */}
            <div
                className="rounded-[var(--radius-lg)] border"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <SectionHeader
                    icon={AlertTriangle}
                    title="Alertes actives"
                    count={active.length}
                    countVariant="danger"
                />

                {loading ? (
                    <CardSkeletons />
                ) : active.length === 0 ? (
                    <div className="flex flex-col items-center py-14 px-6 text-center">
                        <div
                            className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-4"
                            style={{
                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                border: '1px solid rgba(16,185,129,0.2)',
                                boxShadow: '0 4px 12px rgba(16,185,129,0.15)',
                            }}
                        >
                            <ShieldCheck size={24} strokeWidth={1.8} color="#059669" />
                        </div>
                        <p
                            className="text-[14px] font-semibold mb-1"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Aucune alerte active
                        </p>
                        <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                            Votre exploitation est sereine pour le moment.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 flex flex-col gap-2.5">
                        <AnimatePresence>
                            {active.map((a, idx) => (
                                <AlertCard
                                    key={a.id_alerte}
                                    a={a}
                                    onResolve={resolve}
                                    index={idx}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── Resolved alerts ───────────────────────────────────── */}
            <div
                className="rounded-[var(--radius-lg)] border"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <SectionHeader
                    icon={CheckCircle2}
                    title="Historique — résolues"
                    count={resolue.length}
                    countVariant="neutral"
                />

                {loading ? (
                    <TableSkeletons />
                ) : resolue.length === 0 ? (
                    <div
                        className="flex items-center justify-center gap-2 py-10 text-[12.5px]"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <Clock size={13} strokeWidth={1.8} />
                        Aucune alerte résolue pour l'instant.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                    {['Message', 'Niveau', 'Culture', 'Règle', 'Date'].map(h => (
                                        <th
                                            key={h}
                                            className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.09em] whitespace-nowrap border-b"
                                            style={{
                                                color: 'var(--text-muted)',
                                                borderColor: 'var(--border-subtle)',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {resolue.map((a, idx) => {
                                    const cfg = getCfg(a.niveau);
                                    const { Icon } = cfg;
                                    return (
                                        <motion.tr
                                            key={a.id_alerte}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03, duration: 0.25 }}
                                            className="border-b last:border-b-0 transition-colors"
                                            style={{ borderColor: 'var(--border-subtle)' }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--bg-secondary)';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            {/* Message */}
                                            <td className="px-4 py-3.5 max-w-[280px]">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                                                        style={{
                                                            backgroundColor: cfg.accentBg,
                                                            border: `1px solid ${cfg.accentBorder}`,
                                                        }}
                                                    >
                                                        <Icon size={11} strokeWidth={2} color={cfg.barColor} />
                                                    </div>
                                                    <span
                                                        className="text-[12.5px] line-clamp-1"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        title={a.message}
                                                    >
                                                        {a.message}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Niveau */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <Badge level={a.niveau} />
                                            </td>

                                            {/* Culture */}
                                            <td className="px-4 py-3.5">
                                                {a.culture_nom ? (
                                                    <span
                                                        className="inline-flex items-center gap-1 text-[12.5px]"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                    >
                                                        <Leaf size={10} strokeWidth={2} color="var(--text-muted)" />
                                                        {a.culture_nom}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }} className="text-[12px]">—</span>
                                                )}
                                            </td>

                                            {/* Regle */}
                                            <td
                                                className="px-4 py-3.5 text-[12px] max-w-[180px]"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                <span className="line-clamp-1" title={a.regle_nom ?? ''}>
                                                    {a.regle_nom ?? '—'}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td
                                                className="px-4 py-3.5 whitespace-nowrap text-[11.5px]"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock size={10} strokeWidth={1.8} />
                                                    {fmtDate(a.date_alerte)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
