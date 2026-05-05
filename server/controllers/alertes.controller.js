const db = require('../config/database.ts').default;

// GET /alertes
exports.getAlertes = async (req, res) => {
    try {
        const [alertes] = await db.query(`
            SELECT a.*, c.nom AS culture_nom, r.nom AS regle_nom
            FROM alerte a
            LEFT JOIN culture c ON a.id_culture = c.id_culture
            LEFT JOIN regle_alerte r ON a.id_regle = r.id_regle
            ORDER BY a.date_alerte DESC
        `);

        res.json(alertes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /alertes/run
exports.runAlertes = async (req, res) => {
    try {
        const [regles] = await db.query('SELECT * FROM regle_alerte');
        const [meteos] = await db.query('SELECT * FROM meteo ORDER BY date_meteo DESC LIMIT 1');
        const [cultures] = await db.query('SELECT * FROM culture WHERE statut = "en cours"');

        if (!meteos.length) {
            return res.json([]);
        }

        const meteo = meteos[0];
        const alertesCreees = [];

        for (const culture of cultures) {
            for (const regle of regles) {
                const valeur = meteo[regle.parametre];
                if (valeur === undefined) continue;

                let declenchee = false;
                switch (regle.operateur) {
                    case '>': declenchee = valeur > regle.seuil; break;
                    case '<': declenchee = valeur < regle.seuil; break;
                    case '>=': declenchee = valeur >= regle.seuil; break;
                    case '<=': declenchee = valeur <= regle.seuil; break;
                    case '=': declenchee = valeur === regle.seuil; break;
                }

                if (!declenchee) continue;

                const [existing] = await db.query(
                    'SELECT id_alerte FROM alerte WHERE id_culture = ? AND id_regle = ? AND statut = "active"',
                    [culture.id_culture, regle.id_regle]
                );

                if (existing.length) continue;

                await db.query(
                    'INSERT INTO alerte (date_alerte, type_alerte, message, niveau, statut, id_culture, id_regle) VALUES (NOW(), ?, ?, ?, "active", ?, ?)',
                    [regle.nom, regle.message_template, regle.niveau, culture.id_culture, regle.id_regle]
                );

                alertesCreees.push({ culture: culture.nom, regle: regle.nom, niveau: regle.niveau });
            }
        }

        res.json(alertesCreees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};