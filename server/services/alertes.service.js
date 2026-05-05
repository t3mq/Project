import db from '../config/database.ts'

export const runAlertes = async () => {
    const [regles] = await db.query('SELECT * FROM regle_alerte')
    const [meteos] = await db.query('ORDER BY date_meteo DESC LIMIT 1')
    const [cultures] = await db.query('SELECT * FROM culture WHERE statut = "en cours')

    if (!meteos.length) return []

    const meteo = meteos[0]
    const alertesCreees = []

    for (const culture of cultures) {
        for (const regle of regles) {
            const valeur = meteo[regle.parametre]
            if (valeur === undefined) continue

            let declenchee = false
            switch (regle.operateur) {
                case '>': declenchee = valeur > regle.seuil; break
                case '<': declenchee = valeur < regle.seuil; break
                case '>=': declenchee = valeur >= regle.seuil; break
                case '<=': declenchee = valeur <= regle.seuil; break
                case '=': declenchee = valeur === regle.seuil; break
            }

            if (!declenchee) continue
            
            const [existing] = await db.query(`
                SELECT id_alerte FROM alerte
                WHERE id_culture = ? AND id_regle = ? AND statut = 'active'
            `, [culture.id_culture, regle.id_regle])

            if (existing.length) continue

            await db.query(`
                INSERT INTO alerte (date_alerte, type_alerte, message, niveau, statut, id_culture, id_regle)
                VALUES (NOW(), ?, ?, ?, 'active', ?, ?)
            `, [regle.nom, regle.message_template, regle.niveau, culture.id_culture, regle.id_regle])

            alertesCreees.push({ culture: culture.nom, regle: regle.nom, niveau: regle.niveau })
        }
    }
    return alertesCreees
}