import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Actualizando tabla testimonios...');

// Verificar columnas actuales
const columns = db.prepare('PRAGMA table_info(testimonios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales:');
console.table(columns.map(col => ({ name: col.name, type: col.type })));

// Agregar columna email
try {
  db.exec('ALTER TABLE testimonios ADD COLUMN email TEXT');
  console.log('✅ Columna email agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna email ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna aprobado_por (opcional, para saber quién aprobó)
try {
  db.exec('ALTER TABLE testimonios ADD COLUMN aprobado_por TEXT');
  console.log('✅ Columna aprobado_por agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna aprobado_por ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Agregar columna fecha_aprobacion
try {
  db.exec('ALTER TABLE testimonios ADD COLUMN fecha_aprobacion DATETIME');
  console.log('✅ Columna fecha_aprobacion agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna fecha_aprobacion ya existe');
  } else {
    console.log('❌ Error:', e.message);
  }
}

// Actualizar testimonios existentes (admin = null para los actuales)
db.prepare("UPDATE testimonios SET email = 'admin@sitcam.cu' WHERE email IS NULL").run();

// Verificar columnas finales
const finalColumns = db.prepare('PRAGMA table_info(testimonios)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas finales:');
console.table(finalColumns.map(col => ({ name: col.name, type: col.type })));

// Mostrar testimonios actuales
const testimonios = db.prepare('SELECT id, nombre, email, activo FROM testimonios').all();
console.log('\n📋 Testimonios actuales:');
console.table(testimonios);

console.log('\n🎉 Migración completada');
db.close();