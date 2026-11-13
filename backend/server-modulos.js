// backend/server.js
const express = require('express');
const path = require('path');

// Importa módulos
const corsMiddleware = require('./middleware/cors');
// O db/index.js apenas inicializa o db, mas não precisamos dele aqui
// const db = require('./db'); 

// Importa as rotas
const coffeesRouter = require('./routes/coffees');
const dayCoffeesRouter = require('./routes/dayCoffees');

const app = express();
const PORT = 3001;

// --- Middlewares e Configuração ---
app.use(corsMiddleware); // Usa o middleware de CORS modularizado
app.use(express.json());
// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// O restante da configuração do banco (conexão, schema, migrações)
// é feito automaticamente pelo require('./db') no módulo de rotas (que também fará o require)
// ou você pode garantir a inicialização aqui se não for usado em outro lugar:
require('./db'); // Garante que a conexão e criação de tabelas ocorram na inicialização

// --- Registro das Rotas ---
app.use('/api/coffees', coffeesRouter);
app.use('/api/day-coffees', dayCoffeesRouter);

// --- Inicialização do servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});