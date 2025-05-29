const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const countries = require('../data/countries');
const banks = require('../data/banks');

// @route   GET /api/data/countries
// @desc    Obtenir la liste des pays
// @access  Private
router.get('/countries', protect, (req, res) => {
    res.json(countries);
});

// @route   GET /api/data/banks
// @desc    Obtenir la liste des banques
// @access  Private
router.get('/banks', protect, (req, res) => {
    res.json(banks);
});

// @route   GET /api/data/banks/:country
// @desc    Obtenir la liste des banques pour un pays
// @access  Private
router.get('/banks/:country', protect, (req, res) => {
    const countryBanks = banks.filter(bank => bank.country === req.params.country.toUpperCase());
    res.json(countryBanks);
});

module.exports = router;
