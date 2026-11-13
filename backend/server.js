// backend/server.js
const express = require('express');
const path = require('path');

// --- Middlewares ---
const corsMiddleware = require('./middleware/cors');

// --- Rotas ---
const coffeesRoutes = require('./routes/coffees');
const dayCoffeesRoutes = require('./routes/dayCoffees');
const dayNotesRoutes = require('./routes/dayNotes'); // ✅ nova rota

const app = express();
const PORT = 3001;

// --- Middlewares globais ---
app.use(corsMiddleware);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Registro de rotas ---
app.use('/api/coffees', coffeesRoutes);
app.use('/api/day-coffees', dayCoffeesRoutes);
app.use('/api/day-notes', dayNotesRoutes); // ✅ nova rota

// --- Inicialização do servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
