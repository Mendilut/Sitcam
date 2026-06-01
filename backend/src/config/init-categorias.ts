import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Creando tabla de categorías...');

// Crear tabla categorias
db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    icono TEXT,
    tipo TEXT NOT NULL,
    activo INTEGER DEFAULT 1,
    orden INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✓ Tabla categorías creada');

// Insertar categorías por defecto
const insert = db.prepare('INSERT OR IGNORE INTO categorias (nombre, icono, tipo, orden) VALUES (?, ?, ?, ?)');

const categorias = [
  // Categorías para productos
  ['software', 'Package', 'producto', 1],
  ['cloud', 'Cloud', 'producto', 2],
  ['ia', 'Cpu', 'producto', 3],
  ['servicio', 'Server', 'producto', 4],
  // Categorías para servicios
  ['Desarrollo Web', 'Code', 'servicio', 1],
  ['Apps Móviles', 'Smartphone', 'servicio', 2],
  ['Ciberseguridad', 'Shield', 'servicio', 3],
  ['Consultoría IT', 'BarChart', 'servicio', 4],
  ['Cloud Computing', 'Cloud', 'servicio', 5],
  ['Bases de Datos', 'Database', 'servicio', 6]
];

for (const cat of categorias) {
  insert.run(cat[0], cat[1], cat[2], cat[3]);
}

console.log(`✓ ${categorias.length} categorías insertadas`);

// Mostrar categorías
const resultado = db.prepare('SELECT * FROM categorias ORDER BY tipo, orden').all();
console.table(resultado);

console.log('✅ Inicialización completada');
db.close();