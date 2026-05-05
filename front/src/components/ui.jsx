// Petits composants réutilisables

export function Card({ title, children, action }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export function KpiCard({ label, value, sub, color = '#4d7c2f' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', flex: 1 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export function Badge({ level }) {
  const map = {
    critique: { bg: '#fee2e2', color: '#b91c1c', label: 'Critique' },
    warning:  { bg: '#fef3c7', color: '#b45309', label: 'Warning' },
    info:     { bg: '#dbeafe', color: '#1d4ed8', label: 'Info' },
    active:   { bg: '#d1fae5', color: '#065f46', label: 'Active' },
    resolue:  { bg: '#f3f4f6', color: '#6b7280', label: 'Résolue' },
    'en cours':{ bg: '#dbeafe', color: '#1d4ed8', label: 'En cours' },
    terminé:  { bg: '#d1fae5', color: '#065f46', label: 'Terminé' },
    attention:{ bg: '#fef3c7', color: '#b45309', label: 'Attention' },
    problème: { bg: '#fee2e2', color: '#b91c1c', label: 'Problème' },
  }
  const c = map[level] ?? { bg: '#f3f4f6', color: '#6b7280', label: level }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

export function Table({ columns, rows, onAction }) {
  if (!rows?.length) return <div style={{ color: '#9ca3af', fontSize: 13, padding: '12px 0' }}>Aucune donnée.</div>
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            {columns.map(c => (
              <th key={c.key} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{c.label}</th>
            ))}
            {onAction && <th style={{ width: 80 }}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: '8px 10px', color: '#374151' }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
              {onAction && (
                <td style={{ padding: '8px 10px' }}>{onAction(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Btn({ children, onClick, variant = 'primary', disabled, small }) {
  const styles = {
    primary:  { background: '#4d7c2f', color: '#fff', border: 'none' },
    ghost:    { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' },
    danger:   { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
    warning:  { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: small ? '4px 10px' : '7px 14px',
        borderRadius: 7,
        fontWeight: 600,
        fontSize: small ? 12 : 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props) {
  return (
    <input
      {...props}
      style={{ padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7, outline: 'none', background: '#fafafa', ...props.style }}
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{ padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7, outline: 'none', background: '#fafafa' }}
    >
      {children}
    </select>
  )
}

export function Alert({ msg, type = 'error', onClose }) {
  if (!msg) return null
  const colors = {
    error:   { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
    success: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
    info:    { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  }
  const c = colors[type]
  return (
    <div style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{msg}</span>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>×</button>}
    </div>
  )
}

export function Spinner() {
  return <div style={{ color: '#9ca3af', fontSize: 13, padding: '20px 0' }}>Chargement…</div>
}
