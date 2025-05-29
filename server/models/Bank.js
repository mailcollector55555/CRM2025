const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de la banque est requis'],
        trim: true
    },
    country: {
        name: {
            type: String,
            required: [true, 'Le nom du pays est requis']
        },
        code: {
            type: String,
            required: [true, 'Le code du pays est requis'],
            uppercase: true,
            minlength: 2,
            maxlength: 2
        }
    },
    swiftCode: {
        type: String,
        required: [true, 'Le code SWIFT est requis'],
        unique: true,
        uppercase: true,
        minlength: 8,
        maxlength: 11
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Veuillez fournir une URL valide'
        ]
    },
    logo: {
        type: String
    }
}, {
    timestamps: true
});

// Index pour la recherche
BankSchema.index({ name: 'text', swiftCode: 'text' });

module.exports = mongoose.model('Bank', BankSchema);
