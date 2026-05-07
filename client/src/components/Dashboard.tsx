import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FARM_DATA } from '../data'
import type { Parcel } from '../data'
import {
    Map, Leaf, Bell, Thermometer, Droplets, Wind, CloudRain,
    Sun, Cloud, CloudLightning, ArrowRight, Download, Plus,
    CheckCircle2, TrendingUp,
} from 'lucide-react'

import { FarmMap } from './FarmMap'
import { HumidityChart } from './Charts'
import { useIsMobile, Skeleton } from './Layout'
import { api, normalizeParcelles, mapAlerte, shortDay } from '../api'
import type { MeteoBDD, AlerteBDD } from '../api'

const STATUS_COLOR = {
    healthy: { fill: '#059669', stroke: '#047857', text: 'Sain', bg: '#ecfdf5' },
    warning: { fill: '#d97706', stroke: '#b45309', text: 'Attention', bg: '#fffbeb' },
    alert: { fill: '#dc2626', stroke: '#b91c1c', text: 'Alerte', bg: '#fef2f2' },
}

const weatherIcons: Record<string, typeof Sun> = { sun: Sun, cloud: Cloud, rain: CloudRain, storm: CloudLightning }

// ── KPI Card ──────────────────────────────────────────────────────────────
const KpiCard = ({
    label, value, suffix, sub, icon: IconComp, accent = false, loading,
}: {
    label: string; value: string | number; suffix?: string
    sub: string; icon: typeof Map; accent?: boolean; loading?: boolean
}) => (
    <div className={`flex-1 min-w-[160px] rounded-[var(--radius-lg)] p-4 flex flex-col gap-3 transition-all duration-300
        ${accent
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white ring-1 ring-emerald-500/20'
            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] ring-1 ring-[var(--border)] hover:ring-[var(--text-muted)]/20'
        }`}
        style={{ boxShadow: accent ? '0 4px 24px rgba(5,150,105,0.25)' : 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold tracking-wide uppercase ${accent ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>{label}</span>
            <div className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center
                ${accent ? 'bg-white/15' : 'bg-[var(--bg-inset)]'}`}>
                <IconComp size={14} strokeWidth={1.8} className={accent ? 'text-white/80' : 'text-[var(--text-muted)]'} />
            </div>
        </div>
        {loading ? (
            <div className={`h-8 rounded-lg ${accent ? 'bg-white/15' : ''}`}><Skeleton className="h-full w-24" /></div>
        ) : (
            <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-bold tracking-[-0.03em] leading-none">{value}</span>
                {suffix && <span className={`text-[13px] font-semibold ${accent ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>{suffix}</span>}
            </div>
        )}
        <div className={`inline-flex items-center gap-1.5 self-start px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-semibold
            ${accent ? 'bg-white/15 text-white/80' : 'bg-[var(--bg-inset)] text-[var(--text-secondary)]'}`}>
            {sub}
        </div>
    </div>
)

// ── Alert Item ──────────────────────────────────────────────────────────
const AlertItem = ({
    a, idx, onResolve,
}: {
    a: ReturnType<typeof mapAlerte>; idx: number; onResolve?: (id: number) => void
}) => {
    const cfg = a.level === 'critical'
        ? { bg: 'bg-red-500/8', ring: 'ring-red-500/15', color: 'text-red-500' }
        : a.level === 'warning'
        ? { bg: 'bg-amber-500/8', ring: 'ring-amber-500/15', color: 'text-amber-500' }
        : { bg: 'bg-blue-500/8', ring: 'ring-blue-500/15', color: 'text-blue-500' }
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-start gap-3 p-3 rounded-[var(--radius-md)] ring-1 ${cfg.ring} bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] transition-colors`}
        >
            <div className={`w-8 h-8 rounded-[var(--radius-md)] ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Bell size={14} className={cfg.color} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">{a.title}</div>
                <div className="text-[10.5px] text-[var(--text-muted)] mt-0.5">{a.parcel} · {a.time}</div>
            </div>
            {onResolve && (
                <button
                    onClick={() => onResolve(a.id)}
                    className="px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-[10px] font-semibold cursor-pointer hover:bg-[var(--bg-secondary)] transition-all shrink-0"
                >
                    {a.action}
                </button>
            )}
        </motion.div>
    )
}

