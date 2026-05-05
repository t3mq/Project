const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /alertes
exports.getAlertes = async (req, res) => {
    try {
        const alertes = await prisma.alerte.findMany({
            include: {
                culture: true,
                regle: true
            },
            orderBy: {
                date_alerte: 'desc'
            }
        });

        res.json(alertes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};