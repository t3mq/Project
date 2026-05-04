INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Martin', 'Jean', 'jean.martin@agricole.fr', 'hashed_password_1', 'agriculteur'),
('Dupont', 'Marie', 'marie.dupont@agricole.fr', 'hashed_password_2', 'agriculteur'),
('Bernard', 'Pierre', 'pierre.bernard@agricole.fr', 'hashed_password_3', 'admin');

INSERT INTO parcelle (nom, surface, latitude, longitude, description, date_creation, id_utilisateur) VALUES
('Parcelle Nord', 4.5, 48.8566, 2.3522, 'Parcelle en bordure de forêt', '2024-01-15', 1),
('Parcelle Sud', 2.8, 48.8489, 2.3541, 'Terrain argileux, bien drainé', '2024-01-15', 1),
('Grand Champ', 7.2, 48.8601, 2.3498, 'Parcelle principale exploitation', '2024-02-01', 2),
('Champ Est', 3.1, 48.8550, 2.3610, 'Zone légèrement en pente', '2024-02-10', 2);

INSERT INTO culture (nom, variete, date_semis, date_recolte_prevue, statut, id_parcelle) VALUES
('Blé tendre', 'Apache', '2024-10-15', '2025-07-01', 'en cours', 1),
('Maïs', 'DKC4608', '2024-04-20', '2024-10-15', 'terminée', 2),
('Colza', 'Trezzor', '2024-08-25', '2025-06-20', 'en cours', 3),
('Orge', 'Etincel', '2024-10-01', '2025-06-15', 'en cours', 4);

INSERT INTO observation (date_observation, type, description, valeur, unite, id_culture, id_utilisateur) VALUES
('2025-01-10', 'visuelle', 'Légère chlorose sur feuilles', 3.5, 'niveau', 1, 1),
('2025-01-15', 'terrain', 'Humidité sol correcte, pas de stress hydrique', 68.0, '%', 1, 1),
('2025-02-01', 'visuelle', 'Développement homogène, tallage en cours', NULL, NULL, 1, 2),
('2025-01-20', 'terrain', 'Présence de limaces sur rangs', 2.0, 'niveau', 3, 1),
('2025-02-05', 'laboratoire', 'Teneur en azote feuilles', 42.0, 'kg/ha', 3, 2),
('2025-01-25', 'visuelle', 'Culture bien levée, densité satisfaisante', NULL, NULL, 4, 1);

INSERT INTO meteo (date_meteo, temperature_min, temperature_max, humidite, precipitation, vent, id_parcelle) VALUES
('2025-01-10', 2.0, 8.5, 85.0, 5.2, 18.0, 1),
('2025-01-11', 1.5, 7.0, 90.0, 12.4, 22.0, 1),
('2025-01-12', 0.0, 5.5, 92.0, 8.0, 15.0, 1),
('2025-01-10', 1.8, 8.0, 87.0, 6.0, 20.0, 2),
('2025-01-11', 1.2, 6.5, 91.0, 11.0, 24.0, 2),
('2025-01-10', 2.5, 9.0, 83.0, 4.5, 16.0, 3),
('2025-01-11', 2.0, 8.0, 88.0, 9.0, 19.0, 3),
('2025-01-10', 1.0, 7.5, 89.0, 7.0, 21.0, 4);

INSERT INTO regle_alerte (nom, parametre, operateur, seuil, niveau, message_template) VALUES
('Humidité critique', 'humidite', '>=', 90.0, 'danger', 'Humidité trop élevée : risque de maladies fongiques'),
('Gel imminent', 'temperature_min', '<=', 0.0, 'danger', 'Température négative détectée : risque de gel sur les cultures'),
('Fortes pluies', 'precipitation', '>=', 10.0, 'warning', 'Précipitations importantes : surveiller le drainage'),
('Vent fort', 'vent', '>=', 50.0, 'warning', 'Vents forts prévus : risque de verse'),
('Sécheresse', 'humidite', '<=', 30.0, 'danger', 'Humidité trop faible : risque de stress hydrique');

INSERT INTO alerte (date_alerte, type_alerte, message, niveau, statut, id_culture, id_regle) VALUES
('2025-01-11 08:00:00', 'maladie', 'Humidité trop élevée : risque de maladies fongiques', 'danger', 'active', 1, 1),
('2025-01-12 06:30:00', 'gel', 'Température négative détectée : risque de gel sur les cultures', 'danger', 'résolue', 1, 2),
('2025-01-11 08:00:00', 'maladie', 'Humidité trop élevée : risque de maladies fongiques', 'danger', 'active', 3, 1),
('2025-01-11 09:00:00', 'pluie', 'Précipitations importantes : surveiller le drainage', 'warning', 'résolue', 4, 3);

INSERT INTO historique_culture (statut, date_changement, commentaire, id_culture) VALUES
('en cours', '2024-10-15 00:00:00', 'Semis effectué dans de bonnes conditions', 1),
('en cours', '2024-11-10 00:00:00', 'Levée homogène constatée', 1),
('en cours', '2024-04-20 00:00:00', 'Semis maïs réalisé', 2),
('terminée', '2024-10-15 00:00:00', 'Récolte effectuée, rendement 9.2 t/ha', 2),
('en cours', '2024-08-25 00:00:00', 'Semis colza réalisé', 3),
('en cours', '2024-10-01 00:00:00', 'Semis orge réalisé', 4);