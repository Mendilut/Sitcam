import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Agregando columnas de imagen a la tabla testimonios...');

// Verificar columnas actuales
const columns = db.prepare('PRAGMA table_info(testimonios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales:');
console.table(columns.map(col => ({ name: col.name, type: col.type })));

// Agregar columna imagen_data
try {
  db.exec('ALTER TABLE testimonios ADD COLUMN imagen_data TEXT');
  console.log('✅ Columna imagen_data agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna imagen_data ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna imagen_tipo
try {
  db.exec('ALTER TABLE testimonios ADD COLUMN imagen_tipo TEXT');
  console.log('✅ Columna imagen_tipo agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna imagen_tipo ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Verificar columnas finales
const finalColumns = db.prepare('PRAGMA table_info(testimonios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas finales:');
console.table(finalColumns.map(col => ({ name: col.name, type: col.type })));

console.log('\n🎉 Migración completada');
db.close();