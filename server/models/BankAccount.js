const mongoose = require('mongoose');
const crypto = require('crypto');

const BankAccountSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    },
    accountName: {
        type: String,
        required: [true, 'Le nom du compte est requis'],
        trim: true
    },
    iban: {
        type: String,
        required: [true, 'L\'IBAN est requis'],
        unique: true,
        uppercase: true,
        trim: true,
        match: [
            /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/,
            'Veuillez fournir un IBAN valide'
        ]
    },
    bic: {
        type: String,
        required: [true, 'Le BIC est requis'],
        uppercase: true,
        trim: true,
        match: [
            /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/,
            'Veuillez fournir un BIC valide'
        ]
    },
    credentials: {
        login: {
            type: String,
            required: [true, 'L\'identifiant est requis']
        },
        encryptedPassword: {
            type: String,
            required: [true, 'Le mot de passe est requis']
        },
        encryptedAdditionalCode: String,
        iv: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
});

// Méthode pour chiffrer les données sensibles
BankAccountSchema.methods.encryptSensitiveData = function(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(process.env.ENCRYPTION_KEY),
        iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encrypted,
        iv: iv.toString('hex')
    };
};

// Méthode pour déchiffrer les données sensibles
BankAccountSchema.methods.decryptSensitiveData = function(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(process.env.ENCRYPTION_KEY),
        Buffer.from(iv, 'hex')
    );

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports = mongoose.model('BankAccount', BankAccountSchema);
