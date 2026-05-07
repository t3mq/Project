import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Landing }   from './pages/Landing'
import { AppLayout } from './components/Layout'

// ── Lazy-loaded pages (code splitting) ─────────────────────────────────────
const AuthPage   = lazy(() => import('./pages/Auth').then(m => ({ default: m.AuthPage })))
const Dashboard  = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })))
const Parcelles  = lazy(() => import('./pages/Parcelles').then(m => ({ default: m.Parcelles })))
const Cultures   = lazy(() => import('./pages/Cultures').then(m => ({ default: m.Cultures })))
const Alertes    = lazy(() => import('./pages/Alertes').then(m => ({ default: m.Alertes })))
const Meteo      = lazy(() => import('./pages/Meteo').then(m => ({ default: m.Meteo })))

// ── Suspense wrapper ───────────────────────────────────────────────────────
const SuspenseLayout = () => (
    <Suspense
        fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }} role="status" aria-label="Chargement">
                <div style={{
                    width: 32,
                    height: 32,
                    border: '3px solid var(--border, #e5e7eb)',
                    borderTop: '3px solid var(--accent, #059669)',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        }
    >
        <Outlet />
    </Suspense>
)

// ── Guards ─────────────────────────────────────────────────────────────────

/** Redirige vers /auth si non connecté */
const RequireAuth = () => {
    const { token } = useAuth()
    return token ? <Outlet /> : <Navigate to="/auth" replace />
}

/** Redirige vers /dashboard si déjà connecté */
const GuestOnly = () => {
    const { token } = useAuth()
    return !token ? <Outlet /> : <Navigate to="/dashboard" replace />
}

// ── Router ─────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([

    // Pages publiques
    { path: '/', element: <Landing /> },
    {
        element: <GuestOnly />,
        children: [{
            element: <SuspenseLayout />,
            children: [
                { path: '/auth', element: <AuthPage /> },
            ],
        }],
    },

    // Application protégée (AppLayout avec Outlet)
    {
        element: <RequireAuth />,
        children: [{
            element: <AppLayout />,
            children: [{
                element: <SuspenseLayout />,
                children: [
                    { path: '/dashboard', element: <Dashboard /> },
                    { path: '/parcelles', element: <Parcelles /> },
                    { path: '/cultures',  element: <Cultures />  },
                    { path: '/alertes',   element: <Alertes />   },
                    { path: '/meteo',     element: <Meteo />     },
                ],
            }],
        }],
    },

    // Fallback
    { path: '*', element: <Navigate to="/" replace /> },
])
