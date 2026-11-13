// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const uuid = require('uuid');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3001;

// --- Middlewares e Configuração ---
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const formatCoffeeRow = (row) => ({
    ...row,
    coffeeTop: row.coffeeTop === 1
});

// --- Conexão / criação de esquema ---
const dbPath = path.join(__dirname, 'coffee.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Tabela coffees
        db.run(`CREATE TABLE IF NOT EXISTS coffees (
            coffeeId TEXT PRIMARY KEY,
            coffeeName TEXT NOT NULL,
            coffeeRoaster TEXT NOT NULL,
            coffeeBeanType TEXT,
            coffeeVariation TEXT,
            coffeeProcess TEXT,
            coffeeType TEXT,
            coffeeRoastDate TEXT,
            coffeeRoastType TEXT,
            coffeeSensory TEXT,
            coffeeOrigin TEXT,
            coffeeProducer TEXT,
            coffeeAltitude TEXT,
            coffeeScore TEXT,
            coffeeAcidity INTEGER,
            coffeeSweetness INTEGER,
            coffeeBitterness INTEGER,
            coffeeFullBodied INTEGER,
            coffeeTop INTEGER,
            coffeeGrind INTEGER,
            coffeeImage TEXT,
            coffeePurchaseDate TEXT,
            coffeePurchaseLocation TEXT,
            coffeeObservation TEXT,
            roasterSite TEXT,
            roasterDescription TEXT,
            coffeeOrder INTEGER,
            coffeePrice TEXT
        )`);
        // Tabela day_coffees
        db.run(`CREATE TABLE IF NOT EXISTS day_coffees (
            dayCoffeeId TEXT PRIMARY KEY,
            dayDate TEXT NOT NULL,
            coffeeId TEXT NOT NULL,
            dayMethod TEXT,
            dayRecipe TEXT,
            dayGrind TEXT,
            dayObservation TEXT,
            FOREIGN KEY (coffeeId) REFERENCES coffees(coffeeId) ON DELETE CASCADE
        )`);
    }
});

// Garante colunas extras se faltarem
db.all("PRAGMA table_info(coffees)", (err, columns) => {
    if (err) return;
    const hasColumn = (name) => columns.some(col => col.name === name);

    if (!hasColumn('coffeeOrder')) {
        db.run('ALTER TABLE coffees ADD COLUMN coffeeOrder INTEGER');
        console.log('Coluna coffeeOrder adicionada.');
    }
    if (!hasColumn('roasterSite')) {
        db.run('ALTER TABLE coffees ADD COLUMN roasterSite TEXT');
        console.log('Coluna roasterSite adicionada.');
    }
    if (!hasColumn('roasterDescription')) {
        db.run('ALTER TABLE coffees ADD COLUMN roasterDescription TEXT');
        console.log('Coluna roasterDescription adicionada.');
    }
    if (!hasColumn('coffeePrice')) {
        db.run('ALTER TABLE coffees ADD COLUMN coffeePrice TEXT');
        console.log('Coluna coffeePrice adicionada.');
    }
});

// --- Rotas de Coffees (CRUD) ---

// Verifica se há cafés
app.get('/api/coffees/count', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM coffees', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ hasCoffees: row.count > 0 });
    });
});

