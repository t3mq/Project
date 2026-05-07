export interface Parcel {
  id: string;
  name: string;
  crop: string;
  area: number;
  status: 'healthy' | 'warning' | 'alert';
  health: number;
  x: number;
  y: number;
  w: number;
  h: number;
  lat: number;
  lon: number;
}

export interface Alert {
  id: number;
  level: 'critical' | 'warning' | 'info';
  icon: string;
  title: string;
  parcel: string;
  time: string;
  action: string;
}

export const FARM_DATA = {
  user: { name: 'Robert Doe', email: 'robert@lafermeenfollie.fr', initials: 'RD' },
  farm: { name: 'La ferme en follie', location: 'Beauce, Eure-et-Loir' },
  kpis: {
    parcelsActive: { value: 14, total: 16, delta: '+2 ce mois', trend: 'up' },
    health: { value: 87, delta: '+3% vs sem. dernière', trend: 'up' },
    alerts: { value: 4, critical: 1, delta: '2 nouvelles aujourd\'hui', trend: 'down' },
    weather: { temp: 18, rain: 12, condition: 'Averses', forecast: 'Pluie ce soir' },
  },
  parcels: [
    { id: 'P01', name: 'La Grande Plaine', crop: 'Blé',   area: 18.4, status: 'healthy', health: 91, x: 30, y: 40, w: 20, h: 15, lat: 48.5415, lon: 2.4885 },
    { id: 'P02', name: 'Champ de l\'Est', crop: 'Colza', area: 14.2, status: 'warning', health: 68, x: 65, y: 45, w: 18, h: 13, lat: 48.5398, lon: 2.5045 },
  ] as Parcel[],
  alerts: [
    { id: 1, level: 'critical', icon: 'disease', title: 'Risque de mildiou détecté',       parcel: 'Pré du Moulin',    time: 'Il y a 12 min', action: 'Inspecter' },
    { id: 2, level: 'warning',  icon: 'water',   title: 'Irrigation recommandée',           parcel: 'Bois-Renard',      time: 'Il y a 1h',    action: 'Programmer' },
    { id: 3, level: 'warning',  icon: 'pest',    title: 'Activité d\'insectes anormale',    parcel: 'Le Verger Bas',    time: 'Il y a 3h',    action: 'Observer' },
    { id: 4, level: 'info',     icon: 'weather', title: 'Gel possible cette nuit',          parcel: 'Toutes parcelles', time: 'Il y a 5h',    action: 'Voir bulletin' },
  ] as Alert[],
  humidity7d: [
    { day: 'Lun', value: 42 },
    { day: 'Mar', value: 38 },
    { day: 'Mer', value: 45 },
    { day: 'Jeu', value: 51 },
    { day: 'Ven', value: 47 },
    { day: 'Sam', value: 39 },
    { day: 'Dim', value: 44 },
  ],
  forecast7d: [
    { day: 'Auj.', icon: 'rain',  high: 18, low: 11, rain: 12 },
    { day: 'Mar',  icon: 'cloud', high: 19, low: 10, rain: 4 },
    { day: 'Mer',  icon: 'sun',   high: 22, low: 12, rain: 0 },
    { day: 'Jeu',  icon: 'sun',   high: 24, low: 14, rain: 0 },
    { day: 'Ven',  icon: 'cloud', high: 21, low: 13, rain: 2 },
    { day: 'Sam',  icon: 'rain',  high: 17, low: 11, rain: 8 },
    { day: 'Dim',  icon: 'storm', high: 16, low: 10, rain: 14 },
  ],
  current: { temp: 18, humidity: 64, wind: 12, windDir: 'NO', uv: 4, pressure: 1014 },
};

export const STATUS_COLOR = {
  healthy: { fill: '#7CB342', stroke: '#558B2F', text: 'Sain',      bg: '#EAF4DB' },
  warning: { fill: '#F2A93B', stroke: '#C77800', text: 'Attention', bg: '#FCEFD6' },
  alert:   { fill: '#E04F3F', stroke: '#A8281A', text: 'Alerte',    bg: '#FBE3DF' },
};
