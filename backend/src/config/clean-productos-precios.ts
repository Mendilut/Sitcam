import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Limpiando precios incorrectos en productos...');

// Ver productos antes de la limpieza
const productosAntes = db.prepare('SELECT id, nombre, precio FROM productos ORDER BY id').all();
console.log('\n📋 Productos ANTES de la limpieza:');
console.table(productosAntes);

// Convertir precios 0 o negativos a null
const result = db.prepare('UPDATE productos SET precio = NULL WHERE precio <= 0 OR precio IS NULL').run();
console.log(`\n✅ ${result.changes} productos actualizados (precio 0 o negativo → null)`);

// Ver productos después de la limpieza
const productosDespues = db.prepare('SELECT id, nombre, precio FROM productos ORDER BY id').all();
console.log('\n📋 Productos DESPUÉS de la limpieza:');
console.table(productosDespues);

console.log('\n🎉 Limpieza completada');
db.close();