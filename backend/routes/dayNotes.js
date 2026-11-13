// backend/routes/dayNotes.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// 🔹 GET - Buscar todas as notas
router.get('/', (req, res) => {
  db.all('SELECT * FROM day_notes ORDER BY noteDate DESC, noteTime DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar notas' });
    } else {
      res.json(rows);
    }
  });
});

// 🔹 POST - Criar nova nota
router.post('/', (req, res) => {
  const { noteDate, noteContent } = req.body;
  const dayNoteId = uuidv4();

  // Gera o horário atual (HH:mm)
  const noteTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  db.run(
    'INSERT INTO day_notes (dayNoteId, noteDate, noteContent, noteTime) VALUES (?, ?, ?, ?)',
    [dayNoteId, noteDate, noteContent, noteTime],
    function (err) {
      if (err) {
        console.error('Erro ao criar nota:', err.message);
        res.status(500).json({ error: 'Erro ao criar nota' });
      } else {
        res.status(201).json({ dayNoteId, noteDate, noteContent, noteTime });
      }
    }
  );
});

// 🔹 PUT - Atualizar uma nota
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { noteDate, noteContent } = req.body;

  db.run(
    'UPDATE day_notes SET noteDate = ?, noteContent = ? WHERE dayNoteId = ?',
    [noteDate, noteContent, id],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar nota:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar nota' });
      } else {
        res.json({ dayNoteId: id, noteDate, noteContent });
      }
    }
  );
});

// 🔹 DELETE - Excluir uma nota
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM day_notes WHERE dayNoteId = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao deletar nota:', err.message);
      res.status(500).json({ error: 'Erro ao deletar nota' });
    } else {
      res.json({ message: 'Nota deletada com sucesso', dayNoteId: id });
    }
  });
});

module.exports = router;