import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Map, Leaf, Cloud, Bell, Settings, HelpCircle,
    LogOut, Search, Menu, X, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { NotificationCenter } from './NotificationCenter'

// ── Hooks ──────────────────────────────────────────────────────────────────
export const useIsMobile = () => {
    const [v, set] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
    useEffect(() => {
        const h = () => set(window.innerWidth < 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return v
}

// ── Shared Components ──────────────────────────────────────────────────────

export const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-shimmer rounded-lg ${className}`} />
)

export const Card = ({
    title, children, action, className = '', noPad = false,
}: {
    title?: string; children: React.ReactNode; action?: React.ReactNode
    className?: string; noPad?: boolean
}) => (
    <div className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] ${className}`}
        style={{ boxShadow: 'var(--shadow-sm)' }}>
        {title && (
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)]">
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">{title}</h3>
                {action}
            </div>
        )}
        <div className={noPad ? '' : 'p-5'}>{children}</div>
    </div>
)

export const Btn = ({
    children, onClick, variant = 'primary', disabled, small, className = '',
}: {
    children: React.ReactNode; onClick?: () => void
    variant?: 'primary' | 'ghost' | 'danger' | 'warning'
    disabled?: boolean; small?: boolean; className?: string
}) => {
    const base = `inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-200
        ${small ? 'px-2.5 py-1 text-[11px] rounded-[var(--radius-sm)]' : 'px-3.5 py-2 text-[12.5px] rounded-[var(--radius-md)]'}
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:scale-[0.97]'}`
    const v = {
        primary: 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-none shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.12)]',
        ghost: 'bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]',
        danger: 'bg-[var(--danger-soft)] hover:bg-red-100 text-[var(--danger)] border border-red-200/60',
        warning: 'bg-[var(--warning-soft)] hover:bg-amber-100 text-[var(--warning)] border border-amber-200/60',
    }
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${v[variant]} ${className}`}>
            {children}
        </button>
    )
}

export const Badge = ({ level }: { level: string }) => {
    const map: Record<string, { cls: string; label: string }> = {
        critique: { cls: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20', label: 'Critique' },
        warning: { cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20', label: 'Attention' },
        info: { cls: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-500/20', label: 'Info' },
        active: { cls: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20', label: 'Actif' },
        resolue: { cls: 'bg-zinc-500/10 text-zinc-500 ring-zinc-500/20', label: 'Resolue' },
        'en cours': { cls: 'bg-blue-500/10 text-blue-700 ring-blue-500/20', label: 'En cours' },
        'termine': { cls: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20', label: 'Termine' },
        attention: { cls: 'bg-amber-500/10 text-amber-700 ring-amber-500/20', label: 'Attention' },
        'probleme': { cls: 'bg-red-500/10 text-red-600 ring-red-500/20', label: 'Probleme' },
    }
    const c = map[level] ?? { cls: 'bg-zinc-500/10 text-zinc-500 ring-zinc-500/20', label: level }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ring-1 ring-inset ${c.cls}`}>
            {c.label}
        </span>
    )
}

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em]">{label}</label>
        {children}
    </div>
)

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full px-3 py-2.5 bg-[var(--bg-inset)] border border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-primary)]
            outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all duration-200
            placeholder:text-[var(--text-muted)] ${props.className ?? ''}`}
    />
)

export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <select
        {...props}
        className={`w-full px-3 py-2.5 bg-[var(--bg-inset)] border border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-primary)]
            outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all duration-200 ${props.className ?? ''}`}
    >
        {children}
    </select>
)

export const AlertBanner = ({ msg, type = 'error', onClose }: { msg: string | null; type?: 'error' | 'success' | 'info'; onClose: () => void }) => {
    if (!msg) return null
    const v = {
        error: 'bg-[var(--danger-soft)] text-[var(--danger-text)] border-red-200/40',
        success: 'bg-[var(--success-soft)] text-[var(--accent-text)] border-emerald-200/40',
        info: 'bg-[var(--info-soft)] text-[var(--info-text)] border-blue-200/40',
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-md)] border text-[13px] font-medium ${v[type]}`}
        >
            <span>{msg}</span>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 text-current cursor-pointer bg-transparent border-none p-1 transition-opacity">
                <X size={14} />
            </button>
        </motion.div>
    )
}

