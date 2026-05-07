import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/database.js'

export const register = async (req, res, next) => {
    const { nom, prenom, email, mot_de_passe, role } = req.body

    try {
        if (!nom || !prenom || !email || !mot_de_passe) return res.status(400).json({ error: 'Champs manquants' })

        const [existing] = await db.query('SELECT id_utilisateur FROM utilisateur WHERE email = ?', [email])
        if (existing.length) return res.status(409).json({ error: 'Email déjà utilisé' })

        const hashed = await bcrypt.hash(mot_de_passe, 10)
        const userRole = role ?? 'agriculteur'
        const [result] = await db.query(
            'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashed, userRole]
        )

        const token = jwt.sign(
            { id: result.insertId, email, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.status(201).json({ token, user: { id: result.insertId, nom, prenom, email, role: userRole } })
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    const { email, mot_de_passe } = req.body

    try {
        if (!email || !mot_de_passe) return res.status(400).json({ error: 'Champs manquants' })

        const [rows] = await db.query('SELECT * FROM utilisateur WHERE email = ?', [email])
        if (!rows.length) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

        const user = rows[0]
        const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
        if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
        
        const token = jwt.sign(
            { id: user.id_utilisateur, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.json({ token, user: { id: user.id_utilisateur, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }})
    } catch (err) {
        next(err)
    }
}

export const me = async (req, res, next) => {
    try {
        const userId = req?.user?.id
        if (!userId) return res.status(401).json({ error: 'Non autorisé' })

        const [rows] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, role FROM utilisateur WHERE id_utilisateur = ?',
            [userId]
        )
        if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' })
        res.json({ user: rows[0] })
    } catch (err) {
        next(err)
    }
}