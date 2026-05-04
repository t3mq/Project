CREATE TABLE utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agriculteur'
);

CREATE TABLE parcelle (
    id_parcelle INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    surface FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    description TEXT,
    date_creation DATE NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE culture (
    id_culture INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    variete VARCHAR(100),
    date_semis DATE NOT NULL,
    date_recolte_prevue DATE,
    statut VARCHAR(50) NOT NULL DEFAULT 'en cours',
    id_parcelle INT NOT NULL,
    FOREIGN KEY (id_parcelle) REFERENCES parcelle(id_parcelle)
);

CREATE TABLE observation (
    id_observation INT PRIMARY KEY AUTO_INCREMENT,
    date_observation DATE NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    unite VARCHAR(20),
    id_culture INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_culture) REFERENCES culture(id_culture),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE meteo (
    id_meteo INT PRIMARY KEY AUTO_INCREMENT,
    date_meteo DATE NOT NULL,
    temperature FLOAT NOT NULL,
    humidite FLOAT NOT NULL,
    precipitation FLOAT NOT NULL,
    vent FLOAT NOT NULL
);

CREATE TABLE regle_alerte (
    id_regle INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    parametre VARCHAR(100) NOT NULL,
    operateur VARCHAR(10) NOT NULL,
    seuil FLOAT NOT NULL,
    niveau VARCHAR(20) NOT NULL,
    message_template TEXT NOT NULL
);

CREATE TABLE alerte (
    id_alerte INT PRIMARY KEY AUTO_INCREMENT,
    date_alerte DATETIME NOT NULL,
    type_alerte VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    niveau VARCHAR(20) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'active',
    id_culture INT NOT NULL,
    id_regle INT NOT NULL,
    FOREIGN KEY (id_culture) REFERENCES culture(id_culture),
    FOREIGN KEY (id_regle) REFERENCES regle_alerte(id_regle)
);

CREATE TABLE historique_culture (
    id_historique INT PRIMARY KEY AUTO_INCREMENT,
    statut VARCHAR(50) NOT NULL,
    date_changement DATETIME NOT NULL,
    commentaire TEXT,
    id_culture INT NOT NULL,
    FOREIGN KEY (id_culture) REFERENCES culture(id_culture)
);