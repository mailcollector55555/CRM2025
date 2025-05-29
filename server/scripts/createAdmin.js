require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm2025');
        
        const adminData = {
            email: 'admin@crm2025.com',
            password: 'Admin123!',
            firstName: 'Admin',
            lastName: 'System',
            role: 'admin'
        };

        // Vérifier si l'admin existe déjà
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Créer l'admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        
        const admin = new User({
            ...adminData,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
