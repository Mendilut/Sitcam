import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Modificando estructura de la tabla productos...');

try {
  // Crear una tabla temporal con la nueva estructura
  db.exec(`
    CREATE TABLE productos_temp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      precio REAL,
      categoria_id INTEGER,
      imagen_data TEXT,
      imagen_tipo TEXT,
      destacado INTEGER DEFAULT 0,
      caracteristicas TEXT,
      tiempo_entrega TEXT,
      garantia TEXT,
      incluye TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabla temporal creada');

  // Copiar datos existentes
  db.exec(`
    INSERT INTO productos_temp (
      id, nombre, descripcion, precio, categoria_id, 
      imagen_data, imagen_tipo, destacado, 
      caracteristicas, tiempo_entrega, garantia, incluye, created_at
    )
    SELECT 
      id, nombre, descripcion, precio, categoria_id,
      imagen_data, imagen_tipo, destacado,
      caracteristicas, tiempo_entrega, garantia, incluye, created_at
    FROM productos
  `);
  console.log('✅ Datos copiados a tabla temporal');

  // Eliminar tabla original
  db.exec('DROP TABLE productos');
  console.log('✅ Tabla original eliminada');

  // Renombrar tabla temporal
  db.exec('ALTER TABLE productos_temp RENAME TO productos');
  console.log('✅ Tabla renombrada correctamente');

  // Ahora convertir precios 0 o negativos a NULL
  const result = db.prepare('UPDATE productos SET precio = NULL WHERE precio <= 0').run();
  console.log(`✅ ${result.changes} productos actualizados (precio 0 o negativo → NULL)`);

  // Verificar resultados
  const productos = db.prepare('SELECT id, nombre, precio FROM productos ORDER BY id').all();
  console.log('\n📋 Productos actualizados:');
  console.table(productos);

  console.log('\n🎉 Migración completada');
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  db.close();
}