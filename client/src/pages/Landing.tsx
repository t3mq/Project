import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import type { MotionProps } from 'framer-motion'
import {
    Leaf, ArrowRight, Check, ChevronDown, MapPin, Bell, CloudSun,
    LayoutDashboard, FileText, Sprout, Zap, Shield, Globe,
    Star, TrendingDown, Clock, BarChart3, Menu, X, ArrowUpRight,
} from 'lucide-react'
import { useIsMobile } from '../components/Layout'

// ── SEO: Page title ──────────────────────────────────────────────────────────
function usePageTitle(title: string) {
    useEffect(() => { document.title = title }, [title])
}

// ── Motion presets ────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = { type: 'spring', stiffness: 320, damping: 28 } as const

function fadeUp(delay = 0, distance = 32): Partial<MotionProps> {
    return {
        initial:     { opacity: 0, y: distance },
        whileInView: { opacity: 1, y: 0 },
        viewport:    { once: true, margin: '-48px' },
        transition:  { duration: 0.7, ease: EASE, delay },
    }
}

function fadeIn(delay = 0): Partial<MotionProps> {
    return {
        initial:     { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport:    { once: true },
        transition:  { duration: 0.6, ease: EASE, delay },
    }
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function Badge({ children, variant = 'green' }: { children: React.ReactNode; variant?: 'green' | 'blue' | 'purple' | 'amber' }) {
    const styles: Record<string, React.CSSProperties> = {
        green:  { background: 'rgba(5,150,105,0.12)',  color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
        blue:   { background: 'rgba(37,99,235,0.12)',  color: '#93c5fd', border: '1px solid rgba(147,197,253,0.2)' },
        purple: { background: 'rgba(124,58,237,0.12)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,0.2)' },
        amber:  { background: 'rgba(217,119,6,0.12)',  color: '#fcd34d', border: '1px solid rgba(252,211,77,0.2)' },
    }
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 'var(--radius-full)',
            fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em',
            ...styles[variant],
        }}>
            {children}
        </span>
    )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
    const navigate = useNavigate()
    const [scrolled, setScrolled]     = useState(false)
    const [menuOpen, setMenuOpen]     = useState(false)
    const isMobile                    = useIsMobile()

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    const navLinks = [
        ['Fonctionnalités', '#features'],
        ['Tarifs', '#pricing'],
        ['FAQ', '#faq'],
    ]

    return (
        <>
            <motion.nav
                aria-label="Navigation principale"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{
                    position: 'fixed', top: 12, left: 0, right: 0, zIndex: 1000,
                    padding: '0 20px',
                }}
            >
                <div style={{
                    maxWidth: 860, margin: '0 auto',
                    height: 52,
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: scrolled ? 'rgba(9,9,11,0.85)' : 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                    borderRadius: 60,
                    border: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'}`,
                    padding: '0 6px 0 16px',
                    transition: 'all 0.35s ease',
                    boxShadow: scrolled
                        ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
                        : '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}>
                    {/* Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <div style={{
                            width: 28, height: 28,
                            background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                            borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
                        }}>
                            <Leaf size={14} color="#fff" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 14.5, color: '#fff', letterSpacing: '-0.03em' }}>DashFarm</span>
                    </button>

                    {/* Desktop links */}
                    {!isMobile && (
                        <div style={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'center' }}>
                            {navLinks.map(([label, href]) => (
                                <a key={label} href={href}
                                    style={{
                                        padding: '5px 14px', borderRadius: 20,
                                        fontSize: 13, fontWeight: 500,
                                        color: 'rgba(255,255,255,0.5)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = '#fff'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                                        e.currentTarget.style.background = 'transparent'
                                    }}
                                >{label}</a>
                            ))}
                        </div>
                    )}

                    {/* CTAs */}
                    <div style={{ marginLeft: isMobile ? 'auto' : 0, display: 'flex', gap: 6, alignItems: 'center' }}>
                        {!isMobile && (
                            <button onClick={() => navigate('/auth')}
                                style={{
                                    padding: '6px 14px', borderRadius: 20,
                                    fontSize: 12.5, fontWeight: 500,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.55)',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                            >Se connecter</button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/auth')}
                            style={{
                                padding: '7px 16px', borderRadius: 20,
                                fontSize: 12.5, fontWeight: 700,
                                background: '#059669',
                                border: 'none', color: '#fff',
                                cursor: 'pointer', fontFamily: 'inherit',
                                boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
                                display: 'flex', alignItems: 'center', gap: 5,
                            }}
                        >
                            Commencer <ArrowRight size={12} strokeWidth={2.5} />
                        </motion.button>
                        {isMobile && (
                            <button
                                onClick={() => setMenuOpen(v => !v)}
                                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                                aria-expanded={menuOpen}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex' }}
                            >
                                {menuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isMobile && menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        style={{
                            position: 'fixed', top: 76, left: 16, right: 16, zIndex: 999,
                            background: 'rgba(9,9,11,0.96)',
                            backdropFilter: 'blur(24px)',
                            borderRadius: 20,
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '12px 8px',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                        }}
                    >
                        {navLinks.map(([label, href]) => (
                            <a key={label} href={href} onClick={() => setMenuOpen(false)}
                                style={{
                                    display: 'block', padding: '12px 16px',
                                    borderRadius: 12,
                                    fontSize: 15, fontWeight: 500,
                                    color: 'rgba(255,255,255,0.7)',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'transparent' }}
                            >{label}</a>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', padding: '8px 8px 0' }}>
                            <button onClick={() => { navigate('/auth'); setMenuOpen(false) }}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: 12,
                                    fontSize: 14, fontWeight: 600,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >Se connecter</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const ref = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
    const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80])
    const mockupOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

    return (
        <section ref={ref} style={{
            minHeight: '100svh',
            background: '#09090b',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: isMobile ? 100 : 120,
            paddingBottom: isMobile ? 60 : 80,
            paddingLeft: 20, paddingRight: 20,
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Layered ambient glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 600, background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(5,150,105,0.18) 0%, transparent 70%)', filter: 'blur(1px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 65%)' }} />
                <div style={{ position: 'absolute', top: '40%', left: '-8%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)' }} />
            </div>

            {/* Dot grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            }} />

            {/* Bottom fade to next section */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, transparent 0%, #09090b 100%)', pointerEvents: 'none', zIndex: 2 }} />

            <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>

                    {/* Live badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.65, ease: EASE }}
                        style={{ marginBottom: 28 }}
                    >
                        <Badge variant="green">
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block', flexShrink: 0 }} className="animate-pulse-dot" />
                            Plateforme agricole nouvelle génération
                        </Badge>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
                        style={{
                            fontSize: isMobile ? 44 : 82,
                            fontWeight: 800,
                            color: '#fff',
                            lineHeight: 1.0,
                            letterSpacing: '-0.05em',
                            margin: '0 0 28px',
                        }}
                    >
                        La gestion{!isMobile && <br />}
                        {isMobile ? ' ' : ''}agricole,{' '}
                        <span style={{
                            background: 'linear-gradient(118deg, #34d399 0%, #059669 40%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>réinventée.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
                        style={{
                            fontSize: isMobile ? 16 : 19.5,
                            color: 'rgba(255,255,255,0.38)',
                            lineHeight: 1.75,
                            margin: '0 auto 48px',
                            maxWidth: 540,
                            fontWeight: 400,
                        }}
                    >
                        Pilotez vos parcelles, suivez vos cultures et anticipez les risques grâce à des alertes intelligentes — tout en temps réel.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
                        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 16px 52px rgba(5,150,105,0.55)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate('/auth')}
                            style={{
                                padding: '15px 32px', borderRadius: 'var(--radius-lg)',
                                fontSize: 15, fontWeight: 700,
                                background: '#059669', border: 'none', color: '#fff',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 9,
                                boxShadow: '0 4px 20px rgba(5,150,105,0.4)',
                                transition: 'box-shadow 0.25s',
                            }}
                        >
                            Commencer gratuitement <ArrowRight size={16} strokeWidth={2.5} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/auth')}
                            style={{
                                padding: '15px 28px', borderRadius: 'var(--radius-lg)',
                                fontSize: 15, fontWeight: 600,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.65)',
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.2s',
                            }}
                        >
                            Se connecter
                        </motion.button>
                    </motion.div>

                    {/* Social trust */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}
                    >
                        {[
                            'Aucune carte requise',
                            'Gratuit pour démarrer',
                            'Opérationnel en 3 min',
                        ].map(t => (
                            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
                                <Check size={11} color="#34d399" strokeWidth={3} />
                                {t}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Dashboard mockup with parallax */}
                <motion.div
                    style={{ y: mockupY, opacity: mockupOpacity }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 72, scale: 0.93 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: EASE, delay: 0.48 }}
                        style={{
                            marginTop: isMobile ? 56 : 88,
                            maxWidth: 980,
                            margin: `${isMobile ? 56 : 88}px auto 0`,
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 48px 120px rgba(0,0,0,0.7), 0 0 80px rgba(5,150,105,0.12)',
                            position: 'relative',
                        }}
                    >
                        {/* Glow behind mockup */}
                        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 300, background: 'radial-gradient(ellipse, rgba(5,150,105,0.2) 0%, transparent 70%)', filter: 'blur(32px)', pointerEvents: 'none', zIndex: -1 }} />
                        {/* Browser chrome */}
                        <div style={{
                            background: 'rgba(18,18,20,0.98)',
                            padding: '12px 18px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                                    <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                                ))}
                            </div>
                            <div style={{
                                flex: 1, margin: '0 auto', maxWidth: 280,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 'var(--radius-md)',
                                padding: '5px 12px',
                                fontSize: 10.5, color: 'rgba(255,255,255,0.22)',
                                textAlign: 'center', fontFamily: 'monospace',
                                letterSpacing: '0.01em',
                            }}>
                                dashfarm.app/dashboard
                            </div>
                        </div>
                        <img
                            src="/presentation.png"
                            alt="Tableau de bord DashFarm montrant la gestion des parcelles agricoles, cultures et données météo en temps réel"
                            width={980}
                            height={612}
                            loading="eager"
                            fetchPriority="high"
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
    const isMobile = useIsMobile()
    const items = [
        { value: '500+',    label: 'exploitations actives',    icon: <MapPin size={18} color="#059669" /> },
        { value: '50 000+', label: 'hectares gérés',           icon: <Sprout size={18} color="#059669" /> },
        { value: '99.9%',   label: 'disponibilité garantie',   icon: <Shield size={18} color="#059669" /> },
        { value: '0€',      label: 'pour démarrer',            icon: <Zap size={18} color="#059669" /> },
    ]
    return (
        <section style={{
            background: '#09090b',
            padding: isMobile ? '48px 20px 64px' : '56px 24px 80px',
            position: 'relative',
        }}>
            <div style={{
                maxWidth: 960, margin: '0 auto',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: isMobile ? '36px 16px' : '48px 24px',
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                gap: isMobile ? 32 : 0,
            }}>
                {items.map(({ value, label, icon }, i) => (
                    <motion.div key={label} {...fadeUp(i * 0.08)}
                        style={{
                            textAlign: 'center',
                            padding: isMobile ? '0 8px' : '0 20px',
                            borderLeft: i > 0 && !isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {icon}
                            </div>
                        </div>
                        <div style={{ fontSize: isMobile ? 32 : 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{value}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 8 }}>{label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
    const isMobile = useIsMobile()

    const features = [
        {
            icon: <MapPin size={20} />,
            title: 'Gestion des parcelles',
            desc: "Cartographiez et organisez toutes vos parcelles sur une carte interactive. Visualisez leur état en un coup d'œil.",
            accent: '#059669',
            accentSoft: 'rgba(5,150,105,0.1)',
            tag: 'Cartographie',
        },
        {
            icon: <Sprout size={20} />,
            title: 'Suivi des cultures',
            desc: 'Enregistrez chaque culture, suivez son cycle de vie complet et ne manquez aucune étape critique.',
            accent: '#15803d',
            accentSoft: 'rgba(21,128,61,0.1)',
            tag: 'Cultures',
        },
        {
            icon: <Bell size={20} />,
            title: 'Alertes intelligentes',
            desc: 'Recevez des alertes ciblées basées sur vos cultures, la météo et des règles personnalisables.',
            accent: '#dc2626',
            accentSoft: 'rgba(220,38,38,0.08)',
            tag: 'IA',
        },
        {
            icon: <CloudSun size={20} />,
            title: 'Météo intégrée',
            desc: 'Données météo locales en temps réel et prévisions à 7 jours. Anticipez les risques climatiques.',
            accent: '#2563eb',
            accentSoft: 'rgba(37,99,235,0.08)',
            tag: 'Temps réel',
        },
        {
            icon: <LayoutDashboard size={20} />,
            title: 'Tableau de bord',
            desc: 'Vue synthétique de votre exploitation avec KPIs, graphiques et indicateurs de performance en temps réel.',
            accent: '#d97706',
            accentSoft: 'rgba(217,119,6,0.08)',
            tag: 'Analytics',
        },
        {
            icon: <FileText size={20} />,
            title: 'Rapports & exports',
            desc: 'Générez des rapports détaillés et exportez vos données pour vos partenaires et organismes agricoles.',
            accent: '#7c3aed',
            accentSoft: 'rgba(124,58,237,0.08)',
            tag: 'Exports',
        },
    ]

    return (
        <section id="features" style={{ background: 'linear-gradient(to bottom, #09090b 0%, var(--bg-primary) 15%)', padding: isMobile ? '88px 20px' : '128px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Section header */}
                <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: isMobile ? 64 : 96 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Badge variant="green">Fonctionnalités</Badge>
                    </div>
                    <h2 style={{
                        fontSize: isMobile ? 36 : 58,
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.045em',
                        margin: '0 0 20px',
                        lineHeight: 1.05,
                    }}>
                        Tout ce dont vous{!isMobile && <br />} avez besoin.
                    </h2>
                    <p style={{ fontSize: isMobile ? 15.5 : 18, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
                        Une suite complète d'outils pour gérer votre exploitation de A à Z.
                    </p>
                </motion.div>

                {/* Feature grid */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 14 }}>
                    {features.map((f, i) => (
                        <motion.div key={f.title} {...fadeUp(i * 0.07)}
                            whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)', transition: SPRING }}
                            style={{
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-xl)',
                                padding: '30px 32px',
                                border: '1px solid var(--border)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'border-color 0.25s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.accent}30` }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                        >
                            {/* Subtle top-edge glow on hover handled by border */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div style={{
                                    width: 48, height: 48,
                                    borderRadius: 'var(--radius-md)',
                                    background: f.accentSoft,
                                    border: `1px solid ${f.accent}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: f.accent,
                                }}>
                                    {f.icon}
                                </div>
                                <span style={{
                                    fontSize: 10.5, fontWeight: 700,
                                    color: f.accent,
                                    background: f.accentSoft,
                                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                    letterSpacing: '0.04em',
                                    border: `1px solid ${f.accent}20`,
                                }}>{f.tag}</span>
                            </div>
                            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em' }}>{f.title}</div>
                            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.75 }}>{f.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
    const isMobile = useIsMobile()
    const steps = [
        {
            n: '01',
            icon: <ArrowRight size={20} />,
            title: 'Créez votre compte',
            desc: "Inscription en 30 secondes. Aucune carte bancaire. Commencez à explorer immédiatement.",
            accent: '#059669',
        },
        {
            n: '02',
            icon: <MapPin size={20} />,
            title: 'Ajoutez vos parcelles',
            desc: "Configurez vos parcelles, associez vos cultures et personnalisez vos règles d'alerte.",
            accent: '#2563eb',
        },
        {
            n: '03',
            icon: <BarChart3 size={20} />,
            title: 'Pilotez en temps réel',
            desc: "Accédez à votre tableau de bord, recevez vos alertes et prenez les meilleures décisions.",
            accent: '#7c3aed',
        },
    ]

    return (
        <section style={{ background: 'var(--bg-surface)', padding: isMobile ? '88px 20px' : '128px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: isMobile ? 64 : 96 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Badge variant="blue">Comment ça marche</Badge>
                    </div>
                    <h2 style={{ fontSize: isMobile ? 36 : 58, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.045em', margin: '0 0 20px', lineHeight: 1.05 }}>
                        Opérationnel en 3 minutes.
                    </h2>
                    <p style={{ fontSize: isMobile ? 15.5 : 18, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>
                        Démarrez sans friction. Pas de configuration complexe, pas de formation requise.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 28 : 20, position: 'relative' }}>
                    {/* Connector line */}
                    {!isMobile && (
                        <div style={{
                            position: 'absolute',
                            top: 52, left: 'calc(16.66% + 24px)', right: 'calc(16.66% + 24px)',
                            height: 1,
                            background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.15) 50%, #7c3aed 100%)',
                            zIndex: 0,
                        }} />
                    )}

                    {steps.map((s, i) => (
                        <motion.div key={s.n} {...fadeUp(i * 0.14)}
                            style={{
                                background: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border)',
                                padding: '32px 28px',
                                position: 'relative', zIndex: 1,
                                textAlign: 'center',
                            }}
                        >
                            {/* Step circle */}
                            <div style={{
                                width: 56, height: 56,
                                borderRadius: '50%',
                                margin: '0 auto 24px',
                                background: s.accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff',
                                boxShadow: `0 8px 28px ${s.accent}44`,
                                position: 'relative',
                            }}>
                                {s.icon}
                                <div style={{
                                    position: 'absolute', top: -6, right: -6,
                                    width: 22, height: 22, borderRadius: '50%',
                                    background: 'var(--bg-surface)',
                                    border: '2px solid var(--border)',
                                    fontSize: 10, fontWeight: 800,
                                    color: 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>{s.n}</div>
                            </div>
                            <div style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em' }}>{s.title}</div>
                            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 240, margin: '0 auto' }}>{s.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── Social Proof ──────────────────────────────────────────────────────────────
function SocialProof() {
    const isMobile = useIsMobile()

    const results = [
        { stat: '–68%', desc: 'de pertes de récolte grâce aux alertes précoces', icon: <TrendingDown size={18} color="#34d399" /> },
        { stat: '3×',   desc: 'plus rapide pour diagnostiquer un problème sur parcelle', icon: <Zap size={18} color="#34d399" /> },
        { stat: '+40%', desc: 'de temps économisé sur la gestion administrative', icon: <Clock size={18} color="#34d399" /> },
    ]

    return (
        <section style={{
            background: '#09090b',
            padding: isMobile ? '88px 20px' : '128px 24px',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Glows */}
            <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(5,150,105,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(5,150,105,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 64 : 100, alignItems: 'center' }}>

                    {/* Left — results */}
                    <motion.div {...fadeUp()}>
                        <div style={{ marginBottom: 28 }}>
                            <Badge variant="green">Résultats concrets</Badge>
                        </div>
                        <h2 style={{
                            fontSize: isMobile ? 32 : 48,
                            fontWeight: 800, color: '#fff',
                            letterSpacing: '-0.045em', lineHeight: 1.1,
                            margin: '0 0 44px',
                        }}>
                            Les agriculteurs qui l'utilisent ne reviennent plus en arrière.
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {results.map(({ stat, desc, icon }) => (
                                <div key={stat} style={{
                                    display: 'flex', alignItems: 'center', gap: 20,
                                    padding: '22px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    <div style={{
                                        width: 40, height: 40, flexShrink: 0,
                                        background: 'rgba(5,150,105,0.12)',
                                        border: '1px solid rgba(52,211,153,0.15)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 34, fontWeight: 800, color: '#34d399', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat}</div>
                                        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, marginTop: 4 }}>{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — testimonial */}
                    <motion.div {...fadeUp(0.16)}>
                        {/* Glassmorphism card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.035)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 'var(--radius-xl)',
                            padding: isMobile ? 32 : 48,
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Subtle inner glow */}
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(5,150,105,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                            <div style={{ position: 'relative' }}>
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: 3, marginBottom: 28 }}>
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                                    ))}
                                </div>

                                {/* Quote mark */}
                                <div style={{ fontSize: 72, lineHeight: 0.7, color: '#059669', opacity: 0.3, fontFamily: 'Georgia, serif', marginBottom: 20, userSelect: 'none' }}>"</div>

                                <p style={{
                                    fontSize: isMobile ? 17 : 21,
                                    fontWeight: 600,
                                    color: '#fff',
                                    lineHeight: 1.6,
                                    margin: '0 0 36px',
                                    fontStyle: 'italic',
                                    letterSpacing: '-0.01em',
                                }}>
                                    Avec DashFarm, j'ai réduit mes pertes de moitié la première saison. Les alertes m'ont permis d'intervenir avant qu'il soit trop tard.
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 46, height: 46, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0,
                                        boxShadow: '0 4px 12px rgba(5,150,105,0.4)',
                                    }}>JM</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Jean-Denis Marchand</div>
                                        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Agriculteur céréalier · Beauce</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                                        <Globe size={16} color="rgba(255,255,255,0.15)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    const plans = [
        {
            name: 'Gratuit',
            price: '0€',
            period: 'pour toujours',
            highlight: false,
            desc: 'Parfait pour démarrer et découvrir DashFarm sans engagement.',
            cta: 'Commencer gratuitement',
            features: [
                '5 parcelles',
                '2 cultures actives',
                'Alertes de base',
                'Météo en temps réel',
                'Tableau de bord',
                'Support communauté',
            ],
        },
        {
            name: 'Pro',
            price: '9€',
            period: 'par mois',
            highlight: true,
            badge: 'Recommandé',
            desc: 'Pour les exploitants qui veulent exploiter tout le potentiel de leur ferme.',
            cta: "Démarrer l'essai gratuit",
            features: [
                'Parcelles illimitées',
                'Cultures illimitées',
                'Alertes avancées & IA',
                'Météo + prévisions 7 jours',
                'Rapports & exports PDF',
                'Support prioritaire 24h',
                'Accès API REST',
            ],
        },
    ]

    return (
        <section id="pricing" style={{ background: 'var(--bg-primary)', padding: isMobile ? '88px 20px' : '128px 24px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: isMobile ? 64 : 88 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Badge variant="green">Tarifs</Badge>
                    </div>
                    <h2 style={{ fontSize: isMobile ? 36 : 58, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.045em', margin: '0 0 20px', lineHeight: 1.05 }}>
                        Simple et transparent.
                    </h2>
                    <p style={{ fontSize: isMobile ? 15.5 : 18, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                        Aucune surprise. Commencez gratuitement, évoluez si besoin.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 16, alignItems: 'start' }}>
                    {plans.map((plan, i) => (
                        <motion.div key={plan.name} {...fadeUp(i * 0.1)}
                            whileHover={{ y: plan.highlight ? 0 : -4, transition: SPRING }}
                            style={{
                                borderRadius: 'var(--radius-xl)',
                                padding: isMobile ? 32 : 44,
                                position: 'relative', overflow: 'hidden',
                                ...(plan.highlight ? {
                                    background: '#09090b',
                                    border: '1px solid rgba(5,150,105,0.35)',
                                    boxShadow: '0 0 0 1px rgba(5,150,105,0.12), 0 24px 72px rgba(5,150,105,0.15)',
                                } : {
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-sm)',
                                }),
                            }}
                        >
                            {/* Glow for highlighted card */}
                            {plan.highlight && (
                                <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
                            )}

                            {/* Recommended badge */}
                            {plan.highlight && plan.badge && (
                                <div style={{
                                    position: 'absolute', top: 20, right: 20,
                                    background: '#059669',
                                    color: '#fff', fontSize: 10.5, fontWeight: 700,
                                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    letterSpacing: '0.04em',
                                }}>
                                    {plan.badge}
                                </div>
                            )}

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Plan name */}
                                <div style={{
                                    fontSize: 11, fontWeight: 700,
                                    color: plan.highlight ? 'rgba(255,255,255,0.35)' : 'var(--text-muted)',
                                    marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em',
                                }}>{plan.name}</div>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                                    <span style={{
                                        fontSize: isMobile ? 52 : 64,
                                        fontWeight: 800,
                                        color: plan.highlight ? '#fff' : 'var(--text-primary)',
                                        letterSpacing: '-0.05em', lineHeight: 1,
                                    }}>{plan.price}</span>
                                    <span style={{ fontSize: 13.5, color: plan.highlight ? 'rgba(255,255,255,0.35)' : 'var(--text-muted)', fontWeight: 500 }}>{plan.period}</span>
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: 13.5,
                                    color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)',
                                    margin: '0 0 28px', lineHeight: 1.7,
                                }}>{plan.desc}</p>

                                {/* Divider */}
                                <div style={{ height: 1, background: plan.highlight ? 'rgba(255,255,255,0.07)' : 'var(--border)', marginBottom: 24 }} />

                                {/* Features */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 32 }}>
                                    {plan.features.map(f => (
                                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 18, height: 18, borderRadius: '50%',
                                                flexShrink: 0,
                                                background: plan.highlight ? 'rgba(5,150,105,0.25)' : 'var(--accent-soft)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Check size={10} color={plan.highlight ? '#34d399' : '#059669'} strokeWidth={3} />
                                            </div>
                                            <span style={{ fontSize: 13.5, color: plan.highlight ? 'rgba(255,255,255,0.72)' : 'var(--text-secondary)' }}>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: plan.highlight ? '0 8px 32px rgba(5,150,105,0.45)' : 'var(--shadow-md)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/auth')}
                                    style={{
                                        width: '100%', padding: '14px 0',
                                        borderRadius: 'var(--radius-lg)',
                                        fontSize: 14.5, fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        transition: 'all 0.2s',
                                        ...(plan.highlight ? {
                                            background: '#059669',
                                            border: 'none',
                                            color: '#fff',
                                            boxShadow: '0 4px 16px rgba(5,150,105,0.4)',
                                        } : {
                                            background: 'transparent',
                                            border: '1.5px solid var(--border)',
                                            color: 'var(--text-secondary)',
                                        }),
                                    }}
                                >
                                    {plan.cta}
                                    <ArrowRight size={15} strokeWidth={2.5} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p {...fadeIn(0.2)} style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-muted)' }}>
                    Toutes les offres incluent un essai gratuit · Résiliation à tout moment
                </motion.p>
            </div>
        </section>
    )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
    const [open, setOpen] = useState<number | null>(null)
    const isMobile = useIsMobile()

    const faqs = [
        {
            q: 'DashFarm est-il vraiment gratuit ?',
            a: "Oui, la version gratuite est complète et sans limite de durée. Gérez jusqu'à 5 parcelles et 2 cultures actives sans aucun frais, sans carte bancaire.",
        },
        {
            q: 'Comment fonctionnent les alertes intelligentes ?',
            a: "Les alertes se déclenchent automatiquement selon des règles configurables : conditions météo, stades de culture, seuils d'humidité. Chaque alerte inclut une action recommandée.",
        },
        {
            q: 'Mes données agricoles sont-elles sécurisées ?',
            a: "Vos données sont hébergées en France, chiffrées en transit (HTTPS) et au repos. Nous ne partageons aucune donnée avec des tiers.",
        },
        {
            q: 'Puis-je utiliser DashFarm sur mobile ?',
            a: "Oui, l'interface est entièrement responsive et optimisée pour smartphones et tablettes. Consultez votre tableau de bord partout au champ.",
        },
        {
            q: 'Comment exporter mes données ?',
            a: "Avec la version Pro, exportez vos données en CSV ou générez des rapports PDF détaillés. L'API REST vous permet aussi d'intégrer DashFarm à vos outils existants.",
        },
    ]

    return (
        <section id="faq" style={{ background: 'var(--bg-surface)', padding: isMobile ? '88px 20px' : '128px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: isMobile ? 64 : 88 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Badge variant="purple">FAQ</Badge>
                    </div>
                    <h2 style={{ fontSize: isMobile ? 36 : 58, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.045em', margin: '0 0 20px', lineHeight: 1.05 }}>
                        Des questions ?
                    </h2>
                    <p style={{ fontSize: isMobile ? 15.5 : 18, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                        Tout ce que vous devez savoir avant de démarrer.
                    </p>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {faqs.map((faq, i) => (
                        <motion.div key={i} {...fadeUp(i * 0.05)}>
                            <div
                                onClick={() => setOpen(open === i ? null : i)}
                                style={{
                                    background: open === i ? 'var(--bg-primary)' : 'transparent',
                                    border: `1px solid ${open === i ? 'rgba(5,150,105,0.3)' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '17px 20px',
                                    cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                                    transition: 'all 0.25s var(--ease-out)',
                                }}
                            >
                                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>{faq.q}</span>
                                <motion.div
                                    animate={{ rotate: open === i ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: EASE }}
                                    style={{ flexShrink: 0, color: open === i ? '#059669' : 'var(--text-muted)' }}
                                >
                                    <ChevronDown size={17} strokeWidth={2} />
                                </motion.div>
                            </div>
                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: EASE }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            padding: '14px 20px 22px',
                                            fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8,
                                        }}>{faq.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    return (
        <section style={{ background: 'var(--bg-primary)', padding: isMobile ? '64px 20px' : '96px 24px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div {...fadeUp()}
                    style={{
                        position: 'relative', overflow: 'hidden',
                        borderRadius: 28,
                        padding: isMobile ? '52px 28px' : '88px 80px',
                        textAlign: 'center',
                        background: '#09090b',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 48px 100px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Ambient glow */}
                    <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(5,150,105,0.28) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(4px)' }} />
                    {/* Dot grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)', pointerEvents: 'none' }} />

                    {/* Edge shimmer lines */}
                    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(5,150,105,0.5), transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE }}
                            style={{ marginBottom: 24 }}
                        >
                            <Badge variant="green">
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} className="animate-pulse-dot" />
                                Prêt à démarrer ?
                            </Badge>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
                            style={{
                                fontSize: isMobile ? 30 : 52,
                                fontWeight: 800, color: '#fff',
                                letterSpacing: '-0.045em',
                                margin: '0 0 20px', lineHeight: 1.1,
                            }}
                        >
                            Rejoignez 500+ agriculteurs<br />qui font confiance à DashFarm.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.38)', margin: '0 0 44px', lineHeight: 1.75 }}
                        >
                            Gratuit. Sans carte bancaire. Opérationnel en 3 minutes.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.28, duration: 0.6 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 24px 60px rgba(5,150,105,0.55)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate('/auth')}
                            style={{
                                padding: '17px 44px', borderRadius: 'var(--radius-lg)',
                                fontSize: 16, fontWeight: 700,
                                background: '#059669', border: 'none', color: '#fff',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                boxShadow: '0 6px 24px rgba(5,150,105,0.4)',
                                transition: 'box-shadow 0.25s',
                            }}
                        >
                            Commencer gratuitement <ArrowRight size={18} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    const isMobile = useIsMobile()

    const cols = [
        { title: 'Produit',    links: ['Fonctionnalités', 'Tarifs', 'Changelog', 'Roadmap'] },
        { title: 'Ressources', links: ['Documentation', 'Blog', 'Support', 'FAQ'] },
        { title: 'Légal',      links: ['CGU', 'Confidentialité', 'Cookies', 'Mentions légales'] },
    ]

    return (
        <footer role="contentinfo" style={{ background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '72px 20px 36px' : '100px 24px 52px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Main grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1fr 1fr',
                    gap: isMobile ? 48 : 56,
                    marginBottom: 64,
                }}>
                    {/* Brand column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
                            <div style={{
                                width: 32, height: 32,
                                background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                                borderRadius: 9,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 0 1px rgba(52,211,153,0.2), 0 4px 12px rgba(5,150,105,0.3)',
                            }}>
                                <Leaf size={15} color="#fff" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 15.5, color: '#fff', letterSpacing: '-0.03em' }}>DashFarm</span>
                        </div>
                        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.3)', lineHeight: 1.85, margin: '0 0 28px', maxWidth: 270 }}>
                            La plateforme agricole qui vous aide à prendre de meilleures décisions, chaque jour.
                        </p>
                        {/* Status indicator */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '6px 14px',
                            background: 'rgba(5,150,105,0.08)',
                            border: '1px solid rgba(52,211,153,0.15)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 11.5, color: 'rgba(52,211,153,0.8)', fontWeight: 600,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} className="animate-pulse-dot" />
                            Tous les systèmes opérationnels
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(col => (
                        <div key={col.title}>
                            <div style={{
                                fontSize: 10.5, fontWeight: 700,
                                color: 'rgba(255,255,255,0.2)',
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                marginBottom: 20,
                            }}>{col.title}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                                {col.links.map(l => (
                                    <a key={l} href="#"
                                        style={{
                                            fontSize: 13.5,
                                            color: 'rgba(255,255,255,0.38)',
                                            textDecoration: 'none',
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            transition: 'color 0.2s',
                                            width: 'fit-content',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = '#fff'
                                            const icon = e.currentTarget.querySelector('svg')
                                            if (icon) (icon as SVGElement).style.opacity = '1'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.38)'
                                            const icon = e.currentTarget.querySelector('svg')
                                            if (icon) (icon as SVGElement).style.opacity = '0'
                                        }}
                                    >
                                        {l}
                                        <ArrowUpRight size={11} style={{ opacity: 0, transition: 'opacity 0.2s', flexShrink: 0 }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 28,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 14,
                }}>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.2)' }}>
                        © 2026 DashFarm — La ferme en follie. Tous droits réservés.
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Fait avec <span style={{ color: '#059669' }}>♥</span> pour l'agriculture française 🇫🇷
                    </div>
                </div>
            </div>
        </footer>
    )
}

// ── SEO: FAQ Schema JSON-LD ───────────────────────────────────────────────────
function FAQSchema() {
    const faqData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'DashFarm est-il vraiment gratuit ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Oui, la version gratuite est complète et sans limite de durée. Gérez jusqu'à 5 parcelles et 2 cultures actives sans aucun frais, sans carte bancaire.",
                },
            },
            {
                '@type': 'Question',
                name: 'Comment fonctionnent les alertes intelligentes ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Les alertes se déclenchent automatiquement selon des règles configurables : conditions météo, stades de culture, seuils d'humidité. Chaque alerte inclut une action recommandée.",
                },
            },
            {
                '@type': 'Question',
                name: 'Mes données agricoles sont-elles sécurisées ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Vos données sont hébergées en France, chiffrées en transit (HTTPS) et au repos. Nous ne partageons aucune donnée avec des tiers.',
                },
            },
            {
                '@type': 'Question',
                name: 'Puis-je utiliser DashFarm sur mobile ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Oui, l'interface est entièrement responsive et optimisée pour smartphones et tablettes. Consultez votre tableau de bord partout au champ.",
                },
            },
            {
                '@type': 'Question',
                name: 'Comment exporter mes données ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Avec la version Pro, exportez vos données en CSV ou générez des rapports PDF détaillés. L'API REST vous permet aussi d'intégrer DashFarm à vos outils existants.",
                },
            },
        ],
    }
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
    )
}

// ── SEO: Breadcrumb Schema ───────────────────────────────────────────────────
function BreadcrumbSchema() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: 'https://dashfarm.fr/',
            },
        ],
    }
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

// ── Landing ───────────────────────────────────────────────────────────────────
export const Landing = () => {
    usePageTitle('DashFarm — Gestion agricole intelligente | Parcelles, Cultures, Météo & Alertes')
    return (
    <div style={{ overflowX: 'hidden', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }} role="document">
        <FAQSchema />
        <BreadcrumbSchema />
        <Nav />
        <main>
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <SocialProof />
            <Pricing />
            <FAQ />
            <CTABanner />
        </main>
        <Footer />
    </div>
    )
}
