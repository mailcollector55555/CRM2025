const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour l'upload des logos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/banks');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Seules les images sont autorisées'));
    }
});

const {
    createBank,
    getBanksByCountry,
    searchBanks,
    updateBank,
    deleteBank
} = require('../controllers/banks');

// Routes protégées nécessitant une authentification
router.use(protect);

// Routes pour les banques
router.route('/')
    .post(authorize('admin', 'super_admin'), upload.single('logo'), createBank);

router.route('/search')
    .get(searchBanks);

router.route('/country/:countryCode')
    .get(getBanksByCountry);

router.route('/:id')
    .put(authorize('admin', 'super_admin'), upload.single('logo'), updateBank)
    .delete(authorize('super_admin'), deleteBank);

module.exports = router;
