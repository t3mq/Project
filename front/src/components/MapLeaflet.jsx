import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon path for leaflet when using bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default function MapLeaflet({ parcelles = [] }) {
  const center = parcelles.length
    ? [parcelles[0].latitude, parcelles[0].longitude]
    : [46.8, 2.4] // fallback center (France)

  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parcelles.map(p => (
        <Marker key={p.id_parcelle} position={[p.latitude, p.longitude]}>
          <Popup>
            <strong>{p.nom}</strong><br />{p.surface} ha
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
