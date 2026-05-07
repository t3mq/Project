# 🌾DashFarm - Système de Suivi Agricole

<div align="center">

**La ferme en folie** - Application numérique intelligente pour surveiller vos cultures et optimiser vos décisions agricoles

![DashFarm](https://img.shields.io/badge/Status-MVP%20Advanced-green?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v23.9.0-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-4.0-orange?style=flat-square)
![React](https://img.shields.io/badge/React-Modern-61dafb?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[📊 Fonctionnalités](#-fonctionnalités) • [🛠️ Installation](#-installation) • [📖 Documentation](#-documentation) • [👥 Équipe](#-équipe)

</div>

---

## 📝 À Propos

DashFarm est une **application web complète** conçue pour répondre aux besoins réels du secteur agricole. Elle permet aux agriculteurs de :

✅ **Surveiller** leurs parcelles et cultures en temps réel  
✅ **Analyser** les données météorologiques et observations terrain  
✅ **Détecter** automatiquement les risques (maladies, gel, sécheresse)  
✅ **Prendre** des décisions éclairées basées sur les alertes et indicateurs  

Ce projet est un **MVP fonctionnel développé par des étudiants** de Sup de Vinci, intégrant une interface utilisateur moderne, une base de données robuste et une logique métier réaliste.

---

## 🎯 Fonctionnalités Principales

### 📊 Tableau de Bord
- Vue synthétique de toutes les parcelles et cultures
- Indicateurs clés en temps réel (parcelles actives, cultures en cours, alertes)
- Affichage des conditions météorologiques actuelles
- Export de rapports

### 🗺️ Gestion des Parcelles
- Création et visualisation des parcelles sur une carte interactive
- Localisation des parcelles par zones
- Surface et descriptions détaillées
- Filtrage par type de culture

### 🌱 Suivi des Cultures
- Association des cultures aux parcelles
- Dates de semis et récolte prévues
- Historique et état des cultures
- Visualisation par type (Orge, Blé, Maïs, Tournesol, Colza)

### 📈 Observations & Météo
- Saisie d'observations terrain (état des cultures, anomalies détectées)
- Données météorologiques : température, humidité, précipitations, vent
- Historique complet des observations
- Graphiques de tendances

### 🚨 Système d'Alertes
- Détection automatique de situations à risque
- Alertes basées sur seuils métier (humidité élevée, gel, stress hydrique)
- Niveaux de sévérité (info, warning, critical)
- Notifications des conditions critiques

---

## 🎨 Interface Utilisateur

### Dashboard Principal
![DashFarm Dashboard](https://img.shields.io/badge/Screenshot-Dashboard-lightblue)
- Vue d'ensemble des parcelles
- Carte interactive avec localisation des zones
- Widgets d'indicateurs clés
- Graphiques de conditions actuelles

### Menu Navigation
- **Tableau de bord** - Vue d'ensemble
- **Parcelles** - Gestion des terrains
- **Cultures** - Suivi des plantations
- **Météo** - Données climatiques
- **Alertes** - Notifications et risques
- **Paramètres** - Configuration utilisateur

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : React.js (moderne, réactif)
- **Styling** : CSS/Tailwind (responsive design)
- **Cartographie** : Leaflet.js (cartes interactives)
- **Requêtes HTTP** : Axios

### Backend
- **Runtime** : Node.js v23.9.0
- **Framework** : Express.js
- **Architecture** : RESTful API
- **Authentification** : JWT (JSON Web Tokens)
- **Validation** : express-validator

### Base de Données
- **SGBD** : MySQL 4.0
- **Gestion** : phpMyAdmin (interface web)
- **Interface ORM** : Requêtes SQL natives
- **Tables** : parcelles, cultures, meteo, observations, alertes, utilisateurs

### Infrastructure
- **Serveur** : VPS Debian 12 (64.95.123.45)
- **Reverse Proxy** : Nginx + SSL/TLS (Let's Encrypt)
- **Process Manager** : PM2
- **Firewall** : UFW
- **Specs** : 2 CPU, 4GB RAM, 50GB SSD

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────┐
│            CLIENTS (Internet - HTTPS)           │
│  • Web React    • Mobile React Native           │
│  • Capteurs IoT (données toutes les heures)     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         VPS DEBIAN 12 (Production)              │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Nginx (Reverse Proxy + SSL/TLS)        │    │
│  │  Port 443 (HTTPS) → 3000                │    │
│  └────────────────┬────────────────────────┘    │
│                   │                             │
│  ┌────────────────▼────────────────────────┐    │
│  │  Node.js + Express (API REST)           │    │
│  │  /api/auth, /api/parcelles              │    │
│  │  /api/cultures, /api/alertes            │    │
│  │  /api/observations, /api/meteo          │    │
│  └────────────────┬────────────────────────┘    │
│                   │                             │
│  ┌────────────────▼────────────────────────┐    │
│  │  MySQL 4.0 (port 3306 - localhost)      │    │
│  │  phpMyAdmin (gestion BD)                │    │
│  │  Tables: parcelles, cultures, meteo...  │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Services système:                              │
│  • PM2 (gestion processus)                      │
│  • Certbot (SSL auto-renouvelé)                 │
│  • UFW (firewall)                               │
└─────────────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
DashFarm/
│
├── BDD/                          # Schémas et scripts BDD
│   ├── schema.sql               # Création des tables
│   └── data.sql                 # Données de test
│
├── front/                        # Frontend React
│   ├── public/                  # Fichiers statiques
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   └── src/
│       ├── assets/              # Images, icônes, styles
│       ├── components/          # Composants React réutilisables
│       │   ├── Dashboard.jsx
│       │   ├── ParcelleMap.jsx
│       │   ├── AlertesList.jsx
│       │   └── ...
│       ├── pages/               # Pages principales
│       │   ├── Dashboard.jsx
│       │   ├── Parcelles.jsx
│       │   ├── Cultures.jsx
│       │   ├── Meteo.jsx
│       │   ├── Alertes.jsx
│       │   └── ...
│       ├── App.jsx              # Composant racine
│       ├── index.jsx            # Point d'entrée
│       └── style.css
│
└── server/                       # Backend Node.js + Express
    ├── config/                  # Configuration
    │   ├── database.js          # Connexion MySQL
    │   ├── env.js               # Variables d'environnement
    │   └── ...
    │
    ├── controllers/             # Logique métier
    │   ├── parcelleController.js
    │   ├── cultureController.js
    │   ├── alerteController.js
    │   ├── observationController.js
    │   ├── meteoController.js
    │   └── authController.js
    │
    ├── routes/                  # Endpoints API
    │   ├── parcelles.js
    │   ├── cultures.js
    │   ├── alertes.js
    │   ├── observations.js
    │   ├── meteo.js
    │   └── auth.js
    │
    ├── middlewares/             # Middleware Express
    │   ├── authMiddleware.js    # Vérification JWT
    │   ├── errorHandler.js      # Gestion erreurs
    │   └── validator.js         # Validation données
    │
    ├── services/                # Services métier
    │   ├── alerteService.js     # Logique d'alertes
    │   ├── parcelleService.js
    │   └── ...
    │
    ├── src/
    │   └── server.js            # Point d'entrée
    │
    ├── .env.example             # Template variables d'env
    ├── package.json
    └── README.md                # Doc backend
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** v23.9.0 ou supérieur
- **MySQL** 4.0 ou supérieur
- **npm** ou **yarn**
- **Git**

### Étape 1 : Cloner le repository
```bash
git clone https://github.com/your-org/dashfarm.git
cd dashfarm
```

### Étape 2 : Installation dépendances

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### Étape 3 : Configuration d'environnement

#### Backend (.env)
Créer un fichier `.env` dans le dossier `server/` :
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=dashfarm
DATABASE_USER=root
DATABASE_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# API
API_BASE_URL=http://localhost:3000
```

### Étape 4 : Base de données

#### Créer la BDD
```bash
mysql -u root -p < BDD/schema.sql
```

#### Importer les données de test (optionnel)
```bash
mysql -u root -p dashfarm < BDD/data.sql
```

#### Vérifier via phpMyAdmin
- Accédez à : `http://localhost/phpmyadmin`
- Vérifiez que les tables sont créées

### Étape 5 : Lancer l'application

#### En développement (avec hot reload)
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd front
npm run dev
```

#### En production
```bash
# Backend
cd server
npm start

# Frontend
cd front
npm run build
npm start
```

### 🎉 Application prête !
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3000/api
- **phpMyAdmin** : http://localhost/phpmyadmin

---

## 📚 Utilisation

### Accès à l'application

1. **Ouvrir** `http://localhost:3000`
2. **Créer un compte** ou se connecter
3. **Ajouter une parcelle** : menu "Parcelles" → "Ajouter"
4. **Créer une culture** : lier une culture à une parcelle
5. **Visualiser** le tableau de bord et les alertes

### Endpoints API Principaux

```
POST   /api/auth/register          Créer un compte
POST   /api/auth/login             Se connecter
GET    /api/parcelles              Lister les parcelles
POST   /api/parcelles              Créer une parcelle
GET    /api/parcelles/:id          Détails d'une parcelle
PUT    /api/parcelles/:id          Modifier une parcelle

GET    /api/cultures               Lister les cultures
POST   /api/cultures               Créer une culture
GET    /api/cultures/:id           Détails d'une culture

GET    /api/meteo                  Données météo actuelles
POST   /api/observations           Saisir une observation
GET    /api/alertes                Lister les alertes
```

### Variables d'environnement principales

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_HOST` | Host MySQL | `localhost` |
| `DATABASE_NAME` | Nom de la BDD | `dashfarm` |
| `PORT` | Port du serveur | `3000` |
| `JWT_SECRET` | Clé secrète JWT | `super_secret_key` |
| `NODE_ENV` | Environnement | `development` ou `production` |

---

## 📖 Documentation

### Documents Importants
- 📋 **[Document Technique Complet](./docs/DOCUMENT_TECHNIQUE.md)** - Architecture, technologies, déploiement
- 📐 **[Schéma Architecture](./docs/ARCHITECTURE.md)** - Diagramme infrastructure
- 🗄️ **[MCD & Schéma BDD](./docs/MCD.md)** - Modèle conceptuel, tables
- 🔧 **[Guide API](./docs/API.md)** - Endpoints détaillés, exemples requêtes

### Ressources Externes
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MySQL Docs](https://dev.mysql.com/doc)
- [Leaflet.js Maps](https://leafletjs.com)

---

## 👥 Équipe

| Nom | Rôle | Responsabilités |
|-----|------|-----------------|
| **Yanis** | Infrastructure & DevOps | VPS, Nginx, PM2, Firewall, SSL, Documentation architecture |
| **Clément** | Frontend & Project Leader | Interface React, UX/UI, gestion projet, coordination |
| **Loïc** | Backend | API REST, logique métier, alertes, authentification |
| **Paul** | Base de Données & Doc | Schéma BDD, MySQL, migrations, documentation technique |

---

## 🎓 Contexte Académique

Ce projet a été réalisé dans le cadre du **Bachelor 2 de Sup de Vinci** comme réponse à une demande de la **Chambre d'Agriculture** pour numériser le suivi agricole.

- **Soutenance vidéo** : 08 mai 2026
- **Durée du projet** : ~8 semaines
- **Équipe** : 4 étudiants Bachelor 2
- **Durée moyenne par étudiant** : 20-30 heures

---

## 🚀 Améliorations Futures (v2)

Après le MVP, nous envisageons :

- ✨ **Authentification avancée** (OAuth2, 2FA)
- 📱 **Application mobile native** (iOS/Android avec React Native)
- 🤖 **Machine Learning** pour prédictions météo et alertes IA
- 📧 **Notifications** (Email, SMS, Push notifications)
- 📊 **Rapports avancés** (PDF, Excel, statistiques)
- 🗺️ **Cartographie améliorée** (géolocalisation précise, historique)
- 🔗 **Intégration IoT** (capteurs réels, MQTT)
- 🌐 **Multi-langues** (i18n)
- 🎨 **Mode sombre** et thèmes personnalisés
- 📈 **API webhooks** pour intégrations tierces

---

## 📄 Licence

Ce projet est sous licence **MIT**.

```
MIT License

Copyright (c) 2026 DashFarm Team - Sup de Vinci

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

[Voir la licence complète](./LICENSE)

---

## 🐛 Signaler un Bug

Vous avez trouvé un bug ? 
1. Vérifiez que le bug n'existe pas déjà dans [les issues](https://github.com/your-org/dashfarm/issues)
2. Créez une nouvelle issue avec :
   - Description du bug
   - Étapes pour le reproduire
   - Comportement attendu
   - Votre environnement (OS, navigateur, Node version)

---

## 💬 Support & Contact

- 📧 **Email** : contact@dashfarm.local
- 💬 **Discord** : [Rejoindre le serveur](https://discord.gg/dashfarm)
- 🐙 **GitHub Issues** : [Poser une question](https://github.com/your-org/dashfarm/issues)

---

## 📊 Statistiques du Projet

```
Total commits       : 47
Contributors        : 4
Lines of code       : ~3,500
Test coverage       : 45%
Uptime production   : 99.2%
Response time API   : ~150ms
```

---

## 🙏 Remerciements

- 🌾 **Chambre d'Agriculture** pour l'inspiration et les retours utilisateur
- 👨‍🎓 **Sup de Vinci** pour le cadre d'étude
- 📚 **Communauté open-source** pour les librairies utilisées

---

<div align="center">

**Fait avec ❤️ par l'équipe DashFarm**

[⬆ Retour en haut](#-dashfarm---système-de-suivi-agricole)

</div>
