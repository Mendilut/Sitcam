import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Creando tabla de mensajes de contacto...');

db.exec(`
  CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    mensaje TEXT NOT NULL,
    leido INTEGER DEFAULT 0,
    respondido INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Tabla mensajes_contacto creada');

db.close();