import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Migrando tabla productos para eliminar columna categoria...');

// Verificar si la columna existe
const tableInfo = db.prepare('PRAGMA table_info(productos)').all();
const hasCategoria = tableInfo.some(col => col.name === 'categoria');

if (!hasCategoria) {
  console.log('✅ La columna categoria ya no existe');
  db.close();
  process.exit(0);
}

console.log('⚠️ La columna categoria existe, procediendo a eliminarla...');

// Crear nueva tabla sin la columna categoria
db.exec(`
  CREATE TABLE productos_nueva (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria_id INTEGER,
    imagen_data TEXT,
    imagen_tipo TEXT,
    destacado INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✓ Tabla temporal creada');

// Migrar datos
db.exec(`
  INSERT INTO productos_nueva (id, nombre, descripcion, precio, categoria_id, imagen_data, imagen_tipo, destacado, created_at)
  SELECT id, nombre, descripcion, precio, categoria_id, imagen_data, imagen_tipo, destacado, created_at FROM productos;
`);

console.log('✓ Datos migrados');

// Eliminar tabla vieja
db.exec('DROP TABLE productos');
console.log('✓ Tabla vieja eliminada');

// Renombrar tabla nueva
db.exec('ALTER TABLE productos_nueva RENAME TO productos');
console.log('✓ Tabla renombrada');

// Verificar resultado
const newTableInfo = db.prepare('PRAGMA table_info(productos)').all();
console.log('\n📋 Columnas actuales de la tabla productos:');
console.table(newTableInfo.map(col => ({ name: col.name, type: col.type })));

console.log('\n✅ Migración completada. La columna categoria ha sido eliminada');

db.close();