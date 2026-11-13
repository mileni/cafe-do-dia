// backend/routes/dayCoffees.js
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const db = require('../db');

// Criar café do dia
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM day_coffees WHERE dayCoffeeId = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Café do dia não encontrado.' });
        res.json({ message: 'Café do dia deletado com sucesso!' });
    });
});

module.exports = router;