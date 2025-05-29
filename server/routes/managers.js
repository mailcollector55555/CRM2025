const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/managers
// @desc    Obtenir tous les gérants
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const managers = await Manager.find()
            .populate('companies', 'name')
            .select('-documents.file');
        res.json(managers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// @route   GET /api/managers/:id
// @desc    Obtenir un gérant par son ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id)
            .populate('companies', 'name');
        
        if (!manager) {
            return res.status(404).json({ message: 'Gérant non trouvé' });
        }

        res.json(manager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// @route   POST /api/managers
// @desc    Créer un nouveau gérant
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const manager = new Manager(req.body);
        await manager.save();
        res.status(201).json(manager);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// @route   PUT /api/managers/:id
// @desc    Mettre à jour un gérant
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const manager = await Manager.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!manager) {
            return res.status(404).json({ message: 'Gérant non trouvé' });
        }

        res.json(manager);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// @route   DELETE /api/managers/:id
// @desc    Supprimer un gérant
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);

        if (!manager) {
            return res.status(404).json({ message: 'Gérant non trouvé' });
        }

        // Vérifier si le gérant a des sociétés
        if (manager.companies.length > 0) {
            return res.status(400).json({
                message: 'Ce gérant ne peut pas être supprimé car il gère des sociétés'
            });
        }

        await manager.remove();
        res.json({ message: 'Gérant supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// @route   POST /api/managers/:id/documents
// @desc    Ajouter un document à un gérant
// @access  Private
router.post('/:id/documents', protect, async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);

        if (!manager) {
            return res.status(404).json({ message: 'Gérant non trouvé' });
        }

        manager.documents.push(req.body);
        await manager.save();

        res.status(201).json(manager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
