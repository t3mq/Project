// ── Types API (correspondant au schéma BDD) ──────────────────────────────────

export interface ParcelleBDD {
    id_parcelle: number;
    nom: string;
    surface: number;
    latitude: number;
    longitude: number;
    description: string | null;
    date_creation: string;
    id_utilisateur: number;
    cultures: CultureBDD[];
}

export interface TypeCultureBDD {
    id_type_culture: number;
    nom: string;
    description: string | null;
    couleur: string;
}

export interface CultureBDD {
    id_culture: number;
    nom: string;
    variete: string | null;
    date_semis: string;
    date_recolte_prevue: string | null;
    statut: string;
    id_parcelle: number;
    id_type_culture: number | null;
    parcelle_nom?: string;
    type_culture_nom?: string;
    type_culture_couleur?: string;
}

export interface AlerteBDD {
    id_alerte: number;
    date_alerte: string;
    type_alerte: string;
    message: string;
    niveau: 'critique' | 'warning' | 'info';
    statut: 'active' | 'resolue';
    id_culture: number;
    id_regle: number;
    culture_nom: string;
    regle_nom: string;
}

export interface MeteoBDD {
    date_meteo: string;
    temperature: number;
    humidite: number;
    precipitation: number;
    vent: number;
}

export interface AuthUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

// ── Fonctions fetch ───────────────────────────────────────────────────────────

const BASE = (import.meta.env.VITE_API_URL as string) || '/api'

function authHeaders(withBody = false): Record<string, string> {
    const h: Record<string, string> = {}
    if (withBody) h['Content-Type'] = 'application/json'
    const token = localStorage.getItem('token')
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
}

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
    return res.json()
}

async function mutate<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: authHeaders(!!body),
        body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `API error ${res.status}: ${path}`)
    }
    return res.status === 204 ? undefined as T : res.json()
}

export const api = {
    parcelles: {
        getAll:  () => get<ParcelleBDD[]>('/parcelles'),
        getById: (id: number) => get<ParcelleBDD>(`/parcelles/${id}`),
        create:  (data: Partial<ParcelleBDD>) => mutate<ParcelleBDD>('POST', '/parcelles', data),
        update:  (id: number, data: Partial<ParcelleBDD>) => mutate<ParcelleBDD>('PUT', `/parcelles/${id}`, data),
        delete:  (id: number) => mutate<void>('DELETE', `/parcelles/${id}`),
    },
    cultures: {
        getAll:  () => get<CultureBDD[]>('/cultures'),
        getById: (id: number) => get<CultureBDD>(`/cultures/${id}`),
        create:  (data: Partial<CultureBDD>) => mutate<CultureBDD>('POST', '/cultures', data),
        update:  (id: number, data: Partial<CultureBDD>) => mutate<CultureBDD>('PUT', `/cultures/${id}`, data),
        delete:  (id: number) => mutate<void>('DELETE', `/cultures/${id}`),
    },
    typeCultures: {
        getAll:  () => get<TypeCultureBDD[]>('/type-cultures'),
        create:  (data: Partial<TypeCultureBDD>) => mutate<TypeCultureBDD>('POST', '/type-cultures', data),
        update:  (id: number, data: Partial<TypeCultureBDD>) => mutate<TypeCultureBDD>('PUT', `/type-cultures/${id}`, data),
        delete:  (id: number) => mutate<void>('DELETE', `/type-cultures/${id}`),
    },
    alertes: {
        getAll:  () => get<AlerteBDD[]>('/alertes'),
        resolve: (id: number) => mutate<AlerteBDD>('PUT', `/alertes/${id}/resolve`),
        run:     () => mutate<{ alertes_creees: number }>('POST', '/alertes/run'),
    },
    meteo: {
        getLast7:  () => get<MeteoBDD[]>('/meteo?limit=7'),
        getLatest: () => get<MeteoBDD>('/meteo/latest'),
        get: (params?: { limit?: number; id_parcelle?: number }) => {
            const q = new URLSearchParams()
            if (params?.limit)       q.set('limit',       String(params.limit))
            if (params?.id_parcelle) q.set('id_parcelle', String(params.id_parcelle))
            return get<MeteoBDD[]>(`/meteo?${q}`)
        },
    },
    auth: {
        login:    (email: string, mot_de_passe: string) =>
            mutate<{ token: string; user: AuthUser }>('POST', '/auth/login', { email, mot_de_passe }),
        register: (data: { nom: string; prenom: string; email: string; mot_de_passe: string; role?: string }) =>
            mutate<{ token: string; user: AuthUser }>('POST', '/auth/register', data),
        me:       () => get<{ user: AuthUser }>('/auth/me'),
    },
}

