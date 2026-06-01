import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Agregando campos de detalle a la tabla servicios...');

// Ver columnas actuales
const columns = db.prepare('PRAGMA table_info(servicios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales:');
console.table(columns.map(col => ({ name: col.name, type: col.type })));

// Agregar columna caracteristicas
try {
  db.exec('ALTER TABLE servicios ADD COLUMN caracteristicas TEXT');
  console.log('✅ Columna caracteristicas agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna caracteristicas ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna tiempo_entrega
try {
  db.exec('ALTER TABLE servicios ADD COLUMN tiempo_entrega TEXT');
  console.log('✅ Columna tiempo_entrega agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna tiempo_entrega ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna garantia
try {
  db.exec('ALTER TABLE servicios ADD COLUMN garantia TEXT');
  console.log('✅ Columna garantia agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna garantia ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna incluye
try {
  db.exec('ALTER TABLE servicios ADD COLUMN incluye TEXT');
  console.log('✅ Columna incluye agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna incluye ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Verificar columnas finales
const finalColumns = db.prepare('PRAGMA table_info(servicios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas finales:');
console.table(finalColumns.map(col => ({ name: col.name, type: col.type })));

console.log('\n🎉 Migración completada');
db.close();