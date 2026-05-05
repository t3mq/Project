-- Création des tables MySQL pour le projet Agriculture

CREATE TABLE utilisateur (
  id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'agriculteur',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcelle (
  id_parcelle INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  surface FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  description TEXT,
  date_creation DATE DEFAULT CURDATE(),
  id_utilisateur INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE culture (
  id_culture INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  variete VARCHAR(100),
  date_semis DATE NOT NULL,
  date_recolte_prevue DATE,
  statut VARCHAR(50) DEFAULT 'en cours',
  id_parcelle INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_parcelle) REFERENCES parcelle(id_parcelle) ON DELETE CASCADE
);

CREATE TABLE observation (
  id_observation INT AUTO_INCREMENT PRIMARY KEY,
  date_observation DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  unite VARCHAR(20),
  id_culture INT NOT NULL,
  id_utilisateur INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_culture) REFERENCES culture(id_culture) ON DELETE CASCADE,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE meteo (
  id_meteo INT AUTO_INCREMENT PRIMARY KEY,
  date_meteo DATE NOT NULL,
  temperature FLOAT NOT NULL,
  humidite FLOAT NOT NULL,
  precipitation FLOAT NOT NULL,
  vent FLOAT NOT NULL,
  id_parcelle INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_parcelle) REFERENCES parcelle(id_parcelle) ON DELETE CASCADE
);

CREATE TABLE regle_alerte (
  id_regle INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  parametre VARCHAR(100) NOT NULL,
  operateur VARCHAR(10) NOT NULL,
  seuil FLOAT NOT NULL,
  niveau VARCHAR(20) NOT NULL,
  message_template TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerte (
  id_alerte INT AUTO_INCREMENT PRIMARY KEY,
  date_alerte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type_alerte VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  niveau VARCHAR(20) NOT NULL,
  statut VARCHAR(20) DEFAULT 'active',
  id_culture INT NOT NULL,
  id_regle INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_culture) REFERENCES culture(id_culture) ON DELETE CASCADE,
  FOREIGN KEY (id_regle) REFERENCES regle_alerte(id_regle) ON DELETE CASCADE
);

CREATE TABLE historique_culture (
  id_historique INT AUTO_INCREMENT PRIMARY KEY,
  statut VARCHAR(50) NOT NULL,
  date_changement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  commentaire TEXT,
  id_culture INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_culture) REFERENCES culture(id_culture) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_parcelle_utilisateur ON parcelle(id_utilisateur);
CREATE INDEX idx_culture_parcelle ON culture(id_parcelle);
CREATE INDEX idx_observation_culture ON observation(id_culture);
CREATE INDEX idx_observation_utilisateur ON observation(id_utilisateur);
CREATE INDEX idx_meteo_parcelle ON meteo(id_parcelle);
CREATE INDEX idx_alerte_culture ON alerte(id_culture);
CREATE INDEX idx_alerte_regle ON alerte(id_regle);
CREATE INDEX idx_historique_culture ON historique_culture(id_culture);
