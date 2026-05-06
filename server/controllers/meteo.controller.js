import db from '../config/database.js'

// GET /meteo?limit=7&id_parcelle=1
export const getMeteo = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 30
        const idParcelle = req.query.id_parcelle

        let query, params
        if (idParcelle) {
            query = 'SELECT * FROM meteo WHERE id_parcelle = ? ORDER BY date_meteo DESC LIMIT ?'
            params = [idParcelle, limit]
        } else {
            // Moyenne globale sur toutes les parcelles par jour
            query = `
                SELECT
                    date_meteo,
                    ROUND(AVG(temperature), 1) AS temperature,
                    ROUND(AVG(humidite), 1)    AS humidite,
                    ROUND(AVG(precipitation), 1) AS precipitation,
                    ROUND(AVG(vent), 1)        AS vent
                FROM meteo
                GROUP BY date_meteo
                ORDER BY date_meteo DESC
                LIMIT ?
            `
            params = [limit]
        }

        const [rows] = await db.query(query, params)
        res.json(rows)
    } catch (err) {
        next(err)
    }
}

// GET /meteo/latest
export const getLatestMeteo = async (req, res, next) => {
    try {
        const [[row]] = await db.query(`
            SELECT
                date_meteo,
                ROUND(AVG(temperature), 1) AS temperature,
                ROUND(AVG(humidite), 1)    AS humidite,
                ROUND(AVG(precipitation), 1) AS precipitation,
                ROUND(AVG(vent), 1)        AS vent
            FROM meteo
            WHERE date_meteo = (SELECT MAX(date_meteo) FROM meteo)
        `)
        res.json(row)
    } catch (err) {
        next(err)
    }
}
