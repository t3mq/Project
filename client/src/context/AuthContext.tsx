import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api'
import type { AuthUser, AlerteBDD } from '../api'

interface AuthCtx {
    token: string | null
    user: AuthUser | null
    alertCount: number
    activeAlertes: AlerteBDD[]
    login: (tok: string, u: AuthUser) => void
    logout: () => void
    refreshAlerts: () => void
    resolveAlerte: (id: number) => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
    token: null, user: null, alertCount: 0, activeAlertes: [],
    login: () => {}, logout: () => {},
    refreshAlerts: () => {}, resolveAlerte: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
    const [user,  setUser]  = useState<AuthUser | null>(() => {
        const s = localStorage.getItem('user')
        return s ? JSON.parse(s) : null
    })
    const [alertCount,    setAlertCount]    = useState(0)
    const [activeAlertes, setActiveAlertes] = useState<AlerteBDD[]>([])

    const refreshAlerts = () => {
        api.alertes.getAll()
            .then(a => {
                const active = a.filter(x => x.statut === 'active')
                setAlertCount(active.length)
                setActiveAlertes(active)
            })
            .catch(() => {})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (token) refreshAlerts() }, [token])

    const login = (tok: string, u: AuthUser) => {
        localStorage.setItem('token', tok)
        localStorage.setItem('user', JSON.stringify(u))
        setToken(tok)
        setUser(u)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    const resolveAlerte = async (id: number) => {
        await api.alertes.resolve(id).catch(() => {})
        refreshAlerts()
    }

    return (
        <AuthContext.Provider value={{ token, user, alertCount, activeAlertes, login, logout, refreshAlerts, resolveAlerte }}>
            {children}
        </AuthContext.Provider>
    )
}