// ── Dashboard ──────────────────────────────────────────────────────────
export const Dashboard = () => {
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const [cropFilter, setCropFilter] = useState('Tout')
    const [selected, setSelected] = useState<Parcel | null>(null)

    const [parcelles, setParcelles] = useState<Parcel[]>([])
    const [alertes, setAlertes] = useState<ReturnType<typeof mapAlerte>[]>([])
    const [meteo7d, setMeteo7d] = useState<MeteoBDD[]>([])
    const [latestMeteo, setLatestMeteo] = useState<MeteoBDD | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            api.parcelles.getAll(),
            api.alertes.getAll(),
            api.meteo.getLast7(),
            api.meteo.getLatest(),
        ]).then(([rp, ra, rm, lat]) => {
            setParcelles(normalizeParcelles(rp))
            setAlertes((ra as AlerteBDD[]).filter(a => a.statut === 'active').map(mapAlerte))
            setMeteo7d((rm as MeteoBDD[]).slice().reverse())
            setLatestMeteo(lat as MeteoBDD)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setError('Impossible de contacter le serveur')
            setLoading(false)
        })
    }, [])

    const handleResolve = async (id: number) => {
        await api.alertes.resolve(id)
        setAlertes(prev => prev.filter(a => a.id !== id))
    }

    const filteredParcels = cropFilter === 'Tout' ? parcelles : parcelles.filter(p => p.crop === cropFilter)
    const crops = ['Tout', ...Array.from(new Set(parcelles.map(p => p.crop)))]

    const exportCSV = () => {
        const header = 'ID,Nom,Culture,Surface (ha),Statut,Sante (%),Lat,Lon'
        const lines = parcelles.map(p => `${p.id},${p.name},${p.crop},${p.area},${p.status},${p.health},${p.lat},${p.lon}`)
        const blob = new Blob([header + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'rapport_parcelles.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    const humidityData = meteo7d.length
        ? meteo7d.map(m => ({ day: shortDay(m.date_meteo), value: Math.round(m.humidite) }))
        : FARM_DATA.humidity7d

    const forecast = meteo7d.map(m => ({
        day: shortDay(m.date_meteo),
        icon: m.precipitation > 8 ? 'rain' : m.precipitation > 2 ? 'cloud' : 'sun',
        temp: Math.round(m.temperature),
        rain: Math.round(m.precipitation),
    }))

    const temp = latestMeteo ? Math.round(latestMeteo.temperature) : '—'
    const humidity = latestMeteo ? Math.round(latestMeteo.humidite) : '—'
    const wind = latestMeteo ? Math.round(latestMeteo.vent) : '—'
    const precip = latestMeteo ? Math.round(latestMeteo.precipitation) : '—'

    return (
        <div className={`flex-1 flex flex-col gap-4 min-h-0 ${isMobile ? 'overflow-auto p-4' : 'overflow-hidden p-5'}`}>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-500/8 ring-1 ring-amber-500/15 rounded-[var(--radius-md)] text-[12.5px] text-amber-700 font-medium shrink-0">
                    {error} — donnees de demonstration
                </div>
            )}

            {/* Header + KPIs */}
            <div className="shrink-0">
                <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
                    <div>
                        <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-[-0.03em] leading-none">
                            Tableau de bord
                        </h1>
                        {!isMobile && (
                            <p className="text-[13px] text-[var(--text-muted)] mt-2">
                                Vue d'ensemble de votre exploitation
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => navigate('/parcelles')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[12.5px] font-semibold rounded-[var(--radius-md)] border-none cursor-pointer transition-all active:scale-[0.97]"
                            style={{ boxShadow: '0 1px 3px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
                            <Plus size={14} />
                            {isMobile ? 'Parcelle' : 'Nouvelle parcelle'}
                        </button>
                        {!isMobile && (
                            <button onClick={exportCSV}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[12.5px] font-semibold rounded-[var(--radius-md)] border border-[var(--border)] cursor-pointer transition-all active:scale-[0.97]">
                                <Download size={14} />
                                Exporter
                            </button>
                        )}
                    </div>
                </div>

                <motion.div
                    className="flex gap-3 flex-wrap"
                    initial="hidden" animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                >
                    {([
                        { accent: true, label: 'Parcelles', value: loading ? '' : parcelles.length, sub: `${parcelles.length} actives`, icon: Map },
                        { accent: false, label: 'Cultures', value: loading ? '' : parcelles.length, sub: 'En cours', icon: Leaf },
                        { accent: false, label: 'Alertes', value: loading ? '' : alertes.length, sub: alertes.filter(a => a.level === 'critical').length > 0 ? `${alertes.filter(a => a.level === 'critical').length} critique(s)` : 'Aucune critique', icon: Bell },
                        { accent: false, label: 'Temperature', value: loading ? '' : temp, suffix: '°C', sub: `Hum. ${humidity}% · Vent ${wind}km/h`, icon: Thermometer },
                    ] as Parameters<typeof KpiCard>[0][]).map((p, i) => (
                        <motion.div key={i} className="flex-1" style={{ minWidth: 160 }}
                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}>
                            <KpiCard loading={loading} {...p} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Map + Right */}
            <div className={`flex gap-4 min-h-0 ${isMobile ? 'flex-col' : 'flex-1 overflow-hidden'}`}>

                {/* Map card */}
                <div className={`bg-[var(--bg-surface)] rounded-[var(--radius-lg)] ring-1 ring-[var(--border)] flex flex-col overflow-hidden ${isMobile ? 'h-[340px] shrink-0' : 'flex-[3_1_0]'}`}
                    style={{ boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] shrink-0">
                        <div>
                            <div className="text-[13px] font-semibold text-[var(--text-primary)]">Carte des parcelles</div>
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                                {filteredParcels.length} parcelles · {filteredParcels.reduce((s, p) => s + p.area, 0).toFixed(1)} ha
                            </div>
                        </div>
                        <div className="flex gap-0.5 p-0.5 bg-[var(--bg-inset)] rounded-[var(--radius-md)] ring-1 ring-[var(--border-subtle)]">
                            {crops.map(c => (
                                <button key={c} onClick={() => setCropFilter(c)}
                                    className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-semibold border-none cursor-pointer transition-all
                                        ${cropFilter === c
                                            ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]'
                                            : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                                    <span className="text-[12px] text-[var(--text-muted)] font-medium">Chargement...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0">
                                <FarmMap
                                    parcels={filteredParcels.length ? filteredParcels : FARM_DATA.parcels}
                                    style="satellite"
                                    selectedId={selected?.id}
                                    onSelect={setSelected}
                                    palette={{ bg: '#fafaf9', surface: '#ffffff', accent: '#059669', accentDeep: '#047857', accentLight: '#34d399', accentSoft: '#ecfdf5', text: '#0c0c0c', mute: '#a3a3a3', border: '#e5e5e5' }}
                                />
                            </div>
                        )}

                        {/* Legend */}
                        <div className="absolute bottom-3 right-3 bg-[var(--bg-surface)]/95 backdrop-blur-sm px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-3 text-[10px] font-semibold text-[var(--text-secondary)] ring-1 ring-[var(--border)]"
                            style={{ boxShadow: 'var(--shadow-md)' }}>
                            {(Object.entries(STATUS_COLOR) as [string, typeof STATUS_COLOR[keyof typeof STATUS_COLOR]][]).map(([k, c]) => (
                                <div key={k} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ background: c.fill }} />
                                    {c.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className={`flex flex-col gap-4 ${isMobile ? '' : 'flex-[2_1_0] overflow-hidden min-h-0'}`}>

                    {/* Humidity */}
                    <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] ring-1 ring-[var(--border)] p-4 shrink-0"
                        style={{ boxShadow: 'var(--shadow-sm)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Humidite du sol</div>
                                <div className="text-[10.5px] text-[var(--text-muted)] mt-0.5">7 derniers jours</div>
                            </div>
                            {meteo7d.length >= 2 && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/8 rounded-[var(--radius-sm)] text-[11px] font-semibold text-emerald-600">
                                    <TrendingUp size={11} />
                                    {(meteo7d[meteo7d.length - 1].humidite - meteo7d[0].humidite) > 0 ? '+' : ''}
                                    {(meteo7d[meteo7d.length - 1].humidite - meteo7d[0].humidite).toFixed(0)}%
                                </div>
                            )}
                        </div>
                        <HumidityChart data={humidityData} color="#059669" height={90} />
                    </div>

                    {/* Alerts */}
                    <div className={`bg-[var(--bg-surface)] rounded-[var(--radius-lg)] ring-1 ring-[var(--border)] flex flex-col ${isMobile ? '' : 'flex-1 min-h-0 overflow-hidden'}`}
                        style={{ boxShadow: 'var(--shadow-sm)' }}>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] shrink-0">
                            <div className="text-[13px] font-semibold text-[var(--text-primary)]">Alertes recentes</div>
                            <button onClick={() => navigate('/alertes')}
                                className="text-[11px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] bg-transparent border-none cursor-pointer transition-colors flex items-center gap-1">
                                Voir tout <ArrowRight size={11} />
                            </button>
                        </div>
                        <div className={`flex flex-col gap-2 p-3 ${isMobile ? '' : 'overflow-auto flex-1'}`}>
                            {(alertes.length ? alertes : FARM_DATA.alerts).map((a, idx) => (
                                <AlertItem key={a.id} a={a} idx={idx} onResolve={alertes.length ? handleResolve : undefined} />
                            ))}
                            {!loading && alertes.length === 0 && (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    </div>
                                    <div className="text-[12.5px] font-semibold text-[var(--text-primary)]">Aucune alerte active</div>
                                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Votre exploitation est sereine.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weather */}
                    <div className="rounded-[var(--radius-lg)] ring-1 ring-[var(--border)] overflow-hidden shrink-0"
                        style={{ boxShadow: 'var(--shadow-sm)' }}>
                        <div className="px-4 py-4 relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a2e23 60%, #065f46 100%)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                            <div className="flex items-center justify-between relative">
                                <div>
                                    <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-1.5">Maintenant</div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[30px] font-bold text-white leading-none tracking-[-0.03em]">{temp}</span>
                                        <span className="text-[14px] font-semibold text-white/50">°C</span>
                                    </div>
                                </div>
                                <Sun size={28} className="text-white/15" />
                            </div>
                            <div className="flex gap-5 mt-3 relative">
                                {[
                                    { icon: Droplets, label: 'Hum.', value: `${humidity}%` },
                                    { icon: Wind, label: 'Vent', value: `${wind} km/h` },
                                    { icon: CloudRain, label: 'Pluie', value: `${precip}mm` },
                                ].map(({ icon: I, label, value }) => (
                                    <div key={label} className="flex items-center gap-1.5">
                                        <I size={11} className="text-white/30" />
                                        <div>
                                            <div className="text-[9px] text-white/30 font-medium">{label}</div>
                                            <div className="text-[11px] font-semibold text-white/70">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-2 py-2 bg-[var(--bg-surface)] grid gap-0.5" style={{ gridTemplateColumns: `repeat(${(forecast.length || FARM_DATA.forecast7d.length)}, 1fr)` }}>
                            {(forecast.length ? forecast : FARM_DATA.forecast7d).map((d, i) => {
                                const WeatherIcon = weatherIcons[d.icon] ?? Cloud
                                return (
                                    <div key={i} className={`flex flex-col items-center py-2 px-0.5 rounded-[var(--radius-md)] transition-colors
                                        ${i === 0 ? 'bg-emerald-500/8 ring-1 ring-emerald-500/15' : 'hover:bg-[var(--bg-secondary)]'}`}>
                                        <div className="text-[9px] font-semibold text-[var(--text-muted)] mb-1.5">{d.day}</div>
                                        <WeatherIcon size={15} className={i === 0 ? 'text-emerald-500' : 'text-[var(--text-muted)]'} />
                                        <div className="text-[11px] font-bold text-[var(--text-primary)] mt-1.5">{'temp' in d ? d.temp : (d as any).high}°</div>
                                        <div className="text-[9px] text-blue-400 font-semibold">{'rain' in d ? d.rain : 0}mm</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
