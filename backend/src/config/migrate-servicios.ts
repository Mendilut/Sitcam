import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('Migrando tabla servicios...');

try {
  db.exec('ALTER TABLE servicios ADD COLUMN imagen_data TEXT');
  console.log('✓ Columna imagen_data agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('✓ Columna imagen_data ya existe');
  } else {
    console.log('✗ Error:', e.message);
  }
}

try {
  db.exec('ALTER TABLE servicios ADD COLUMN imagen_tipo TEXT');
  console.log('✓ Columna imagen_tipo agregada');
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('✓ Columna imagen_tipo ya existe');
  } else {
    console.log('✗ Error:', e.message);
  }
}

// Insertar servicios de ejemplo si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as total FROM servicios').get() as { total: number };
if (count.total === 0) {
  console.log('Insertando servicios de ejemplo...');
  
  const insert = db.prepare(`
    INSERT INTO servicios (titulo, descripcion, precio, icono, destacado, orden)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const servicios = [
    ['Desarrollo Web', 'Sitios web modernos y responsivos con las últimas tecnologías.', 2999, 'Code', 1, 1],
    ['Apps Móviles', 'Aplicaciones nativas y multiplataforma para iOS y Android.', 3999, 'Smartphone', 1, 2],
    ['Ciberseguridad', 'Protección y auditoría para tus sistemas y datos.', 1999, 'Shield', 1, 3],
    ['Bases de Datos', 'Diseño, optimización y administración de bases de datos SQL y NoSQL.', 1499, 'Database', 0, 4],
    ['Cloud Computing', 'Migración y gestión de infraestructura en la nube.', 2499, 'Cloud', 0, 5],
    ['Consultoría IT', 'Asesoramiento tecnológico para optimizar procesos.', 999, 'BarChart', 0, 6],
  ];
  
  for (const s of servicios) {
    insert.run(...s);
  }
  console.log(`✓ ${servicios.length} servicios insertados`);
}

console.log('Migración completada');
db.close();