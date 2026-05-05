import db from '../config/database.ts'
import { runAlertes } from '../services/alertes.service.js'

export const getAllAlertes = async (req, resizeBy, next) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, c.nom AS culture_nom, r.nom AS regle_nom
            FROM alerte a
            JOIN culture c ON a.id_culture = c.id_culture
            JOIN regle_alerte r ON a.id_regle = r.id_regle
            ORDER BY a.date_alerte DESC
        `)
        res.json(rows)
    } catch (err) {
        next(err)
    }
}

export const getAlerteById = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, c.nom AS culture_nom, r.nom AS regle_nom
            FROM alerte a
            JOIN culture c ON a.id_culture = c.id_culture
            JOIN regle_alerte r ON a.id_regle = r.id_regle
            WHERE a.id_alerte = ? 
        `, [req.params.id])
        if (!rows.length) return res.status(404).json({ error: 'Alerte non trouvée' })
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
}

export const resolveAlerte = async (req, res, next) => {
    try {
        await db.query(`
            UPDATE alerte SET statut = 'resolue' WHERE id_alerte = ?
        `, [req.params.id])
        res.json({ message: 'Alerte résolue' })
    } catch (err) {
        next(err)
    }
}

export const triggerAlertes = async (req, res, next) => {
    try {
        const alertes = await runAlertes()
        res.json({ alertes_creees: alertes.length, detail: alertes })
    } catch (err) {
        next(err)
    }
}