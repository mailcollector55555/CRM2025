const Company = require('../models/Company');
const Manager = require('../models/Manager');

// @desc    Créer une nouvelle société
// @route   POST /api/companies
// @access  Private (Admin, Super Admin)
exports.createCompany = async (req, res) => {
    try {
        const { name, registrationNumber, vatNumber, address, managers } = req.body;

        // Vérifier si la société existe déjà
        const existingCompany = await Company.findOne({ registrationNumber });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: 'Une société avec ce numéro d\'enregistrement existe déjà'
            });
        }

        // Créer la société
        const company = await Company.create({
            name,
            registrationNumber,
            vatNumber,
            address,
            managers
        });

        // Mettre à jour les managers avec cette société
        if (managers && managers.length > 0) {
            await Manager.updateMany(
                { _id: { $in: managers } },
                { $push: { companies: company._id } }
            );
        }

        res.status(201).json({
            success: true,
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la société'
        });
    }
};

// @desc    Obtenir toutes les sociétés
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res) => {
    try {
        const query = {};
        const { search, manager } = req.query;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { registrationNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (manager) {
            query.managers = manager;
        }

        const companies = await Company.find(query)
            .populate('managers', 'firstName lastName email')
            .populate('bankAccounts', 'accountName iban');

        res.json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des sociétés'
        });
    }
};

// @desc    Obtenir une société par ID
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('managers', 'firstName lastName email')
            .populate({
                path: 'bankAccounts',
                select: 'accountName iban bank',
                populate: {
                    path: 'bank',
                    select: 'name country logo'
                }
            });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Société non trouvée'
            });
        }

        res.json({
            success: true,
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la société'
        });
    }
};

// @desc    Mettre à jour une société
// @route   PUT /api/companies/:id
// @access  Private (Admin, Super Admin)
exports.updateCompany = async (req, res) => {
    try {
        const { name, vatNumber, address, managers } = req.body;
        
        let company = await Company.findById(req.params.id);
        
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Société non trouvée'
            });
        }

        // Mettre à jour les associations de managers si nécessaire
        if (managers) {
            // Retirer la société des anciens managers qui ne sont plus associés
            const removedManagers = company.managers.filter(m => !managers.includes(m.toString()));
            if (removedManagers.length > 0) {
                await Manager.updateMany(
                    { _id: { $in: removedManagers } },
                    { $pull: { companies: company._id } }
                );
            }

            // Ajouter la société aux nouveaux managers
            const newManagers = managers.filter(m => !company.managers.includes(m));
            if (newManagers.length > 0) {
                await Manager.updateMany(
                    { _id: { $in: newManagers } },
                    { $push: { companies: company._id } }
                );
            }
        }

        company = await Company.findByIdAndUpdate(
            req.params.id,
            { name, vatNumber, address, managers },
            { new: true, runValidators: true }
        ).populate('managers', 'firstName lastName email');

        res.json({
            success: true,
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la société'
        });
    }
};

// @desc    Supprimer une société
// @route   DELETE /api/companies/:id
// @access  Private (Super Admin)
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Société non trouvée'
            });
        }

        // Retirer la société de tous les managers associés
        await Manager.updateMany(
            { companies: company._id },
            { $pull: { companies: company._id } }
        );

        await company.remove();

        res.json({
            success: true,
            message: 'Société supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la société'
        });
    }
};
