import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Landing }   from './pages/Landing'
import { AuthPage }  from './pages/Auth'
import { AppLayout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Parcelles } from './pages/Parcelles'
import { Cultures }  from './pages/Cultures'
import { Alertes }   from './pages/Alertes'
import { Meteo }     from './pages/Meteo'

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
        children: [
            { path: '/auth', element: <AuthPage /> },
        ],
    },

    // Application protégée (AppLayout avec Outlet)
    {
        element: <RequireAuth />,
        children: [{
            element: <AppLayout />,
            children: [
                { path: '/dashboard', element: <Dashboard /> },
                { path: '/parcelles', element: <Parcelles /> },
                { path: '/cultures',  element: <Cultures />  },
                { path: '/alertes',   element: <Alertes />   },
                { path: '/meteo',     element: <Meteo />     },
            ],
        }],
    },

    // Fallback
    { path: '*', element: <Navigate to="/" replace /> },
])
