import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, CloudRain, Wind, RefreshCw, Cloud, Filter, X, SlidersHorizontal, CalendarDays } from 'lucide-react';
import { api } from '../api';
import type { MeteoBDD } from '../api';
import { Btn, Field, Input, AlertBanner, Card, Skeleton } from '../components/Layout';
import { HumidityChart } from '../components/Charts';

/* ─── helpers ─────────────────────────────────────────────────────── */

const tempColor = (t: number) =>
    t > 30 ? '#EF4444' : t > 25 ? '#F59E0B' : t < 5 ? '#3B82F6' : '#10B981';

const tempBg = (t: number) =>
    t > 30 ? 'rgba(239,68,68,0.10)' : t > 25 ? 'rgba(245,158,11,0.10)' : t < 5 ? 'rgba(59,130,246,0.10)' : 'rgba(16,185,129,0.10)';

const fadeUp = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.07, duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

/* ─── KPI tile ─────────────────────────────────────────────────────── */

interface KpiProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
    accent?: boolean;
    sub?: string;
}

const KpiTile = ({ icon, label, value, unit, accent = false, sub }: KpiProps) => (
    <div
        className="flex-1 min-w-[148px] flex flex-col gap-3 rounded-[var(--radius-lg)] p-5 border transition-all duration-200"
        style={accent ? {
            background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 80%, #000) 100%)',
            borderColor: 'transparent',
            color: '#fff',
            boxShadow: '0 8px 24px -4px color-mix(in srgb, var(--accent) 40%, transparent)',
        } : {
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
        }}
    >
        {/* icon + label row */}
        <div className="flex items-center justify-between">
            <span
                className="text-[10.5px] font-bold uppercase tracking-[0.1em]"
                style={{ color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}
            >
                {label}
            </span>
            <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                style={accent
                    ? { background: 'rgba(255,255,255,0.18)' }
                    : { background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }
                }
            >
                {icon}
            </div>
        </div>

        {/* value */}
        <div className="flex items-baseline gap-1 mt-1">
            <span
                className="text-[30px] font-extrabold tracking-tight leading-none"
                style={{ color: accent ? '#fff' : 'var(--text-primary)' }}
            >
                {value}
            </span>
            {unit && (
                <span
                    className="text-[14px] font-semibold"
                    style={{ color: accent ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)' }}
                >
                    {unit}
                </span>
            )}
        </div>

        {/* sub-label */}
        {sub && (
            <span
                className="text-[11px] mt-0.5"
                style={{ color: accent ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}
            >
                {sub}
            </span>
        )}
    </div>
);

/* ─── page ─────────────────────────────────────────────────────────── */

export const Meteo = () => {
    const [rows, setRows]             = useState<MeteoBDD[]>([]);
    const [latest, setLatest]         = useState<MeteoBDD | null>(null);
    const [chart7, setChart7]         = useState<MeteoBDD[]>([]);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [limit, setLimit]           = useState('30');
    const [parcelleId, setParcelleId] = useState('');
    const [lastAppliedCount, setLastAppliedCount] = useState<number | null>(null);

    const load = (isRefresh = false, isApply = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        Promise.all([
            api.meteo.get({ limit: Number(limit) || 30, ...(parcelleId ? { id_parcelle: Number(parcelleId) } : {}) }),
            api.meteo.getLatest(),
            api.meteo.getLast7(),
        ])
            .then(([data, lat, last7]) => {
                setRows(data);
                setLatest(lat);
                setChart7([...last7].reverse());
                if (isApply) setLastAppliedCount(data.length);
            })
            .catch(e => setError(e.message))
            .finally(() => { setLoading(false); setRefreshing(false); });
    };

    useEffect(() => { load(); }, []);

    const humidityData = chart7.map(m => ({
        day: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][new Date(m.date_meteo).getDay()],
        value: Math.round(m.humidite),
    }));

    const accentIconProps = { size: 14, strokeWidth: 2, color: '#fff' };

    return (
        <div className="flex-1 overflow-auto flex flex-col gap-5 p-5" style={{ background: 'var(--bg-primary)' }}>

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div
                            className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
                            style={{ background: 'var(--accent-muted)', border: '1px solid var(--border-subtle)' }}
                        >
                            <Cloud size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Météo
                        </h1>
                    </div>
                    <p className="text-[13px] ml-[42px]" style={{ color: 'var(--text-muted)' }}>
                        Données météorologiques de l'exploitation
                    </p>
                </motion.div>

                <Btn onClick={() => load(true)} variant="ghost">
                    <RefreshCw
                        size={13}
                        strokeWidth={2.2}
                        className={refreshing ? 'animate-spin' : ''}
                    />
                    Rafraîchir
                </Btn>
            </div>

            {/* ── Error banner ─────────────────────────────────────── */}
            <AlertBanner msg={error} type="error" onClose={() => setError(null)} />

            {/* ── KPI tiles ────────────────────────────────────────── */}
            {loading ? (
                <div className="flex gap-3 flex-wrap">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="flex-1 min-w-[148px] h-[120px] rounded-[var(--radius-lg)] animate-pulse"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                        />
                    ))}
                </div>
            ) : latest && (
                <motion.div
                    className="flex gap-3 flex-wrap"
                    initial="hidden"
                    animate="show"
                >
                    {([
                        {
                            icon: <Thermometer {...accentIconProps} />,
                            label: 'Température',
                            value: Math.round(latest.temperature),
                            unit: '°C',
                            accent: true,
                            sub: 'Mesure la plus récente',
                        },
                        {
                            icon: <Droplets size={14} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />,
                            label: 'Humidité',
                            value: Math.round(latest.humidite),
                            unit: '%',
                            sub: 'Taux d\'humidité',
                        },
                        {
                            icon: <CloudRain size={14} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />,
                            label: 'Précipitations',
                            value: Math.round(latest.precipitation),
                            unit: 'mm',
                            sub: 'Cumul de la période',
                        },
                        {
                            icon: <Wind size={14} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />,
                            label: 'Vent',
                            value: Math.round(latest.vent),
                            unit: 'km/h',
                            sub: 'Vitesse moyenne',
                        },
                    ] as KpiProps[]).map((p, i) => (
                        <motion.div key={i} className="flex-1" custom={i} variants={fadeUp} initial="hidden" animate="show">
                            <KpiTile {...p} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ── Humidity chart ───────────────────────────────────── */}
            <AnimatePresence>
                {humidityData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card title="Humidité du sol — 7 derniers jours">
                            <HumidityChart data={humidityData} color="var(--accent)" height={128} />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Filter bar ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="rounded-[var(--radius-lg)] border p-5"
                style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {/* filter header */}
                <div className="flex items-center gap-2 mb-4">
                    <div
                        className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center"
                        style={{ background: 'var(--accent-muted)' }}
                    >
                        <SlidersHorizontal size={12} strokeWidth={2.2} style={{ color: 'var(--accent)' }} />
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Filtres
                    </span>
                </div>

                <div className="flex gap-4 items-end flex-wrap">
                    <Field label="Nombre d'entrées">
                        <Input
                            type="number"
                            value={limit}
                            onChange={e => setLimit(e.target.value)}
                            className="w-28"
                        />
                    </Field>
                    <Field label="ID Parcelle (optionnel)">
                        <div className="relative flex items-center">
                            <Input
                                type="number"
                                value={parcelleId}
                                onChange={e => setParcelleId(e.target.value)}
                                placeholder="Toutes"
                                className="w-44 pr-8"
                            />
                            {parcelleId && (
                                <button
                                    onClick={() => setParcelleId('')}
                                    className="absolute right-2 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                                    title="Effacer"
                                >
                                    <X size={12} strokeWidth={2.5} style={{ color: 'var(--text-muted)' }} />
                                </button>
                            )}
                        </div>
                    </Field>
                    <div className="flex gap-2 pb-0.5">
                        <Btn onClick={() => { load(false, true); }}>
                            <Filter size={12} strokeWidth={2.2} />
                            Appliquer
                        </Btn>
                    </div>
                </div>
                {lastAppliedCount !== null && (
                    <div className="mt-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        Affiche <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{lastAppliedCount}</span> entrée{lastAppliedCount !== 1 ? 's' : ''}
                    </div>
                )}
            </motion.div>

            {/* ── Historical table ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="rounded-[var(--radius-lg)] border overflow-hidden"
                style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {/* table header bar */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
                >
                    <div className="flex items-center gap-2">
                        <CalendarDays size={13} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Historique météo
                        </span>
                    </div>
                    {!loading && (
                        <span
                            className="text-[11.5px] font-medium px-2.5 py-1 rounded-[var(--radius-sm)]"
                            style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}
                        >
                            {rows.length} entrée{rows.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* loading skeletons */}
                {loading ? (
                    <div className="p-5 flex flex-col gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-6">
                                <Skeleton className="w-32 h-4" />
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-36 h-4" />
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-20 h-4" />
                            </div>
                        ))}
                    </div>

                /* empty state */
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-center px-6">
                        <div
                            className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center mb-5"
                            style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}
                        >
                            <Cloud size={26} strokeWidth={1.4} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="text-[15px] font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Aucune donnée météo
                        </div>
                        <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                            Les données apparaîtront ici une fois disponibles.
                        </div>
                    </div>

                /* data table */
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{ background: 'var(--bg-inset)' }}>
                                    {['Date', 'Température', 'Humidité', 'Précipitations', 'Vent'].map(h => (
                                        <th
                                            key={h}
                                            className="text-left px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.09em] whitespace-nowrap border-b"
                                            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => {
                                    const t = Number(r.temperature);
                                    const hum = Math.min(Number(r.humidite), 100);
                                    return (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(i * 0.018, 0.3), duration: 0.3 }}
                                            className="border-b last:border-b-0 group"
                                            style={{ borderColor: 'var(--border-subtle)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            {/* Date */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                    {new Date(r.date_meteo).toLocaleDateString('fr-FR', {
                                                        weekday: 'short', day: 'numeric', month: 'short',
                                                    })}
                                                </span>
                                            </td>

                                            {/* Temperature */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                                                        style={{ background: tempBg(t) }}
                                                    >
                                                        <Thermometer size={11} strokeWidth={2.2} style={{ color: tempColor(t) }} />
                                                    </div>
                                                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                        {t.toFixed(1)}
                                                        <span className="text-[11px] font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>°C</span>
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Humidity with progress bar */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-24 h-1.5 rounded-full overflow-hidden shrink-0"
                                                        style={{ background: 'var(--bg-inset)' }}
                                                    >
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ background: 'linear-gradient(90deg, #60A5FA, #3B82F6)' }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${hum}%` }}
                                                            transition={{ duration: 0.6, delay: i * 0.015, ease: 'easeOut' }}
                                                        />
                                                    </div>
                                                    <span className="text-[12.5px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                                        {Number(r.humidite).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Precipitation */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <CloudRain size={12} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
                                                    <span className="text-[12.5px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                                        {Number(r.precipitation).toFixed(1)}{' '}
                                                        <span style={{ color: 'var(--text-muted)' }}>mm</span>
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Wind */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Wind size={12} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
                                                    <span className="text-[12.5px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                                        {Number(r.vent).toFixed(1)}{' '}
                                                        <span style={{ color: 'var(--text-muted)' }}>km/h</span>
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
