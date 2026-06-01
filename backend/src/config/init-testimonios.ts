import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Creando tabla de testimonios...');

db.exec(`
  CREATE TABLE IF NOT EXISTS testimonios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL,
    empresa TEXT,
    texto TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    activo INTEGER DEFAULT 1,
    imagen_data TEXT,
    imagen_tipo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Tabla testimonios creada');

// Insertar testimonios de ejemplo
const count = db.prepare('SELECT COUNT(*) as total FROM testimonios').get() as { total: number };

if (count.total === 0) {
  console.log('Insertando testimonios de ejemplo...');
  
  const insert = db.prepare(`
    INSERT INTO testimonios (nombre, rol, empresa, texto, rating, activo)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const testimonios = [
    ['María García', 'CEO', 'TechCuba', 'Excelente servicio y atención. Superaron nuestras expectativas.', 5, 1],
    ['Carlos Méndez', 'Gerente Comercial', 'Grupo Empresarial', 'La implementación del ERP transformó nuestra operación.', 5, 1],
    ['Laura Fernández', 'Directora de Marketing', 'Innovatech', 'El sitio web que desarrollaron superó todas nuestras expectativas.', 5, 1],
    ['Roberto Díaz', 'CEO', 'Digital Solutions', 'El soporte técnico es excepcional. Muy recomendados.', 5, 1],
    ['Ana Silva', 'Gerente de TI', 'CorpSoft', 'Profesionales y cumplidores. Volveremos a trabajar con ellos.', 4, 1],
    ['Miguel Torres', 'Propietario', 'Restaurante el Faro', 'El POS transformó la gestión de nuestro negocio.', 5, 1],
  ];
  
  for (const t of testimonios) {
    insert.run(t[0], t[1], t[2], t[3], t[4], t[5]);
  }
  
  console.log(`✅ ${testimonios.length} testimonios insertados`);
}

db.close();