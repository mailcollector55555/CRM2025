const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

console.log('Starting server...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connecté');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Port:', process.env.PORT);
})
.catch(err => {
    console.error('Erreur MongoDB:', err);
    process.exit(1);
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/bank-accounts', require('./routes/bankAccounts'));
app.use('/api/banks', require('./routes/banks'));

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur'
    });
});

// Configuration du serveur
const serverConfig = {
    port: process.env.PORT || 3000,
    host: '0.0.0.0' // Écouter sur toutes les interfaces
};

// Afficher la configuration au démarrage
console.log('========================================');
console.log('Démarrage du serveur...');
console.log('Configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI:', process.env.MONGODB_URI);
console.log('- PWD:', process.cwd());
console.log('========================================');

// Vérifier les prérequis
if (!process.env.JWT_SECRET) {
    console.error('ERREUR: JWT_SECRET non défini');
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    console.error('ERREUR: MONGODB_URI non défini');
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

try {
    const server = app.listen(serverConfig.port, serverConfig.host, () => {
        console.log('----------------------------------------');
        console.log('Server Configuration:');
        console.log(`- Port: ${serverConfig.port}`);
        console.log(`- Host: ${serverConfig.host}`);
        console.log(`- Environment: ${process.env.NODE_ENV}`);
        console.log(`- Directory: ${process.cwd()}`);
        console.log('----------------------------------------');
    });

    server.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });
} catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
}
