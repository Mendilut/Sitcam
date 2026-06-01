import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Ejecutando migraciones...');

try {
  db.exec('ALTER TABLE productos ADD COLUMN imagen_data TEXT');
  console.log('✓ Columna imagen_data agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('✓ Columna imagen_data ya existe');
  } else {
    console.log('✗ Error:', e.message);
  }
}

try {
  db.exec('ALTER TABLE productos ADD COLUMN imagen_tipo TEXT');
  console.log('✓ Columna imagen_tipo agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('✓ Columna imagen_tipo ya existe');
  } else {
    console.log('✗ Error:', e.message);
  }
}

console.log('Migraciones completadas');
db.close();