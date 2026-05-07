# Dashboard Agricole

Application web de gestion des données agricoles : suivi des parcelles, cultures, alertes météo et observations terrain.

---

## Fonctionnalités

- **Dashboard** : Vue d'ensemble des données clés (parcelles, alertes, météo).
- **Gestion des parcelles** : Ajout, modification, suppression et visualisation des parcelles.
- **Gestion des cultures** : Suivi des cultures, dates de semis et récolte, statut.
- **Alertes** : Détection automatique basée sur des règles métier prédéfinies.
- **Météo** : Consultation des données météorologiques actuelles et historiques.
- **Observations** : Ajout et suivi des observations sur les cultures.

---

## Structure du projet

```
projet/
├── front/                  → Frontend (React + Vite)
│   ├── src/                → Code source React
│   ├── public/             → Fichiers statiques
│   └── vite.config.js      → Configuration de Vite
├── server/                 → Backend (Node.js + Express)
│   ├── routes/             → Définition des routes API
│   ├── controllers/        → Logique des contrôleurs
│   ├── config/             → Configuration (ex. base de données)
│   └── server.js           → Point d'entrée du serveur
└── BDD/                    → Scripts SQL
    ├── schema.sql          → Structure des tables
    └── data.sql            → Données initiales
```

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- MySQL (via XAMPP ou autre)
- npm

---

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd <nom-du-repo>
```

### 2. Installer le backend

```bash
cd server
npm install
```

### 3. Installer le frontend

```bash
cd ../front
npm install
```

---

## Base de données

1. Lancer MySQL (XAMPP → Start MySQL)
2. Ouvrir [phpMyAdmin](http://localhost/phpmyadmin)
3. Créer une base de données `agriculture_db`
4. Importer dans cet ordre :
   - `BDD/schema.sql`
   - `BDD/data.sql`

---

## Démarrage

### Backend (terminal 1)

```bash
cd server
npm start
```

→ API disponible sur `http://localhost:3000`

### Frontend (terminal 2)

```bash
cd front
npm run dev
```

→ Application disponible sur `http://localhost:5173`

---

## API — Endpoints

### Parcelles

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/parcelles` | Récupère toutes les parcelles |
| GET | `/api/parcelles/:id` | Récupère une parcelle |
| POST | `/api/parcelles` | Crée une parcelle |
| PUT | `/api/parcelles/:id` | Modifie une parcelle |
| DELETE | `/api/parcelles/:id` | Supprime une parcelle |

### Cultures

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/cultures` | Récupère toutes les cultures |
| GET | `/api/cultures/:id` | Récupère une culture |
| POST | `/api/cultures` | Crée une culture |
| PUT | `/api/cultures/:id` | Modifie une culture |
| DELETE | `/api/cultures/:id` | Supprime une culture |

### Météo

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/meteo` | Récupère toutes les données météo |
| GET | `/api/meteo?days=7` | Récupère les N derniers jours |

### Alertes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/alertes` | Récupère toutes les alertes |
| POST | `/api/alertes/run` | Déclenche le moteur de règles |

---

## Exemple de réponse

### `GET /api/parcelles`

```json
[
  {
    "id_parcelle": 1,
    "nom": "Parcelle A",
    "surface": 2.5,
    "latitude": 48.82,
    "longitude": 2.31,
    "description": "Zone A",
    "date_creation": "2026-01-01"
  }
]
```

---

## Base de données — Tables

| Table | Description |
|-------|-------------|
| `utilisateur` | Gestion des utilisateurs |
| `parcelle` | Gestion des parcelles |
| `culture` | Gestion des cultures |
| `meteo` | Données météorologiques |
| `alerte` | Alertes générées |
| `regle_alerte` | Règles métier |
| `observation` | Observations terrain |
| `historique_culture` | Historique des changements de statut |

---

## Technologies

| Couche | Technologies |
|--------|-------------|
| Frontend | React, Vite, Leaflet |
| Backend | Node.js, Express, mysql2 |
| Base de données | MySQL |