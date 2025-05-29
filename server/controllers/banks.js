const Bank = require('../models/Bank');
const path = require('path');
const fs = require('fs').promises;

// @desc    Créer une nouvelle banque
// @route   POST /api/banks
// @access  Private (Admin, Super Admin)
exports.createBank = async (req, res) => {
    try {
        const { name, country, swiftCode, website } = req.body;
        const logo = req.file;

        // Vérifier si la banque existe déjà
        const existingBank = await Bank.findOne({ swiftCode });
        if (existingBank) {
            // Supprimer le logo uploadé si la banque existe déjà
            if (logo) {
                await fs.unlink(logo.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Une banque avec ce code SWIFT existe déjà'
            });
        }

        // Créer la banque
        const bank = await Bank.create({
            name,
            country,
            swiftCode,
            website,
            logo: logo ? `/uploads/banks/${logo.filename}` : undefined
        });

        res.status(201).json({
            success: true,
            data: bank
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la banque'
        });
    }
};

// @desc    Obtenir toutes les banques d'un pays
// @route   GET /api/banks/country/:countryCode
// @access  Private
exports.getBanksByCountry = async (req, res) => {
    try {
        const banks = await Bank.find({
            'country.code': req.params.countryCode.toUpperCase()
        }).sort('name');

        res.json({
            success: true,
            count: banks.length,
            data: banks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des banques'
        });
    }
};

// @desc    Rechercher des banques
// @route   GET /api/banks/search
// @access  Private
exports.searchBanks = async (req, res) => {
    try {
        const { query } = req.query;
        const search = new RegExp(query, 'i');

        const banks = await Bank.find({
            $or: [
                { name: search },
                { swiftCode: search }
            ]
        }).limit(10);

        res.json({
            success: true,
            count: banks.length,
            data: banks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche des banques'
        });
    }
};

// @desc    Mettre à jour une banque
// @route   PUT /api/banks/:id
// @access  Private (Admin, Super Admin)
exports.updateBank = async (req, res) => {
    try {
        const { name, website } = req.body;
        const logo = req.file;

        const bank = await Bank.findById(req.params.id);

        if (!bank) {
            if (logo) {
                await fs.unlink(logo.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Banque non trouvée'
            });
        }

        // Supprimer l'ancien logo si un nouveau est fourni
        if (logo && bank.logo) {
            const oldLogoPath = path.join(__dirname, '..', 'public', bank.logo);
            try {
                await fs.unlink(oldLogoPath);
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ancien logo:', error);
            }
        }

        bank.name = name || bank.name;
        bank.website = website || bank.website;
        if (logo) {
            bank.logo = `/uploads/banks/${logo.filename}`;
        }

        await bank.save();

        res.json({
            success: true,
            data: bank
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la banque'
        });
    }
};

// @desc    Supprimer une banque
// @route   DELETE /api/banks/:id
// @access  Private (Super Admin)
exports.deleteBank = async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.id);

        if (!bank) {
            return res.status(404).json({
                success: false,
                message: 'Banque non trouvée'
            });
        }

        // Supprimer le logo si existe
        if (bank.logo) {
            const logoPath = path.join(__dirname, '..', 'public', bank.logo);
            try {
                await fs.unlink(logoPath);
            } catch (error) {
                console.error('Erreur lors de la suppression du logo:', error);
            }
        }

        await bank.remove();

        res.json({
            success: true,
            message: 'Banque supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la banque'
        });
    }
};
