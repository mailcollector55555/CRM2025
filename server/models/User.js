const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin', 'consultant'],
        default: 'user'
    },
    permissions: [{
        type: String,
        enum: [
            'view_companies',
            'create_company',
            'edit_company',
            'delete_company',
            'view_bank_accounts',
            'create_bank_account',
            'edit_bank_account',
            'delete_bank_account',
            'view_managers',
            'create_manager',
            'edit_manager',
            'delete_manager'
        ]
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    lastLogin: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Chiffrer le mot de passe avant la sauvegarde
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Générer un token JWT
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Vérifier le mot de passe
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Vérifier si l'utilisateur a la permission
UserSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

// Définir les permissions par défaut selon le rôle
UserSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        switch (this.role) {
            case 'super_admin':
                this.permissions = [
                    'view_companies', 'create_company', 'edit_company', 'delete_company',
                    'view_bank_accounts', 'create_bank_account', 'edit_bank_account', 'delete_bank_account',
                    'view_managers', 'create_manager', 'edit_manager', 'delete_manager'
                ];
                break;
            case 'admin':
                this.permissions = [
                    'view_companies', 'create_company', 'edit_company',
                    'view_bank_accounts', 'create_bank_account', 'edit_bank_account',
                    'view_managers', 'create_manager', 'edit_manager'
                ];
                break;
            case 'consultant':
                this.permissions = [
                    'view_companies',
                    'view_bank_accounts',
                    'view_managers'
                ];
                break;
            default:
                this.permissions = ['view_companies', 'view_managers'];
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
