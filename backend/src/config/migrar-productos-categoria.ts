import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Migrando productos...');

// Agregar columna categoria_id a productos
try {
  db.exec('ALTER TABLE productos ADD COLUMN categoria_id INTEGER REFERENCES categorias(id)');
  console.log('✓ Columna categoria_id agregada a productos');
} catch (e: any) {
  console.log('La columna categoria_id ya existe en productos');
}

// Mapear categorías de productos
const mapeo: Record<string, number> = {
  'software': 1,
  'cloud': 2,
  'ia': 3,
  'servicio': 4
};

for (const [nombre, id] of Object.entries(mapeo)) {
  const result = db.prepare('UPDATE productos SET categoria_id = ? WHERE categoria = ?').run(id, nombre);
  console.log(`✓ ${result.changes} productos actualizados: ${nombre} -> ID ${id}`);
}

console.log('✅ Migración de productos completada');
db.close();