const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createBankAccount,
    getCompanyBankAccounts,
    updateBankAccount,
    deleteBankAccount
} = require('../controllers/bankAccounts');

// Routes protégées nécessitant une authentification
router.use(protect);

// Routes pour les comptes bancaires
router.route('/')
    .post(authorize('admin', 'super_admin'), createBankAccount);

router.route('/company/:companyId')
    .get(getCompanyBankAccounts);

router.route('/:id')
    .put(authorize('admin', 'super_admin'), updateBankAccount)
    .delete(authorize('super_admin'), deleteBankAccount);

module.exports = router;
