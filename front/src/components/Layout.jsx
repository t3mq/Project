const NAV = [
  { key: 'dashboard',    label: '📊 Dashboard' },
  { key: 'parcelles',    label: '🌾 Parcelles' },
  { key: 'cultures',     label: '🌱 Cultures' },
  { key: 'alertes',      label: '🔔 Alertes' },
  { key: 'meteo',        label: '🌤 Météo' },
  { key: 'observations', label: '📋 Observations' },
]

const s = {
  sidebar: {
    width: 200, flexShrink: 0, background: '#1e1e2e', color: '#cdd6f4',
    display: 'flex', flexDirection: 'column', padding: '16px 10px',
  },
  logo: {
    fontWeight: 700, fontSize: 16, color: '#cba6f7', padding: '4px 8px',
    marginBottom: 20, letterSpacing: '-0.01em',
  },
  sub: { fontSize: 11, color: '#585b70', marginTop: 2 },
  navItem: (active) => ({
    display: 'block', width: '100%', textAlign: 'left',
    padding: '8px 10px', borderRadius: 7, border: 'none',
    background: active ? '#313244' : 'transparent',
    color: active ? '#cdd6f4' : '#6c7086',
    fontWeight: active ? 600 : 400, fontSize: 13,
    cursor: 'pointer', marginBottom: 2,
  }),
  main: { flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
}

export default function Layout({ page, setPage, children }) {
  return (
    <>
      <div style={s.sidebar}>
        <div style={s.logo}>
          DashFarm
          <div style={s.sub}>Backend v1</div>
        </div>
        {NAV.map(n => (
          <button key={n.key} style={s.navItem(page === n.key)} onClick={() => setPage(n.key)}>
            {n.label}
          </button>
        ))}
      </div>
      <main style={s.main}>{children}</main>
    </>
  )
}
