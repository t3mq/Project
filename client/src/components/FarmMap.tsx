import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Parcel } from '../data'

interface FarmMapProps {
  parcels: Parcel[]
  style?: string
  selectedId?: string
  palette?: Record<string, string>
  onSelect?: (parcel: Parcel) => void
}

const STATUS_STYLE: Record<string, { color: string; fillColor: string; label: string }> = {
  healthy: { color: '#047857', fillColor: '#059669', label: 'Sain' },
  warning: { color: '#b45309', fillColor: '#d97706', label: 'Attention' },
  alert:   { color: '#b91c1c', fillColor: '#dc2626', label: 'Alerte' },
}

function buildPolygon(p: Parcel): L.LatLngTuple[] {
  const side_m = Math.sqrt(p.area * 10_000)
  const halfLat = (side_m * 0.55) / 111_000
  const halfLon = (side_m * 0.70) / (111_000 * Math.cos(p.lat * Math.PI / 180))
  const skew = (p.id.charCodeAt(1) % 3) * 0.0001
  return [
    [p.lat + halfLat + skew, p.lon - halfLon],
    [p.lat + halfLat, p.lon + halfLon],
    [p.lat - halfLat - skew, p.lon + halfLon],
    [p.lat - halfLat, p.lon - halfLon],
  ]
}

function buildPopup(p: Parcel, cfg: { color: string; fillColor: string; label: string }): string {
  const hc = p.health >= 85 ? '#047857' : p.health >= 65 ? '#b45309' : '#b91c1c'
  return `
    <div style="font-family:'Inter',system-ui,sans-serif;min-width:180px;padding:2px 0;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div style="font-weight:700;font-size:13px;color:#0c0c0c;letter-spacing:-0.01em;">${p.name}</div>
        <span style="background:${cfg.fillColor}18;color:${cfg.color};padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;white-space:nowrap;">${cfg.label}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;line-height:1.7;">
        <tr><td style="color:#a3a3a3;width:75px;">Culture</td><td style="font-weight:600;color:#0c0c0c;">${p.crop}</td></tr>
        <tr><td style="color:#a3a3a3;">Surface</td><td style="font-weight:600;color:#0c0c0c;">${p.area} ha</td></tr>
        <tr><td style="color:#a3a3a3;">Sante</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;">
              <div style="flex:1;height:4px;background:#f0f0f0;border-radius:4px;overflow:hidden;">
                <div style="width:${p.health}%;height:100%;background:${hc};border-radius:4px;"></div>
              </div>
              <span style="font-weight:700;color:${hc};font-size:11px;">${p.health}%</span>
            </div>
          </td>
        </tr>
      </table>
    </div>`
}

export const FarmMap = ({ parcels, onSelect }: FarmMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const center: [number, number] = parcels.length
      ? [
          parcels.reduce((s, p) => s + p.lat, 0) / parcels.length,
          parcels.reduce((s, p) => s + p.lon, 0) / parcels.length,
        ]
      : [48.556, 2.495]

    const map = L.map(el, { center, zoom: 14 })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    parcels.forEach(p => {
      const cfg = STATUS_STYLE[p.status] ?? STATUS_STYLE.healthy
      const coords = buildPolygon(p)

      const polygon = L.polygon(coords, {
        color: cfg.color,
        fillColor: cfg.fillColor,
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map)

      polygon.bindPopup(buildPopup(p, cfg), { maxWidth: 260, className: 'dashfarm-popup' })

      polygon.on('mouseover', () => polygon.setStyle({ fillOpacity: 0.55, weight: 3 }))
      polygon.on('mouseout', () => polygon.setStyle({ fillOpacity: 0.35, weight: 2 }))
      if (onSelect) polygon.on('click', () => onSelect(p))

      const labelHtml = `
        <div style="
          background:rgba(255,255,255,0.95);
          backdrop-filter:blur(8px);
          border:1.5px solid ${cfg.color}44;
          border-radius:8px;
          padding:4px 10px;
          font-family:'Inter',system-ui,sans-serif;
          text-align:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.12);
          white-space:nowrap;
        ">
          <div style="font-size:10px;font-weight:700;color:${cfg.color};letter-spacing:0.02em;">${p.id}</div>
          <div style="font-size:9px;color:#525252;margin-top:1px;">${p.crop} · ${p.area}ha</div>
        </div>`

      L.marker([p.lat, p.lon], {
        icon: L.divIcon({
          className: '',
          html: labelHtml,
          iconSize: [80, 40],
          iconAnchor: [40, 20],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [parcels])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}
