import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Migrando servicios...');

// Agregar columna categoria_id a servicios
try {
  db.exec('ALTER TABLE servicios ADD COLUMN categoria_id INTEGER REFERENCES categorias(id)');
  console.log('✓ Columna categoria_id agregada a servicios');
} catch (e: any) {
  console.log('La columna categoria_id ya existe en servicios');
}

// Mapear servicios a categorías (por título)
const mapeo: Record<string, number> = {
  'Desarrollo Web': 5,
  'Apps Móviles': 6,
  'Ciberseguridad': 7,
  'Consultoría IT': 8,
  'Cloud Computing': 9,
  'Bases de Datos': 10
};

for (const [titulo, id] of Object.entries(mapeo)) {
  const result = db.prepare('UPDATE servicios SET categoria_id = ? WHERE titulo = ?').run(id, titulo);
  console.log(`✓ ${result.changes} servicios actualizados: ${titulo} -> ID ${id}`);
}

console.log('✅ Migración de servicios completada');
db.close();