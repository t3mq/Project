import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, Eye, EyeOff, Mail, Lock, User, ArrowRight,
    Map, Cloud, Bell, FileText, AlertCircle, Loader2,
} from 'lucide-react';
import { useIsMobile } from '../components/Layout';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── tiny helpers ──────────────────────────────────────────────────────── */

const features = [
    { icon: Map,      label: 'Suivi des parcelles en temps réel' },
    { icon: Cloud,    label: 'Données météo intégrées' },
    { icon: Bell,     label: 'Alertes intelligentes automatiques' },
    { icon: FileText, label: 'Rapports & exports CSV / PDF' },
];

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/* ─── component ─────────────────────────────────────────────────────────── */

export const AuthPage = () => {
    const { login }   = useAuth();
    const navigate    = useNavigate();
    const isMobile    = useIsMobile();

    const [mode, setMode]       = useState<'login' | 'register'>('login');
    const [form, setForm]       = useState({ nom: '', prenom: '', email: '', mot_de_passe: '', confirmPwd: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
    const switchMode = (m: 'login' | 'register') => { setMode(m); setError(null); };

    const submit = async () => {
        setError(null);
        if (!form.email || !form.mot_de_passe) return setError('Email et mot de passe requis.');
        if (mode === 'register') {
            if (!form.nom || !form.prenom)                          return setError('Nom et prénom requis.');
            if (form.mot_de_passe.length < 6)                       return setError('Min. 6 caractères pour le mot de passe.');
            if (form.mot_de_passe !== form.confirmPwd)              return setError('Les mots de passe ne correspondent pas.');
        }
        setLoading(true);
        try {
            const result = mode === 'login'
                ? await api.auth.login(form.email, form.mot_de_passe)
                : await api.auth.register({ nom: form.nom, prenom: form.prenom, email: form.email, mot_de_passe: form.mot_de_passe });
            login(result.token, result.user);
            navigate('/dashboard', { replace: true });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') submit(); };

    /* shared input style */
    const inputBase =
        'w-full pl-10 pr-4 py-3 rounded-xl text-[13.5px] outline-none transition-all duration-200 ' +
        'bg-white border border-slate-200/80 text-slate-900 placeholder:text-slate-400 ' +
        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 shadow-sm';

    return (
        <div
            className="w-screen h-screen flex overflow-hidden"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* ════════════════════════════════════════════
                LEFT PANEL  — desktop only
            ════════════════════════════════════════════ */}
            {!isMobile && (
                <motion.aside
                    initial={{ opacity: 0, x: -48 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.75, ease }}
                    className="relative w-[440px] shrink-0 flex flex-col justify-between p-12 overflow-hidden select-none"
                    style={{ background: 'linear-gradient(155deg, #0b1120 0%, #0f2318 45%, #0d3320 100%)' }}
                >
                    {/* grid overlay */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),' +
                                'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* ambient glows */}
                    <div
                        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 65%)' }}
                    />
                    <div
                        className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)' }}
                    />
                    {/* subtle center shimmer */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-1/3 h-px opacity-20"
                        style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }}
                    />

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.55, ease }}
                        className="relative flex items-center gap-3"
                    >
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(22,163,74,0.45)',
                            }}
                        >
                            <Leaf size={20} color="white" strokeWidth={2.2} />
                        </div>
                        <div>
                            <p className="text-[20px] font-bold leading-none tracking-tight text-white">DashFarm</p>
                            <p className="mt-0.5 text-[11px] text-white/40 tracking-wide">La ferme en follie</p>
                        </div>
                    </motion.div>

                    {/* Copy + features */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.65, ease }}
                        >
                            <h2 className="text-[30px] font-bold leading-[1.2] tracking-tight text-white mb-3">
                                Gérez votre ferme,<br />
                                <span style={{ color: '#4ade80' }}>où que vous soyez.</span>
                            </h2>
                            <p className="text-[13px] leading-relaxed text-white/50 mb-9">
                                Parcelles, cultures, météo et alertes —<br />
                                tout en un seul tableau de bord.
                            </p>
                        </motion.div>

                        <motion.ul
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col gap-3"
                        >
                            {features.map(({ icon: Icon, label }) => (
                                <motion.li
                                    key={label}
                                    variants={fadeUp}
                                    className="flex items-center gap-3.5"
                                >
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            background: 'rgba(74,222,128,0.1)',
                                            border: '1px solid rgba(74,222,128,0.18)',
                                        }}
                                    >
                                        <Icon size={14} color="#4ade80" strokeWidth={2} />
                                    </span>
                                    <span className="text-[13px] font-medium text-white/70">{label}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                        className="relative text-[11px] text-white/20"
                    >
                        &copy; 2026 DashFarm. Tous droits réservés.
                    </motion.p>
                </motion.aside>
            )}

            {/* ════════════════════════════════════════════
                RIGHT PANEL — form
            ════════════════════════════════════════════ */}
            <div
                className="flex flex-1 items-center justify-center overflow-auto px-6 py-12"
                style={{ background: 'var(--bg-primary, #f8fafc)' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.18, ease }}
                    className="w-full max-w-[390px]"
                >
                    {/* Mobile logo */}
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.45, ease }}
                            className="flex items-center gap-2.5 mb-8"
                        >
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                                }}
                            >
                                <Leaf size={17} color="white" strokeWidth={2.2} />
                            </div>
                            <span className="text-[18px] font-bold tracking-tight text-slate-900">DashFarm</span>
                        </motion.div>
                    )}

                    {/* Heading */}
                    <div className="mb-7">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={mode + '-title'}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease }}
                                className="text-[24px] font-bold tracking-tight text-slate-900 mb-1.5"
                            >
                                {mode === 'login' ? 'Bon retour \u{1F44B}' : 'Créer un compte'}
                            </motion.h1>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={mode + '-sub'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[13.5px] text-slate-400"
                            >
                                {mode === 'login'
                                    ? 'Connectez-vous à votre espace agricole.'
                                    : 'Rejoignez DashFarm gratuitement.'}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Tab switcher */}
                    <div
                        className="relative flex p-1 mb-6 rounded-2xl"
                        style={{
                            background: 'rgba(15,23,42,0.05)',
                            border: '1px solid rgba(15,23,42,0.07)',
                        }}
                    >
                        {/* sliding pill */}
                        <motion.span
                            layout
                            layoutId="auth-tab-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white"
                            style={{
                                left: mode === 'login' ? 4 : 'calc(50%)',
                                boxShadow: '0 1px 6px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
                            }}
                        />
                        {(['login', 'register'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className="relative z-10 flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors duration-200 cursor-pointer border-none bg-transparent"
                                style={{
                                    color: mode === m ? '#0f172a' : '#94a3b8',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {m === 'login' ? 'Connexion' : 'Inscription'}
                            </button>
                        ))}
                    </div>

                    {/* ── Fields ── */}
                    <div className="flex flex-col gap-4">

                        {/* name fields — register only */}
                        <AnimatePresence initial={false}>
                            {mode === 'register' && (
                                <motion.div
                                    key="name-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35, ease }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-3 pb-0.5">
                                        {/* Prénom */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                                                Prénom
                                            </label>
                                            <div className="relative">
                                                <User size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                                                <input
                                                    value={form.prenom}
                                                    onChange={e => set('prenom', e.target.value)}
                                                    onKeyDown={onKeyDown}
                                                    placeholder="Jean"
                                                    className={inputBase}
                                                />
                                            </div>
                                        </div>
                                        {/* Nom */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                                                Nom
                                            </label>
                                            <div className="relative">
                                                <User size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                                                <input
                                                    value={form.nom}
                                                    onChange={e => set('nom', e.target.value)}
                                                    onKeyDown={onKeyDown}
                                                    placeholder="Dupont"
                                                    className={inputBase}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                                Adresse email
                            </label>
                            <div className="relative">
                                <Mail size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="jean@laferme.fr"
                                    className={inputBase}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={form.mot_de_passe}
                                    onChange={e => set('mot_de_passe', e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder={mode === 'register' ? 'Min. 6 caractères' : '••••••••'}
                                    className={inputBase}
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-1 text-slate-400 transition-colors hover:text-slate-600"
                                >
                                    {showPwd
                                        ? <EyeOff size={15} strokeWidth={2} />
                                        : <Eye    size={15} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password — register only */}
                        <AnimatePresence initial={false}>
                            {mode === 'register' && (
                                <motion.div
                                    key="confirm-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                        <label className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                                            Confirmer le mot de passe
                                        </label>
                                        <div className="relative">
                                            <Lock size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                                            <input
                                                type={showPwd ? 'text' : 'password'}
                                                value={form.confirmPwd}
                                                onChange={e => set('confirmPwd', e.target.value)}
                                                onKeyDown={onKeyDown}
                                                placeholder="••••••••"
                                                className={inputBase}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Error banner ── */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -6, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, y: 0,  height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, y: -4,  height: 0, marginTop: 0 }}
                                transition={{ duration: 0.28, ease }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] text-red-700"
                                    style={{
                                        background: 'rgba(254,242,242,0.9)',
                                        border: '1px solid rgba(252,165,165,0.6)',
                                    }}
                                >
                                    <AlertCircle size={14} className="mt-0.5 shrink-0" strokeWidth={2} color="#dc2626" />
                                    <span>{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Submit button ── */}
                    <motion.button
                        onClick={submit}
                        disabled={loading}
                        whileHover={loading ? {} : { scale: 1.018 }}
                        whileTap={loading  ? {} : { scale: 0.975 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                        className="relative mt-5 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border-none py-3.5 text-[14px] font-bold text-white"
                        style={{
                            background: loading
                                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                                : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            boxShadow: loading
                                ? '0 4px 14px rgba(22,163,74,0.25)'
                                : '0 4px 18px rgba(22,163,74,0.38), 0 0 0 1px rgba(22,163,74,0.15)',
                            opacity: loading ? 0.85 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'box-shadow 0.2s, opacity 0.2s',
                        }}
                    >
                        {/* shimmer stripe */}
                        {!loading && (
                            <motion.span
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                                    backgroundSize: '200% 100%',
                                }}
                                animate={{ backgroundPosition: ['200% center', '-200% center'] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
                            />
                        )}

                        {loading ? (
                            <>
                                <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                                <span>Chargement…</span>
                            </>
                        ) : (
                            <>
                                <span>{mode === 'login' ? 'Se connecter' : "S'inscrire"}</span>
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </>
                        )}
                    </motion.button>

                    {/* ── Switch mode link ── */}
                    <p className="mt-5 text-center text-[13px] text-slate-400">
                        {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
                        <button
                            type="button"
                            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                            className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold transition-colors hover:opacity-80"
                            style={{ color: '#16a34a', fontFamily: 'inherit' }}
                        >
                            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
