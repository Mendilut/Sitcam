import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Verificando usuarios...');

// Verificar si existe el usuario admin
const adminExists = db.prepare('SELECT * FROM usuarios WHERE email = ?').get('admin@sitcam.cu');

if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO usuarios (email, password, nombre, rol, activo)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin@sitcam.cu', hashedPassword, 'Administrador', 'admin', 1);
  console.log('✅ Usuario admin creado');
}

// Agregar columna activo si no existe
try {
  db.exec('ALTER TABLE usuarios ADD COLUMN activo INTEGER DEFAULT 1');
  console.log('✅ Columna activo agregada');
} catch (e: any) {
  if (!e.message.includes('duplicate column name')) {
    console.log('⚠️ Columna activo ya existe');
  }
}

const usuarios = db.prepare('SELECT id, email, nombre, rol, activo FROM usuarios').all();
console.table(usuarios);

console.log('🎉 Inicialización completada');
db.close();