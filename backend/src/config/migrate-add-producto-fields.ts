import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Agregando nuevos campos a la tabla productos...');

// Agregar columna caracteristicas
try {
  db.exec('ALTER TABLE productos ADD COLUMN caracteristicas TEXT');
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
  db.exec('ALTER TABLE productos ADD COLUMN tiempo_entrega TEXT');
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
  db.exec('ALTER TABLE productos ADD COLUMN garantia TEXT');
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
  db.exec('ALTER TABLE productos ADD COLUMN incluye TEXT');
  console.log('✅ Columna incluye agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna incluye ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Verificar columnas finales
const tableInfo = db.prepare('PRAGMA table_info(productos)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales de la tabla productos:');
console.table(tableInfo.map(col => ({ name: col.name, type: col.type })));

console.log('\n🎉 Migración completada con éxito');

db.close();