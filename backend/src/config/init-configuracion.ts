import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Creando tabla de configuración...');

// Crear tabla configuracion
db.exec(`
  CREATE TABLE IF NOT EXISTS configuracion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo TEXT DEFAULT 'text',
    descripcion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Tabla configuracion creada');

// Insertar datos por defecto
const insert = db.prepare(`
  INSERT OR IGNORE INTO configuracion (clave, valor, tipo, descripcion)
  VALUES (?, ?, ?, ?)
`);

const configuraciones = [
  ['empresa_nombre', 'SITCAM', 'text', 'Nombre de la empresa'],
  ['email_contacto', 'contacto@sitcam.cu', 'email', 'Email principal de contacto'],
  ['telefono', '+53 5 123 4567', 'tel', 'Teléfono de contacto'],
  ['direccion', 'La Habana, Cuba', 'text', 'Dirección física'],
  ['horario', 'Lun - Vie: 9am - 6pm', 'text', 'Horario de atención'],
  ['facebook', 'https://facebook.com/sitcam', 'url', 'Facebook'],
  ['twitter', 'https://twitter.com/sitcam', 'url', 'Twitter'],
  ['instagram', 'https://instagram.com/sitcam', 'url', 'Instagram'],
  ['linkedin', 'https://linkedin.com/company/sitcam', 'url', 'LinkedIn']
];

for (const config of configuraciones) {
  insert.run(config[0], config[1], config[2], config[3]);
}

console.log(`✅ ${configuraciones.length} configuraciones insertadas`);

// Verificar
const resultados = db.prepare('SELECT clave, valor FROM configuracion').all();
console.table(resultados);

console.log('🎉 Configuración inicializada correctamente');
db.close();