const db = require('../config/database.ts').default;

// GET toutes les parcelles
exports.getAllParcelles = async (req, res) => {
    try {
        const [parcelles] = await db.query('SELECT * FROM parcelle');
        const [cultures] = await db.query('SELECT * FROM culture');

        const parcellesAvecCultures = parcelles.map(parcelle => ({
            ...parcelle,
            cultures: cultures.filter(culture => culture.id_parcelle === parcelle.id_parcelle)
        }));

        res.json(parcellesAvecCultures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET une parcelle
exports.getParcelleById = async (req, res) => {
    const { id } = req.params;

    try {
        const [parcelles] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [parseInt(id)]);

        if (!parcelles.length) {
            return res.status(404).json({ message: "Parcelle non trouvée" });
        }

        const [cultures] = await db.query('SELECT * FROM culture WHERE id_parcelle = ?', [parseInt(id)]);
        const parcelle = { ...parcelles[0], cultures };

        res.json(parcelle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST créer une parcelle
exports.createParcelle = async (req, res) => {
    const { nom, surface, latitude, longitude, description, id_utilisateur } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO parcelle (nom, surface, latitude, longitude, description, date_creation, id_utilisateur) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [nom, surface, latitude, longitude, description, id_utilisateur]
        );

        const [rows] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT modifier une parcelle
exports.updateParcelle = async (req, res) => {
    const { id } = req.params;
    const { nom, surface, latitude, longitude, description } = req.body;

    try {
        await db.query(
            'UPDATE parcelle SET nom = ?, surface = ?, latitude = ?, longitude = ?, description = ? WHERE id_parcelle = ?',
            [nom, surface, latitude, longitude, description, parseInt(id)]
        );

        const [rows] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [parseInt(id)]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE supprimer une parcelle
exports.deleteParcelle = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM parcelle WHERE id_parcelle = ?', [parseInt(id)]);
        res.json({ message: "Parcelle supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};