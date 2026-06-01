import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Creando tabla de suscriptores...');

db.exec(`
  CREATE TABLE IF NOT EXISTS suscriptores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    activo INTEGER DEFAULT 1,
    fecha_suscripcion DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Tabla suscriptores creada');

db.close();