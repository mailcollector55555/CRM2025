const BankAccount = require('../models/BankAccount');
const Company = require('../models/Company');
const Bank = require('../models/Bank');
const crypto = require('crypto');

// @desc    Créer un nouveau compte bancaire
// @route   POST /api/bank-accounts
// @access  Private (Admin, Super Admin)
exports.createBankAccount = async (req, res) => {
    try {
        const {
            companyId,
            bankId,
            accountName,
            iban,
            bic,
            login,
            password,
            additionalCode
        } = req.body;

        // Vérifier si le compte existe déjà
        const existingAccount = await BankAccount.findOne({ iban });
        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: 'Un compte avec cet IBAN existe déjà'
            });
        }

        // Vérifier si la société et la banque existent
        const [company, bank] = await Promise.all([
            Company.findById(companyId),
            Bank.findById(bankId)
        ]);

        if (!company || !bank) {
            return res.status(404).json({
                success: false,
                message: 'Société ou banque non trouvée'
            });
        }

        // Chiffrer les informations sensibles
        const account = new BankAccount({
            company: companyId,
            bank: bankId,
            accountName,
            iban,
            bic
        });

        // Chiffrer le login et le mot de passe
        const loginEncrypted = account.encryptSensitiveData(login);
        const passwordEncrypted = account.encryptSensitiveData(password);

        account.credentials = {
            login: loginEncrypted.encrypted,
            encryptedPassword: passwordEncrypted.encrypted,
            iv: loginEncrypted.iv
        };

        // Chiffrer le code supplémentaire si fourni
        if (additionalCode) {
            const additionalCodeEncrypted = account.encryptSensitiveData(additionalCode);
            account.credentials.encryptedAdditionalCode = additionalCodeEncrypted.encrypted;
        }

        await account.save();

        // Ajouter le compte à la société
        await Company.findByIdAndUpdate(companyId, {
            $push: { bankAccounts: account._id }
        });

        res.status(201).json({
            success: true,
            data: {
                id: account._id,
                accountName: account.accountName,
                iban: account.iban,
                bic: account.bic,
                bank: bank.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du compte bancaire'
        });
    }
};

// @desc    Obtenir tous les comptes bancaires d'une société
// @route   GET /api/bank-accounts/company/:companyId
// @access  Private
exports.getCompanyBankAccounts = async (req, res) => {
    try {
        const accounts = await BankAccount.find({ company: req.params.companyId })
            .populate('bank', 'name country logo')
            .select('-credentials.encryptedPassword -credentials.encryptedAdditionalCode');

        res.json({
            success: true,
            count: accounts.length,
            data: accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des comptes bancaires'
        });
    }
};

// @desc    Mettre à jour un compte bancaire
// @route   PUT /api/bank-accounts/:id
// @access  Private (Admin, Super Admin)
exports.updateBankAccount = async (req, res) => {
    try {
        const {
            accountName,
            login,
            password,
            additionalCode
        } = req.body;

        const account = await BankAccount.findById(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Compte bancaire non trouvé'
            });
        }

        // Mise à jour des informations de base
        account.accountName = accountName || account.accountName;

        // Mise à jour des credentials si fournis
        if (login || password || additionalCode) {
            if (login) {
                const loginEncrypted = account.encryptSensitiveData(login);
                account.credentials.login = loginEncrypted.encrypted;
                account.credentials.iv = loginEncrypted.iv;
            }
            
            if (password) {
                const passwordEncrypted = account.encryptSensitiveData(password);
                account.credentials.encryptedPassword = passwordEncrypted.encrypted;
            }

            if (additionalCode) {
                const additionalCodeEncrypted = account.encryptSensitiveData(additionalCode);
                account.credentials.encryptedAdditionalCode = additionalCodeEncrypted.encrypted;
            }
        }

        await account.save();

        res.json({
            success: true,
            data: {
                id: account._id,
                accountName: account.accountName,
                iban: account.iban,
                bic: account.bic,
                updatedAt: account.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du compte bancaire'
        });
    }
};

// @desc    Supprimer un compte bancaire
// @route   DELETE /api/bank-accounts/:id
// @access  Private (Super Admin)
exports.deleteBankAccount = async (req, res) => {
    try {
        const account = await BankAccount.findById(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Compte bancaire non trouvé'
            });
        }

        // Retirer le compte de la société
        await Company.findByIdAndUpdate(account.company, {
            $pull: { bankAccounts: account._id }
        });

        await account.remove();

        res.json({
            success: true,
            message: 'Compte bancaire supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du compte bancaire'
        });
    }
};
