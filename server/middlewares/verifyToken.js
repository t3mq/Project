import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const header = req.heanders.authorization
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    const token = header.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré'})
    }
}

export default verifyToken