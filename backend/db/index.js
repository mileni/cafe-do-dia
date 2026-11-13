// backend/db/index.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'coffee.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');

    // --- Tabela coffees ---
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

    // --- Tabela day_coffees ---
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

    // --- Tabela day_notes ---
    db.run(`CREATE TABLE IF NOT EXISTS day_notes (
      dayNoteId TEXT PRIMARY KEY,
      noteDate TEXT NOT NULL,
      noteContent TEXT,
      noteTime TEXT
    )`);

    // --- Verifica e adiciona colunas que faltarem em "coffees" ---
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

    // --- Verifica e adiciona colunas que faltarem em "day_notes" ---
    db.all("PRAGMA table_info(day_notes)", (err, columns) => {
      if (err) return;
      const hasColumn = (name) => columns.some(col => col.name === name);

			if (!hasColumn('noteTime')) {
				db.run('ALTER TABLE day_notes ADD COLUMN noteTime TEXT');
				console.log('Coluna noteTime adicionada.');
			}

    });
  }
});

module.exports = db;