// Criar café
app.post('/api/coffees', upload.single('coffeeImage'), (req, res) => {
    const {
        coffeeName, coffeeRoaster, coffeeBeanType, coffeeVariation,
        coffeeProcess, coffeeType, coffeeRoastDate, coffeeRoastType,
        coffeeSensory, coffeeOrigin, coffeeProducer, coffeeAltitude,
        coffeeScore, coffeeAcidity, coffeeSweetness, coffeeBitterness, coffeeFullBodied,
        coffeePurchaseDate, coffeePurchaseLocation, coffeeObservation, coffeeTop, coffeeGrind,
        roasterSite, roasterDescription, coffeePrice
    } = req.body;

    const coffeeTopValue = (coffeeTop === 'on' || coffeeTop === 'true' || coffeeTop === true) ? 1 : 0;
    const coffeeImage = req.file ? `/uploads/${req.file.filename}` : null;
    const coffeeId = uuid.v4();

    const stmt = db.prepare(`INSERT INTO coffees (
        coffeeId, coffeeName, coffeeRoaster, coffeeBeanType, coffeeVariation,
        coffeeProcess, coffeeType, coffeeRoastDate, coffeeRoastType,
        coffeeSensory, coffeeOrigin, coffeeProducer, coffeeAltitude,
        coffeeScore, coffeeAcidity, coffeeSweetness, coffeeBitterness, coffeeFullBodied,
        coffeeImage, coffeePurchaseDate, coffeePurchaseLocation, coffeeObservation,
        coffeeTop, coffeeGrind, roasterSite, roasterDescription, coffeePrice
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    stmt.run(
        coffeeId, coffeeName, coffeeRoaster, coffeeBeanType, coffeeVariation,
        coffeeProcess, coffeeType, coffeeRoastDate, coffeeRoastType,
        coffeeSensory, coffeeOrigin, coffeeProducer, coffeeAltitude,
        coffeeScore, coffeeAcidity, coffeeSweetness, coffeeBitterness, coffeeFullBodied,
        coffeeImage, coffeePurchaseDate, coffeePurchaseLocation, coffeeObservation,
        coffeeTopValue, coffeeGrind, roasterSite, roasterDescription, coffeePrice,
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Café cadastrado com sucesso!', coffeeId });
        }
    );
    stmt.finalize();
});

// Listar cafés
app.get('/api/coffees', (req, res) => {
    db.all('SELECT * FROM coffees ORDER BY COALESCE(coffeeOrder, 9999) ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const formatted = rows.map(formatCoffeeRow);
        res.json(formatted);
    });
});

// Detalhes de um café
app.get('/api/coffees/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Café não encontrado.' });
        res.json(formatCoffeeRow(row));
    });
});

// Atualizar café
app.put('/api/coffees/:id', upload.single('coffeeImage'), (req, res) => {
    const { id } = req.params;
    const {
        coffeeName, coffeeRoaster, coffeeBeanType, coffeeVariation,
        coffeeProcess, coffeeType, coffeeRoastDate, coffeeRoastType,
        coffeeSensory, coffeeOrigin, coffeeProducer, coffeeAltitude,
        coffeeScore, coffeeAcidity, coffeeSweetness, coffeeBitterness,
        coffeeFullBodied, coffeePurchaseDate, coffeePurchaseLocation,
        coffeeObservation, coffeeTop, coffeeGrind, roasterSite, roasterDescription, coffeePrice
    } = req.body;

    db.get('SELECT * FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Café não encontrado.' });

        const updateFields = [];
        const updateParams = [];

        const fields = {
            coffeeName, coffeeRoaster, coffeeBeanType, coffeeVariation, coffeeProcess,
            coffeeType, coffeeRoastDate, coffeeRoastType, coffeeSensory, coffeeOrigin,
            coffeeProducer, coffeeAltitude, coffeeScore, coffeeAcidity, coffeeSweetness,
            coffeeBitterness, coffeeFullBodied, coffeePurchaseDate, coffeePurchaseLocation,
            coffeeObservation, coffeeGrind, roasterSite, roasterDescription, coffeePrice
        };

        for (const key in fields) {
            if (fields[key] !== undefined) {
                updateFields.push(`${key} = ?`);
                updateParams.push(fields[key]);
            }
        }

        if (coffeeTop !== undefined) {
            const coffeeTopValue = (coffeeTop === 'on' || coffeeTop === 'true' || coffeeTop === true) ? 1 : 0;
            updateFields.push('coffeeTop = ?');
            updateParams.push(coffeeTopValue);
        }

        if (req.file) {
            updateFields.push('coffeeImage = ?');
            updateParams.push(`/uploads/${req.file.filename}`);
        } else if (req.body.coffeeImage === null || req.body.coffeeImage === '') {
            updateFields.push('coffeeImage = NULL');
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
        }

        const sql = `UPDATE coffees SET ${updateFields.join(', ')} WHERE coffeeId = ?`;
        updateParams.push(id);

        db.run(sql, updateParams, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT * FROM coffees WHERE coffeeId = ?', [id], (err2, updatedRow) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: 'Café atualizado com sucesso!', coffee: formatCoffeeRow(updatedRow) });
            });
        });
    });
});

// Deletar café (toda a entrada + imagem)
app.delete('/api/coffees/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT coffeeImage FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (row && row.coffeeImage) {
            const imagePath = path.join(__dirname, row.coffeeImage);
            fs.unlink(imagePath, () => {});
        }
    });

    db.run('DELETE FROM coffees WHERE coffeeId = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Café não encontrado.' });
        res.json({ message: 'Café deletado com sucesso!' });
    });
});

// Deletar só imagem de café
app.delete('/api/coffees/:id/image', (req, res) => {
    const { id } = req.params;
    db.get('SELECT coffeeImage FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (!row || !row.coffeeImage) {
            return res.status(404).json({ message: 'Imagem não encontrada.' });
        }
        const imagePath = path.join(__dirname, row.coffeeImage);
        fs.unlink(imagePath, () => {
            db.run('UPDATE coffees SET coffeeImage = NULL WHERE coffeeId = ?', [id], function (updateErr) {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Imagem deletada com sucesso.' });
            });
        });
    });
});

// Reordenar cafés
app.patch('/api/coffees/reorder', (req, res) => {
    const { order } = req.body;
    if (!Array.isArray(order)) {
        return res.status(400).json({ error: 'Formato inválido' });
    }

    const stmt = db.prepare('UPDATE coffees SET coffeeOrder = ? WHERE coffeeId = ?');
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        order.forEach(({ coffeeId, order: ord }) => {
            stmt.run(ord, coffeeId);
        });
        db.run('COMMIT', (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Ordem atualizada com sucesso!' });
        });
    });
    stmt.finalize();
});

// --- Rotas de Day-Coffees ---

// Criar café do dia
app.post('/api/day-coffees', (req, res) => {
    const { dayDate, coffeeId, dayMethod, dayRecipe, dayGrind, dayObservation } = req.body;
    const dayCoffeeId = uuid.v4();

    const stmt = db.prepare(`INSERT INTO day_coffees (
        dayCoffeeId, dayDate, coffeeId, dayMethod, dayRecipe, dayGrind, dayObservation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(dayCoffeeId, dayDate, coffeeId, dayMethod, dayRecipe, dayGrind, dayObservation, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Café do dia cadastrado com sucesso!', dayCoffeeId });
    });
    stmt.finalize();
});

// Listar cafés do dia
app.get('/api/day-coffees', (req, res) => {
    const sql = `SELECT dc.dayCoffeeId, dc.dayDate, dc.dayMethod, dc.dayRecipe, dc.dayGrind AS day_Grind, dc.dayObservation AS day_Observation,
        c.coffeeId, c.coffeeName, c.coffeeRoaster, c.coffeeBeanType, c.coffeeVariation,
        c.coffeeProcess, c.coffeeType, c.coffeeRoastDate, c.coffeeRoastType, c.coffeeSensory,
        c.coffeeOrigin, c.coffeeProducer, c.coffeeAltitude, c.coffeeScore, c.coffeeAcidity,
        c.coffeeSweetness, c.coffeeBitterness, c.coffeeFullBodied, c.coffeeTop,
        c.coffeeGrind AS coffee_Grind, c.coffeeImage, c.coffeePurchaseDate, c.coffeePurchaseLocation,
        c.coffeeObservation AS coffee_Observation, c.roasterSite, c.roasterDescription,
        c.coffeePrice
    FROM day_coffees dc
    JOIN coffees c ON dc.coffeeId = c.coffeeId
    ORDER BY dc.dayDate DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro na rota /api/day-coffees:', err.message);
            return res.status(500).json({ error: 'Erro interno do servidor ao buscar cafés do dia.' });
        }

        const result = rows.map(row => {
            const {
                day_Grind, day_Observation,
                coffee_Grind, coffee_Observation,
                ...rest
            } = row;

            return {
                dayCoffeeId: row.dayCoffeeId,
                dayDate: row.dayDate,
                dayMethod: row.dayMethod,
                dayRecipe: row.dayRecipe,
                dayGrind: day_Grind,
                dayObservation: day_Observation,
                coffee: {
                    coffeeId: rest.coffeeId,
                    coffeeName: rest.coffeeName,
                    coffeeRoaster: rest.coffeeRoaster,
                    coffeeBeanType: rest.coffeeBeanType,
                    coffeeVariation: rest.coffeeVariation,
                    coffeeProcess: rest.coffeeProcess,
                    coffeeType: rest.coffeeType,
                    coffeeRoastDate: rest.coffeeRoastDate,
                    coffeeRoastType: rest.coffeeRoastType,
                    coffeeSensory: rest.coffeeSensory,
                    coffeeOrigin: rest.coffeeOrigin,
                    coffeeProducer: rest.coffeeProducer,
                    coffeeAltitude: rest.coffeeAltitude,
                    coffeeScore: rest.coffeeScore,
                    coffeeAcidity: rest.coffeeAcidity,
                    coffeeSweetness: rest.coffeeSweetness,
                    coffeeBitterness: rest.coffeeBitterness,
                    coffeeFullBodied: rest.coffeeFullBodied,
                    coffeeTop: rest.coffeeTop === 1,
                    coffeeGrind: coffee_Grind,
                    coffeeImage: rest.coffeeImage,
                    coffeePurchaseDate: rest.coffeePurchaseDate,
                    coffeePurchaseLocation: rest.coffeePurchaseLocation,
                    coffeeObservation: coffee_Observation,
                    roasterSite: rest.roasterSite,
                    roasterDescription: rest.roasterDescription,
                    coffeePrice: rest.coffeePrice
                }
            };
        });

        res.json(result);
    });
});

// Atualizar café do dia
app.put('/api/day-coffees/:id', (req, res) => {
    const { id } = req.params;
    const { dayDate, coffeeId, dayMethod, dayRecipe, dayGrind, dayObservation } = req.body;

    const sql = `UPDATE day_coffees
        SET dayDate = ?, coffeeId = ?, dayMethod = ?, dayRecipe = ?, dayGrind = ?, dayObservation = ?
        WHERE dayCoffeeId = ?`;

    db.run(sql, [dayDate, coffeeId, dayMethod, dayRecipe, dayGrind, dayObservation, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Café do dia não encontrado.' });
        res.json({ message: 'Café do dia atualizado com sucesso!' });
    });
});

// Deletar café do dia
app.delete('/api/day-coffees/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM day_coffees WHERE dayCoffeeId = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Café do dia não encontrado.' });
        res.json({ message: 'Café do dia deletado com sucesso!' });
    });
});

// --- Inicialização do servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});