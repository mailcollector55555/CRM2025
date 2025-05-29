const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Veuillez fournir un email valide'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        match: [
            /^\+?[1-9]\d{1,14}$/,
            'Veuillez fournir un numéro de téléphone valide'
        ]
    },
    position: {
        type: String,
        required: [true, 'Le poste est requis']
    },
    companies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],
    documents: [{
        type: {
            type: String,
            required: true,
            enum: ['id_card', 'passport', 'driving_license', 'other']
        },
        number: {
            type: String,
            required: true
        },
        issuedAt: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        issuingCountry: {
            type: String,
            required: true
        },
        file: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Méthode pour vérifier si les documents sont expirés
ManagerSchema.methods.hasExpiredDocuments = function() {
    const now = new Date();
    return this.documents.some(doc => doc.expiresAt < now);
};

// Méthode pour obtenir les documents expirés
ManagerSchema.methods.getExpiredDocuments = function() {
    const now = new Date();
    return this.documents.filter(doc => doc.expiresAt < now);
};

// Index pour la recherche
ManagerSchema.index({ 
    firstName: 'text',
    lastName: 'text',
    email: 'text'
});

module.exports = mongoose.model('Manager', ManagerSchema);
