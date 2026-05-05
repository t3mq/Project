import express from 'express'
import db from '../config/database.ts'

const router = express.Router()

// GET /observations?id_culture=1
router.get('/', async (req, res, next) => {
    try {
        const idCulture = req.query.id_culture
        let query = `
            SELECT o.*, c.nom AS culture_nom, p.nom AS parcelle_nom
            FROM observation o
            JOIN culture c ON o.id_culture = c.id_culture
            JOIN parcelle p ON c.id_parcelle = p.id_parcelle
        `
        const params = []
        if (idCulture) {
            query += ' WHERE o.id_culture = ?'
            params.push(idCulture)
        }
        query += ' ORDER BY o.date_observation DESC'

        const [rows] = await db.query(query, params)
        res.json(rows)
    } catch (err) {
        next(err)
    }
})

// GET /observations/:id
router.get('/:id', async (req, res, next) => {
    try {
        const [[row]] = await db.query('SELECT * FROM observation WHERE id_observation = ?', [req.params.id])
        if (!row) return res.status(404).json({ error: 'Observation non trouvée' })
        res.json(row)
    } catch (err) {
        next(err)
    }
})

export default router
