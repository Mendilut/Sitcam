import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Actualizando tabla servicios...');

// Agregar columna precio si no existe
try {
  db.exec('ALTER TABLE servicios ADD COLUMN precio REAL DEFAULT 0');
  console.log('✓ Columna precio agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('✓ Columna precio ya existe');
  } else {
    console.log('Error:', e.message);
  }
}

// Actualizar precios
const precios = [
  [2999, 1],
  [3999, 2],
  [1999, 3],
  [1499, 4],
  [2499, 5],
  [999, 6]
];

for (const [precio, id] of precios) {
  const result = db.prepare('UPDATE servicios SET precio = ? WHERE id = ?').run(precio, id);
  console.log(`✓ Servicio ID ${id} actualizado a $${precio}`);
}

// Verificar resultados
const servicios = db.prepare('SELECT id, titulo, precio FROM servicios').all();
console.log('\n📋 Resultado final:');
console.table(servicios);

console.log('\n✅ Actualización completada');
db.close();