export const Modal = ({
    open, onClose, title, children, maxWidth = 520,
}: {
    open: boolean; onClose: () => void; title: string
    children: React.ReactNode; maxWidth?: number
}) => (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => { if (e.target === e.currentTarget) onClose() }}
                className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', maxWidth }}
                    className="bg-[var(--bg-surface)] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border)]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
                        <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-[-0.02em]">{title}</h2>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer border-none bg-transparent"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)

// ── Compat exports used by existing files ────────────────────────────────
export const D = {
    bg: 'var(--bg-primary)', surface: 'var(--bg-surface)',
    accent: 'var(--accent)', accentDeep: 'var(--accent-hover)',
    accentLight: 'var(--accent-light)', accentSoft: 'var(--accent-soft)',
    text: 'var(--text-primary)', muted: 'var(--text-muted)',
    border: 'var(--border)',
    danger: 'var(--danger)', dangerSoft: 'var(--danger-soft)',
    warning: 'var(--warning)', warningSoft: 'var(--warning-soft)',
    info: 'var(--info)', infoSoft: 'var(--info-soft)',
}

export const P = D

// ── Nav config ──────────────────────────────────────────────────────────
type Page = 'dashboard' | 'parcelles' | 'cultures' | 'alertes' | 'meteo'

const NAV: { key: Page; icon: typeof LayoutDashboard; label: string; path: string }[] = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { key: 'parcelles', icon: Map, label: 'Parcelles', path: '/parcelles' },
    { key: 'cultures', icon: Leaf, label: 'Cultures', path: '/cultures' },
    { key: 'meteo', icon: Cloud, label: 'Meteo', path: '/meteo' },
    { key: 'alertes', icon: Bell, label: 'Alertes', path: '/alertes' },
]

// ── Sidebar Item ──────────────────────────────────────────────────────────
const NavItem = ({
    Icon: IconComp, label, active, badge, onClick,
}: {
    Icon: typeof LayoutDashboard; label: string; active: boolean; badge?: number; onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] cursor-pointer select-none transition-all duration-200 border-none text-left
            ${active
                ? 'bg-white/[0.08] text-white'
                : 'bg-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
            }`}
    >
        {active && (
            <motion.div
                layoutId="nav-indicator"
                className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[var(--accent-light)] rounded-r-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
        )}
        <IconComp size={16} strokeWidth={active ? 2 : 1.5} className={active ? 'text-emerald-400' : ''} />
        <span className={`text-[13px] flex-1 ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {badge}
            </span>
        )}
    </button>
)

