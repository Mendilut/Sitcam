import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Iniciando migración de tabla productos...');

// Verificar estado actual
const oldTableInfo = db.prepare('PRAGMA table_info(productos)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas actuales:');
console.table(oldTableInfo.map(col => ({ name: col.name, type: col.type })));

// Crear nueva tabla sin columna categoria
console.log('\n📦 Creando nueva tabla productos_nueva...');
db.exec(`
  CREATE TABLE IF NOT EXISTS productos_nueva (
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

console.log('✅ Tabla productos_nueva creada');

// Migrar datos
console.log('\n📤 Migrando datos...');
db.exec(`
  INSERT INTO productos_nueva (id, nombre, descripcion, precio, categoria_id, imagen_data, imagen_tipo, destacado, created_at)
  SELECT 
    id, 
    nombre, 
    descripcion, 
    precio, 
    categoria_id, 
    imagen_data, 
    imagen_tipo, 
    destacado, 
    created_at 
  FROM productos;
`);

console.log('✅ Datos migrados');

// Verificar cantidad de registros
const oldCount = db.prepare('SELECT COUNT(*) as total FROM productos').get() as { total: number };
const newCount = db.prepare('SELECT COUNT(*) as total FROM productos_nueva').get() as { total: number };

console.log(`\n📊 Registros en tabla vieja: ${oldCount.total}`);
console.log(`📊 Registros en tabla nueva: ${newCount.total}`);

if (oldCount.total === newCount.total) {
  console.log('✅ Cantidad de registros coincide');
} else {
  console.log('⚠️ ADVERTENCIA: La cantidad de registros no coincide');
}

// Eliminar tabla vieja
console.log('\n🗑️ Eliminando tabla vieja...');
db.exec('DROP TABLE productos');
console.log('✅ Tabla productos eliminada');

// Renombrar tabla nueva
console.log('\n✏️ Renombrando tabla nueva...');
db.exec('ALTER TABLE productos_nueva RENAME TO productos');
console.log('✅ Tabla renombrada a productos');

// Verificar resultado final
const newTableInfo = db.prepare('PRAGMA table_info(productos)').all() as Array<{ name: string; type: string }>;
console.log('\n📋 Columnas finales de la tabla productos:');
console.table(newTableInfo.map(col => ({ name: col.name, type: col.type })));

// Verificar si la columna categoria ya no existe
const hasCategoria = newTableInfo.some(col => col.name === 'categoria');
if (!hasCategoria) {
  console.log('\n✅ La columna "categoria" ha sido eliminada correctamente');
} else {
  console.log('\n⚠️ La columna "categoria" aún existe');
}

console.log('\n🎉 Migración completada con éxito');

db.close();