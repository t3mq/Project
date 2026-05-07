import db from '../config/database.js'

// Migrations au démarrage (async IIFE pour compatibilité CJS)
;(async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS type_culture (
            id_type_culture INT AUTO_INCREMENT PRIMARY KEY,
            nom             VARCHAR(100) NOT NULL,
            description     TEXT,
            couleur         VARCHAR(7) DEFAULT '#4D7C2F',
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
    await db.query(`ALTER TABLE culture ADD COLUMN id_type_culture INT NULL`).catch(e => {
        if (e.errno !== 1060) throw e
    })
    await db.query(`
        ALTER TABLE culture
        ADD CONSTRAINT fk_culture_type_culture
            FOREIGN KEY (id_type_culture) REFERENCES type_culture(id_type_culture) ON DELETE SET NULL
    `).catch(e => {
        // ignore errors if constraint already exists or duplicate key
        if (e.errno !== 1826 && e.errno !== 1061 && e.errno !== 1005 && e.errno !== 121) throw e
    })
})()

export const getAllTypeCultures = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM type_culture ORDER BY nom')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const createTypeCulture = async (req, res) => {
    const { nom, description, couleur } = req.body
    if (!nom) return res.status(400).json({ error: 'Le nom est requis' })
    try {
        const [result] = await db.query(
            'INSERT INTO type_culture (nom, description, couleur) VALUES (?, ?, ?)',
            [nom, description ?? null, couleur ?? '#4D7C2F']
        )
        const [rows] = await db.query('SELECT * FROM type_culture WHERE id_type_culture = ?', [result.insertId])
        res.status(201).json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateTypeCulture = async (req, res) => {
    const { nom, description, couleur } = req.body
    if (!nom) return res.status(400).json({ error: 'Le nom est requis' })
    try {
        await db.query(
            'UPDATE type_culture SET nom = ?, description = ?, couleur = ? WHERE id_type_culture = ?',
            [nom, description ?? null, couleur ?? '#4D7C2F', req.params.id]
        )
        const [rows] = await db.query('SELECT * FROM type_culture WHERE id_type_culture = ?', [req.params.id])
        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const deleteTypeCulture = async (req, res) => {
    try {
        await db.query('DELETE FROM type_culture WHERE id_type_culture = ?', [req.params.id])
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
