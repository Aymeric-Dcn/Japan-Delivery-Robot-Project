const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./robot.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT

        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users(username,password)

        VALUES
        ('admin','robot'),
        ('alice','1234'),
        ('bob','azerty')
    `);

});

module.exports = db;