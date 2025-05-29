const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de la société est requis'],
        trim: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Le numéro d\'enregistrement est requis'],
        unique: true,
        trim: true
    },
    vatNumber: {
        type: String,
        required: [true, 'Le numéro de TVA est requis'],
        trim: true,
        match: [
            /^[A-Z]{2}[0-9A-Z]+$/,
            'Veuillez fournir un numéro de TVA valide'
        ]
    },
    address: {
        street: {
            type: String,
            required: [true, 'L\'adresse est requise']
        },
        city: {
            type: String,
            required: [true, 'La ville est requise']
        },
        postalCode: {
            type: String,
            required: [true, 'Le code postal est requis']
        },
        country: {
            type: String,
            required: [true, 'Le pays est requis']
        }
    },
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    }],
    bankAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index pour la recherche
CompanySchema.index({ 
    name: 'text',
    registrationNumber: 'text',
    vatNumber: 'text'
});

module.exports = mongoose.model('Company', CompanySchema);
