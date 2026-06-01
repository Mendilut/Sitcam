import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Creando tabla equipo...');

db.exec(`
  CREATE TABLE IF NOT EXISTS equipo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT,
    orden INTEGER DEFAULT 0,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Tabla equipo creada');

// Insertar datos de ejemplo
const insert = db.prepare(`
  INSERT OR IGNORE INTO equipo (nombre, cargo, descripcion, imagen_url, orden)
  VALUES (?, ?, ?, ?, ?)
`);

const miembros = [
  ['Ana García', 'CEO & Fundadora', '10+ años en tecnología', 'https://i.imgur.com/placeholder.jpg', 1],
  ['Carlos Méndez', 'Director Técnico', '8+ años en desarrollo', 'https://i.imgur.com/placeholder.jpg', 2],
  ['Laura Fernández', 'Líder de Proyectos', '6+ años en gestión', 'https://i.imgur.com/placeholder.jpg', 3],
  ['Israel Fernández', 'Desarrollador Senior', '7+ años en backend', 'https://i.imgur.com/placeholder.jpg', 4],
];

for (const miembro of miembros) {
  insert.run(miembro[0], miembro[1], miembro[2], miembro[3], miembro[4]);
}

console.log(`✅ ${miembros.length} miembros insertados`);

// Verificar
const resultado = db.prepare('SELECT * FROM equipo ORDER BY orden').all();
console.table(resultado);

console.log('🎉 Inicialización completada');
db.close();