// ── Helpers de mapping ────────────────────────────────────────────────────────

/** Normalise lat/lon de toutes les parcelles vers x/y en % (0-100) pour la carte SVG */
export function normalizeParcelles(parcelles: ParcelleBDD[]) {
    if (!parcelles.length) return []

    const lats = parcelles.map(p => p.latitude)
    const lons = parcelles.map(p => p.longitude)
    const minLat = Math.min(...lats), maxLat = Math.max(...lats)
    const minLon = Math.min(...lons), maxLon = Math.max(...lons)
    const latRange = maxLat - minLat || 0.01
    const lonRange = maxLon - minLon || 0.01
    const PAD = 10

    return parcelles.map(p => {
        const x = PAD + ((p.longitude - minLon) / lonRange) * (100 - PAD * 2)
        const y = PAD + ((maxLat - p.latitude) / latRange) * (100 - PAD * 2)
        const size = Math.max(8, Math.min(22, Math.sqrt(p.surface) * 4))

        const cultures = p.cultures ?? []
        const hasProblem = cultures.some(c => c.statut === 'problème' || c.statut === 'alerte')
        const hasWarning = cultures.some(c => c.statut === 'attention' || c.statut === 'warning')
        const status = hasProblem ? 'alert' : hasWarning ? 'warning' : 'healthy'

        const crop = cultures[0]?.nom ?? 'Inconnu'

        return {
            id: `P${String(p.id_parcelle).padStart(2, '0')}`,
            name: p.nom,
            crop,
            area: p.surface,
            status: status as 'healthy' | 'warning' | 'alert',
            health: status === 'alert' ? 55 : status === 'warning' ? 74 : 88,
            x: Math.round(x),
            y: Math.round(y),
            w: Math.round(size),
            h: Math.round(size * 0.75),
            lat: p.latitude,
            lon: p.longitude,
        }
    })
}

/** Dérive le niveau/icon d'une alerte BDD vers les types du dashboard */
export function mapAlerte(a: AlerteBDD) {
    const typeKey = a.type_alerte?.toLowerCase() ?? ''
    const icon =
        typeKey.includes('mildiou') || typeKey.includes('maladie') ? 'disease' :
        typeKey.includes('irrigation') || typeKey.includes('eau') ? 'water' :
        typeKey.includes('insecte') || typeKey.includes('ravageur') ? 'pest' :
        'weather'

    const level: 'critical' | 'warning' | 'info' =
        a.niveau === 'critique' ? 'critical' :
        a.niveau === 'warning'  ? 'warning'  : 'info'

    const action =
        level === 'critical' ? 'Inspecter' :
        level === 'warning'  ? 'Programmer' : 'Voir'

    return {
        id: a.id_alerte,
        level,
        icon,
        title: a.message,
        parcel: a.culture_nom,
        time: formatRelativeTime(a.date_alerte),
        action,
    }
}

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${Math.floor(hours / 24)}j`
}

/** Jour court en français depuis une date ISO */
export function shortDay(dateStr: string): string {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return days[new Date(dateStr).getDay()]
}
