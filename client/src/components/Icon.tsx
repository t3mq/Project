/** Legacy icon component — used by FarmMap popups. New code uses lucide-react directly. */
interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  fill?: string
}

export const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.6, fill = 'none' }: IconProps) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }

  const paths: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    parcel:    <><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4"/><path d="M3 17l9 4 9-4"/></>,
    weather:   <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    bell:      <><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></>,
    report:    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    help:      <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>,
    logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></>,
    arrowUp:   <><path d="M7 17L17 7M17 7H8M17 7v9"/></>,
    arrowRight:<><path d="M5 12h14M13 6l6 6-6 6"/></>,
    trendUp:   <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    trendDown: <><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>,
    leaf:      <><path d="M11 20A7 7 0 014 13V5a7 7 0 0114 0v8a7 7 0 01-7 7z" fill={color} fillOpacity="0.12"/><path d="M11 20A7 7 0 014 13V5a7 7 0 0114 0v8a7 7 0 01-7 7z"/><path d="M11 20V8M8 11l3-3 3 3"/></>,
    sun:       <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    cloud:     <><path d="M17.5 19a4.5 4.5 0 100-9 6 6 0 00-11.6 1.5A4 4 0 006 19h11.5z"/></>,
    rain:      <><path d="M17.5 13a4.5 4.5 0 100-9 6 6 0 00-11.6 1.5A4 4 0 006 13h11.5z"/><path d="M8 17v3M12 17v3M16 17v3"/></>,
    storm:     <><path d="M17.5 13a4.5 4.5 0 100-9 6 6 0 00-11.6 1.5A4 4 0 006 13h11.5z"/><path d="M11 15l-2 4h3l-2 4"/></>,
    wind:      <><path d="M9.6 4.6A2 2 0 1111 8H2M12.6 19.4A2 2 0 1114 16H2M17.5 7.5A2.5 2.5 0 1119 12H2"/></>,
    disease:   <><path d="M12 2L2 22h20L12 2z"/><path d="M12 9v5M12 18h.01"/></>,
    water:     <><path d="M12 2.5s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z"/></>,
    pest:      <><ellipse cx="12" cy="13" rx="5" ry="6"/><path d="M12 7V4M9 5l-2-2M15 5l2-2M7 13H4M17 13h3M8 18l-2 2M16 18l2 2"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    chevron:   <><path d="M9 6l6 6-6 6"/></>,
    chevronD:  <><path d="M6 9l6 6 6-6"/></>,
    close:     <><path d="M18 6L6 18M6 6l12 12"/></>,
    download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></>,
    mail:      <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></>,
    filter:    <><path d="M4 5h16M7 12h10M10 19h4"/></>,
    check:     <><path d="M20 6L9 17l-5-5"/></>,
    location:  <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    menu:      <><path d="M3 12h18M3 6h18M3 18h18"/></>,
  }

  return <svg {...props}>{paths[name] ?? null}</svg>
}
