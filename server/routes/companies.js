const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createCompany,
    getCompanies,
    getCompany,
    updateCompany,
    deleteCompany
} = require('../controllers/companies');

// Routes protégées nécessitant une authentification
router.use(protect);

// Routes pour les sociétés
router.route('/')
    .get(getCompanies)
    .post(authorize('admin', 'super_admin'), createCompany);

router.route('/:id')
    .get(getCompany)
    .put(authorize('admin', 'super_admin'), updateCompany)
    .delete(authorize('super_admin'), deleteCompany);

module.exports = router;
