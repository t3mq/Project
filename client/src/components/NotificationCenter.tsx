import { motion } from 'framer-motion'
import { AlertTriangle, Sun, FileText, CheckCircle2, ArrowRight } from 'lucide-react'
import type { AlerteBDD } from '../api'

const LEVEL: Record<string, { bg: string; icon: typeof AlertTriangle; iconColor: string }> = {
    critique: { bg: 'bg-red-500/10', icon: AlertTriangle, iconColor: 'text-red-500' },
    warning: { bg: 'bg-amber-500/10', icon: Sun, iconColor: 'text-amber-500' },
    info: { bg: 'bg-blue-500/10', icon: FileText, iconColor: 'text-blue-500' },
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${Math.floor(hours / 24)}j`
}

export const NotificationCenter = ({
    alertes, onResolve, onNavigate,
}: {
    alertes: AlerteBDD[]
    onResolve: (id: number) => void
    onNavigate: () => void
}) => (
    <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[calc(100%+8px)] right-0 w-[380px] bg-[var(--bg-surface)] rounded-[var(--radius-xl)] border border-[var(--border)] z-[500] overflow-hidden"
        style={{ boxShadow: 'var(--shadow-xl)' }}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-bold text-[var(--text-primary)] tracking-[-0.02em]">Notifications</span>
                {alertes.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold min-w-[18px] text-center">
                        {alertes.length}
                    </span>
                )}
            </div>
            {alertes.length > 0 && (
                <button onClick={onNavigate}
                    className="text-[11px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer bg-transparent border-none transition-colors flex items-center gap-1">
                    Tout voir <ArrowRight size={11} />
                </button>
            )}
        </div>

        {/* Content */}
        {alertes.length === 0 ? (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
            >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                </div>
                <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">Tout est calme</div>
                <div className="text-[12px] text-[var(--text-muted)]">Aucune alerte active pour le moment.</div>
            </motion.div>
        ) : (
            <div className="max-h-[380px] overflow-y-auto">
                {alertes.map((a, idx) => {
                    const cfg = LEVEL[a.niveau] ?? LEVEL.info
                    const IconComp = cfg.icon
                    return (
                        <motion.div
                            key={a.id_alerte}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-start gap-3 px-5 py-3.5 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            <div className={`w-8 h-8 rounded-[var(--radius-md)] ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <IconComp size={14} className={cfg.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12.5px] font-semibold text-[var(--text-primary)] leading-snug mb-1 line-clamp-2">{a.message}</div>
                                <div className="text-[11px] text-[var(--text-muted)]">
                                    {a.culture_nom && <span className="font-medium text-[var(--text-secondary)]">{a.culture_nom} · </span>}
                                    {timeAgo(a.date_alerte)}
                                </div>
                            </div>
                            <button
                                onClick={() => onResolve(a.id_alerte)}
                                className="px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-[10.5px] font-semibold cursor-pointer hover:bg-[var(--bg-secondary)] hover:border-[var(--text-muted)]/30 transition-all shrink-0"
                            >
                                Resoudre
                            </button>
                        </motion.div>
                    )
                })}
            </div>
        )}

        {/* Footer */}
        {alertes.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
                <button
                    onClick={onNavigate}
                    className="w-full py-2.5 rounded-[var(--radius-md)] bg-[var(--accent-muted)] hover:bg-[var(--accent)]/15 text-[var(--accent)] text-[12px] font-semibold cursor-pointer border-none transition-colors"
                >
                    Gerer toutes les alertes
                </button>
            </div>
        )}
    </motion.div>
)
