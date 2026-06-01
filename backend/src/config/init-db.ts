import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT NOT NULL,
    imagen_data TEXT,
    imagen_tipo TEXT,
    destacado INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    icono TEXT NOT NULL,
    destacado INTEGER DEFAULT 0,
    orden INTEGER DEFAULT 0,
    imagen_data TEXT,
    imagen_tipo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertar productos de ejemplo (sin imágenes por ahora)
const insertProducts = db.prepare(`
  INSERT OR IGNORE INTO productos (id, nombre, descripcion, precio, categoria, destacado)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const productos = [
  [1, 'SITCAM ERP', 'Sistema de gestión empresarial completo con módulos de facturación, inventario, RRHH y contabilidad.', 2999, 'software', 1],
  [2, 'SITCAM POS', 'Punto de venta para comercios y restaurantes con interfaz táctil.', 999, 'software', 1],
  [3, 'SITCAM Cloud', 'Almacenamiento seguro en la nube con 50GB incluidos.', 49, 'cloud', 1],
  [4, 'SITCAM Analytics', 'Plataforma de business intelligence y dashboards personalizables.', 1999, 'software', 0],
  [5, 'SITCAM Automation', 'Automatización de procesos empresariales con workflows personalizados.', 1499, 'software', 0],
  [6, 'SITCAM AI', 'Soluciones con inteligencia artificial y machine learning.', 3999, 'ia', 0],
  [7, 'Soporte Premium', 'Soporte técnico 24/7 con atención prioritaria.', 199, 'servicio', 0],
  [8, 'Capacitación', 'Curso de capacitación para tu equipo (5 días).', 499, 'servicio', 0],
  [9, 'SITCAM Security', 'Solución de ciberseguridad con protección en tiempo real.', 799, 'software', 0]
];

for (const producto of productos) {
  insertProducts.run(producto);
}

// Crear usuario admin
const adminExists = db.prepare('SELECT * FROM usuarios WHERE email = ?').get('admin@sitcam.cu');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO usuarios (email, password, nombre, rol)
    VALUES (?, ?, ?, ?)
  `).run('admin@sitcam.cu', hashedPassword, 'Administrador', 'admin');
  console.log('Usuario admin creado: admin@sitcam.cu / admin123');
}

console.log('Base de datos inicializada correctamente');
db.close();