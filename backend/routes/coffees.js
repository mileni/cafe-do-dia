// backend/routes/coffees.js
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const upload = require('../middleware/upload');
const { formatCoffeeRow } = require('../utils/formatCoffee');

// Verifica se há cafés
router.get('/count', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM coffees', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ hasCoffees: row.count > 0 });
    });
});

// Criar café
router.post('/', upload.single('coffeeImage'), (req, res) => {
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

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
router.get('/', (req, res) => {
    db.all('SELECT * FROM coffees ORDER BY COALESCE(coffeeOrder, 9999) ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const formatted = rows.map(formatCoffeeRow);
        res.json(formatted);
    });
});

// Detalhes de um café
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Café não encontrado.' });
        res.json(formatCoffeeRow(row));
    });
});

// Atualizar café
router.put('/:id', upload.single('coffeeImage'), (req, res) => {
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
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT coffeeImage FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (row && row.coffeeImage) {
            const imagePath = path.join(__dirname, '..', row.coffeeImage);
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
router.delete('/:id/image', (req, res) => {
    const { id } = req.params;
    db.get('SELECT coffeeImage FROM coffees WHERE coffeeId = ?', [id], (err, row) => {
        if (!row || !row.coffeeImage) {
            return res.status(404).json({ message: 'Imagem não encontrada.' });
        }
        const imagePath = path.join(__dirname, '..', row.coffeeImage);
        fs.unlink(imagePath, () => {
            db.run('UPDATE coffees SET coffeeImage = NULL WHERE coffeeId = ?', [id], function (updateErr) {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Imagem deletada com sucesso.' });
            });
        });
    });
});

// Reordenar cafés
router.patch('/reorder', (req, res) => {
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

module.exports = router;