// ── App Layout ──────────────────────────────────────────────────────────
export const AppLayout = () => {
    const { user, alertCount, activeAlertes, logout, resolveAlerte } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isMobile = useIsMobile()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const bellRef = useRef<HTMLDivElement>(null)
    const navClick = (path: string) => { navigate(path); setSidebarOpen(false) }

    useEffect(() => {
        if (!notifOpen) return
        const h = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) setNotifOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [notifOpen])

    const initials = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase()

    // Current page label
    const currentNav = NAV.find(n => location.pathname === n.path)

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-[var(--bg-primary)]">

            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <motion.div key="overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[199]"
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <motion.aside
                initial={false}
                animate={{ x: isMobile ? (sidebarOpen ? 0 : -260) : 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                style={isMobile ? {
                    position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 200,
                    boxShadow: sidebarOpen ? '16px 0 48px rgba(0,0,0,0.4)' : 'none',
                } : {}}
                className="w-[248px] shrink-0 flex flex-col h-full"
                id="sidebar"
            >
                <div className="flex flex-col h-full bg-[#111110] border-r border-white/[0.04]">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-5 h-16 shrink-0">
                        <div className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600"
                            style={{ boxShadow: '0 2px 8px rgba(16,185,129,0.35)' }}>
                            <Leaf size={15} className="text-white" strokeWidth={2.2} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-[14px] tracking-[-0.02em] leading-none">DashFarm</div>
                            <div className="text-white/25 text-[10px] mt-0.5">Gestion agricole</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto px-3 pt-2 pb-3 min-h-0">
                        <p className="text-white/20 text-[9px] font-bold tracking-[0.12em] px-3 py-2 uppercase select-none">Menu</p>
                        <div className="flex flex-col gap-0.5">
                            {NAV.map(item => (
                                <NavItem
                                    key={item.key}
                                    Icon={item.icon}
                                    label={item.label}
                                    active={location.pathname === item.path}
                                    badge={item.key === 'alertes' ? alertCount : undefined}
                                    onClick={() => navClick(item.path)}
                                />
                            ))}
                        </div>

                        <div className="h-px bg-white/[0.06] my-4 mx-2" />

                        <p className="text-white/20 text-[9px] font-bold tracking-[0.12em] px-3 py-2 uppercase select-none">Compte</p>
                        <div className="flex flex-col gap-0.5">
                            {[
                                { icon: Settings, label: 'Parametres', action: undefined as (() => void) | undefined, danger: false },
                                { icon: HelpCircle, label: 'Aide', action: undefined as (() => void) | undefined, danger: false },
                                { icon: LogOut, label: 'Deconnexion', action: () => { logout(); navigate('/') }, danger: true },
                            ].map(item => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] cursor-pointer select-none transition-all duration-200 border-none bg-transparent text-left w-full
                                        ${item.danger ? 'text-red-400/50 hover:text-red-400 hover:bg-red-500/10' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'}`}
                                >
                                    <item.icon size={15} strokeWidth={1.5} />
                                    <span className="text-[13px] font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* User */}
                    <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-[var(--radius-md)] hover:bg-white/[0.04] cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-emerald-400 to-emerald-600">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-white/90 text-[12px] font-semibold truncate leading-none">{user?.prenom} {user?.nom}</div>
                                <div className="text-white/25 text-[10px] truncate mt-1 leading-none">{user?.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* ── Main ──────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Topbar */}
                <header className="h-14 bg-[var(--bg-surface)] border-b border-[var(--border)] px-4 flex items-center gap-3 shrink-0 relative z-[100]"
                    style={{ boxShadow: 'var(--shadow-xs)' }}>
                    {isMobile && (
                        <button onClick={() => setSidebarOpen(v => !v)}
                            className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--border)] flex items-center justify-center cursor-pointer text-[var(--text-secondary)] shrink-0 hover:bg-[var(--bg-secondary)] transition-colors bg-transparent">
                            <Menu size={16} />
                        </button>
                    )}

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-[12.5px]">
                        <span className="text-[var(--text-muted)] font-medium">DashFarm</span>
                        <ChevronRight size={12} className="text-[var(--text-muted)]" />
                        <span className="text-[var(--text-primary)] font-semibold">{currentNav?.label ?? 'Page'}</span>
                    </div>

                    <div className="flex-1" />

                    {/* Search */}
                    {!isMobile && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-inset)] border border-[var(--border)] rounded-[var(--radius-md)] hover:border-[var(--text-muted)]/30 transition-colors cursor-pointer" style={{ width: 240 }}>
                            <Search size={13} className="text-[var(--text-muted)]" />
                            <span className="text-[12px] text-[var(--text-muted)] flex-1">Rechercher...</span>
                            <kbd className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[9px] font-semibold text-[var(--text-muted)] bg-[var(--bg-surface)]">⌘K</kbd>
                        </div>
                    )}

                    {/* Bell */}
                    <div ref={bellRef} className="relative">
                        <button
                            onClick={() => setNotifOpen(v => !v)}
                            className={`relative w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center cursor-pointer transition-all border
                                ${notifOpen
                                    ? 'bg-[var(--accent-muted)] border-emerald-200/40 text-[var(--accent)]'
                                    : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                }`}
                        >
                            <Bell size={16} />
                            {alertCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-surface)] animate-pulse-dot" />
                            )}
                        </button>
                        <AnimatePresence>
                            {notifOpen && (
                                <NotificationCenter
                                    alertes={activeAlertes}
                                    onResolve={id => resolveAlerte(id)}
                                    onNavigate={() => { navigate('/alertes'); setNotifOpen(false) }}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User avatar */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-emerald-400 to-emerald-600">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page content with route transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 overflow-auto min-h-0 flex flex-col"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
