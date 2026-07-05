const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./robot.db");

db.serialize(() => {

    // ==========================
    // USERS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS users(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT,

            fullname TEXT
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users(username,password,fullname)

        VALUES

        ('admin','robot','Administrator'),
        ('alice','1234','Alice'),
        ('bob','azerty','Bob')
    `);


    // ==========================
    // DELIVERIES
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS deliveries(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            sender_id INTEGER,

            receiver_id INTEGER,

            pickup INTEGER,

            destination INTEGER,

            status TEXT,

            created_at TEXT
        )
    `);

});

module.exports = db;