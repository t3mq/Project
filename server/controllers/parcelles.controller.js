import db from '../config/database.ts'

// GET /parcelles
export const getAllParcelles = async (req, res, next) => {
    try {
        const [parcelles] = await db.query('SELECT * FROM parcelle ORDER BY id_parcelle')
        const [cultures] = await db.query('SELECT * FROM culture')

        const result = parcelles.map(p => ({
            ...p,
            cultures: cultures.filter(c => c.id_parcelle === p.id_parcelle),
        }))

        res.json(result)
    } catch (err) {
        next(err)
    }
}

// GET /parcelles/:id
export const getParcelleById = async (req, res, next) => {
    try {
        const [[parcelle]] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [req.params.id])

        if (!parcelle) return res.status(404).json({ error: 'Parcelle non trouvée' })

        const [cultures] = await db.query('SELECT * FROM culture WHERE id_parcelle = ?', [req.params.id])
        res.json({ ...parcelle, cultures })
    } catch (err) {
        next(err)
    }
}

// POST /parcelles
export const createParcelle = async (req, res, next) => {
    const { nom, surface, latitude, longitude, description, id_utilisateur } = req.body
    try {
        const [result] = await db.query(
            'INSERT INTO parcelle (nom, surface, latitude, longitude, description, date_creation, id_utilisateur) VALUES (?, ?, ?, ?, ?, CURDATE(), ?)',
            [nom, surface, latitude, longitude, description ?? null, id_utilisateur]
        )
        const [[parcelle]] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [result.insertId])
        res.status(201).json(parcelle)
    } catch (err) {
        next(err)
    }
}

// PUT /parcelles/:id
export const updateParcelle = async (req, res, next) => {
    const { nom, surface, latitude, longitude, description } = req.body
    try {
        await db.query(
            'UPDATE parcelle SET nom = ?, surface = ?, latitude = ?, longitude = ?, description = ? WHERE id_parcelle = ?',
            [nom, surface, latitude, longitude, description ?? null, req.params.id]
        )
        const [[parcelle]] = await db.query('SELECT * FROM parcelle WHERE id_parcelle = ?', [req.params.id])
        res.json(parcelle)
    } catch (err) {
        next(err)
    }
}

// DELETE /parcelles/:id
export const deleteParcelle = async (req, res, next) => {
    try {
        await db.query('DELETE FROM parcelle WHERE id_parcelle = ?', [req.params.id])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}
