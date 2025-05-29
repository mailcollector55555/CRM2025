require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function initDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm2025');
        console.log('Connected to MongoDB');

        // Supprimer tous les utilisateurs existants
        await User.deleteMany({});
        console.log('Users collection cleared');

        // Créer l'admin
        const admin = new User({
            email: 'admin@crm2025.com',
            password: 'Admin123!', // Le modèle User hashera automatiquement le mot de passe
            firstName: 'Admin',
            lastName: 'System',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@crm2025.com');
        console.log('Password: Admin123!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

initDb();
