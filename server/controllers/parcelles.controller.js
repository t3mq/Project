const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET toutes les parcelles
exports.getAllParcelles = async (req, res) => {
    try {
        const parcelles = await prisma.parcelle.findMany({
            include: {
                cultures: true
            }
        });
        res.json(parcelles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET une parcelle
exports.getParcelleById = async (req, res) => {
    const { id } = req.params;

    try {
        const parcelle = await prisma.parcelle.findUnique({
            where: { id_parcelle: parseInt(id) },
            include: { cultures: true }
        });

        if (!parcelle) {
            return res.status(404).json({ message: "Parcelle non trouvée" });
        }

        res.json(parcelle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST créer une parcelle
exports.createParcelle = async (req, res) => {
    const { nom, surface, latitude, longitude, description, id_utilisateur } = req.body;

    try {
        const parcelle = await prisma.parcelle.create({
            data: {
                nom,
                surface,
                latitude,
                longitude,
                description,
                date_creation: new Date(),
                id_utilisateur
            }
        });

        res.status(201).json(parcelle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT modifier une parcelle
exports.updateParcelle = async (req, res) => {
    const { id } = req.params;
    const { nom, surface, latitude, longitude, description } = req.body;

    try {
        const parcelle = await prisma.parcelle.update({
            where: { id_parcelle: parseInt(id) },
            data: {
                nom,
                surface,
                latitude,
                longitude,
                description
            }
        });

        res.json(parcelle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE supprimer une parcelle
exports.deleteParcelle = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.parcelle.delete({
            where: { id_parcelle: parseInt(id) }
        });

        res.json({ message: "Parcelle supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};