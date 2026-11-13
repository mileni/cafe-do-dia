// backend/src/controllers/dayCoffeeController.js
const DayCoffee = require('../models/DayCoffee');

exports.createDayCoffee = async (req, res) => {
  try {
    const newDayCoffee = new DayCoffee(req.body);
    await newDayCoffee.save();
    res.status(201).json(newDayCoffee);
  } catch (error) {
    console.error('Erro ao criar DayCoffee:', error);
    res.status(500).json({ message: 'Erro ao criar café do dia.' });
  }
};

exports.getAllDayCoffees = async (req, res) => {
  try {
    const dayCoffees = await DayCoffee.find().populate('coffee').sort({ dayDate: -1 });
    res.status(200).json(dayCoffees);
  } catch (error) {
    console.error('Erro ao buscar DayCoffees:', error);
    res.status(500).json({ message: 'Erro ao buscar cafés do dia.' });
  }
};