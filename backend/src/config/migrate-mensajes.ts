import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Verificando columnas de mensajes_contacto...');

// Ver columnas actuales
const columns = db.prepare('PRAGMA table_info(mensajes_contacto)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales:');
console.table(columns.map(col => ({ name: col.name, type: col.type })));

// Agregar columna leido
try {
  db.exec('ALTER TABLE mensajes_contacto ADD COLUMN leido INTEGER DEFAULT 0');
  console.log('✅ Columna leido agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ La columna leido ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna respondido
try {
  db.exec('ALTER TABLE mensajes_contacto ADD COLUMN respondido INTEGER DEFAULT 0');
  console.log('✅ Columna respondido agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ La columna respondido ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Verificar columnas finales
const finalColumns = db.prepare('PRAGMA table_info(mensajes_contacto)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas finales:');
console.table(finalColumns.map(col => ({ name: col.name, type: col.type })));

console.log('\n🎉 Migración completada');
db.close();