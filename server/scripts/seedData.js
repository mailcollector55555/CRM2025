require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const BankAccount = require('../models/BankAccount');

const companies = [
    {
        name: 'TechSolutions SARL',
        registrationNumber: 'RCS12345678901234',
        vatNumber: 'FR12345678901',
        address: {
            street: '15 Rue de l\'Innovation',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
        },
        status: 'active'
    },
    {
        name: 'EcoConstruct SAS',
        registrationNumber: 'RCS98765432109876',
        vatNumber: 'FR98765432109',
        address: {
            street: '42 Avenue Verte',
            city: 'Lyon',
            postalCode: '69002',
            country: 'France'
        },
        status: 'active'
    },
    {
        name: 'DataFuture SA',
        registrationNumber: 'RCS45678901234567',
        vatNumber: 'FR45678901234',
        address: {
            street: '8 Boulevard Digital',
            city: 'Bordeaux',
            postalCode: '33000',
            country: 'France'
        },
        status: 'active'
    }
];

const bankAccounts = [
    {
        accountNumber: 'FR7630001007941234567890185',
        bank: 'BNP Paribas',
        balance: 150000.00,
        type: 'courant',
        currency: 'EUR'
    },
    {
        accountNumber: 'FR7630004000031234567890143',
        bank: 'Société Générale',
        balance: 75000.00,
        type: 'épargne',
        currency: 'EUR'
    },
    {
        accountNumber: 'FR7630006000011234567890189',
        bank: 'Crédit Agricole',
        balance: 250000.00,
        type: 'courant',
        currency: 'EUR'
    }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Nettoyer les collections existantes
        await Company.deleteMany({});
        await BankAccount.deleteMany({});
        console.log('Collections cleared');

        // Créer les entreprises
        const createdCompanies = await Company.create(companies);
        console.log('Companies created:', createdCompanies.length);

        // Associer les comptes bancaires aux entreprises
        const bankAccountsWithCompanies = bankAccounts.map((account, index) => ({
            ...account,
            company: createdCompanies[index % createdCompanies.length]._id
        }));

        const createdAccounts = await BankAccount.create(bankAccountsWithCompanies);
        console.log('Bank accounts created:', createdAccounts.length);

        console.log('Seed completed successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedData();
