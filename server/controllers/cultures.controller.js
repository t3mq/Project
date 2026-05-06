import db from '../config/database.js'

export const getAllCultures = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, p.nom AS parcelle_nom,
                   tc.nom AS type_culture_nom, tc.couleur AS type_culture_couleur
            FROM culture c
            JOIN parcelle p ON c.id_parcelle = p.id_parcelle
            LEFT JOIN type_culture tc ON c.id_type_culture = tc.id_type_culture
        `)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getCultureById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, p.nom AS parcelle_nom,
                   tc.nom AS type_culture_nom, tc.couleur AS type_culture_couleur
            FROM culture c
            JOIN parcelle p ON c.id_parcelle = p.id_parcelle
            LEFT JOIN type_culture tc ON c.id_type_culture = tc.id_type_culture
            WHERE c.id_culture = ?
        `, [req.params.id])
        if (!rows.length) return res.status(404).json({ error: 'Culture non trouvée'})
        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

export const createCulture = async (req, res) => {
    const { nom, variete, date_semis, date_recolte_prevue, statut, id_parcelle, id_type_culture } = req.body
    try {
        const [result] = await db.query(`
            INSERT INTO culture (nom, variete, date_semis, date_recolte_prevue, statut, id_parcelle, id_type_culture)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [nom, variete ?? null, date_semis, date_recolte_prevue ?? null, statut ?? 'en cours', id_parcelle, id_type_culture ?? null])
        res.status(201).json({ id_culture: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateCulture = async (req, res) => {
    const { nom, variete, date_semis, date_recolte_prevue, statut, id_type_culture } = req.body

    try {
        await db.query(`
            UPDATE culture
            SET nom = ?, variete = ?, date_semis = ?, date_recolte_prevue = ?, statut = ?, id_type_culture = ?
            WHERE id_culture = ?
        `, [nom, variete ?? null, date_semis, date_recolte_prevue ?? null, statut, id_type_culture ?? null, req.params.id])
        res.json({ message: 'Culture mise à jour' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const deleteCulture = async (req, res) => {
    try {
        await db.query('DELETE FROM culture WHERE id_culture = ?', [req.params.id])
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}