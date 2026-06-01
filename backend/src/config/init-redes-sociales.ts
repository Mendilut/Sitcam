import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Agregando redes sociales a la configuración...');

// Verificar y crear claves de redes sociales si no existen
const redes = [
  { clave: 'facebook', valor: 'https://facebook.com/sitcam', descripcion: 'Facebook' },
  { clave: 'twitter', valor: 'https://twitter.com/sitcam', descripcion: 'Twitter' },
  { clave: 'instagram', valor: 'https://instagram.com/sitcam', descripcion: 'Instagram' },
  { clave: 'linkedin', valor: 'https://linkedin.com/company/sitcam', descripcion: 'LinkedIn' }
];

for (const red of redes) {
  const existe = db.prepare('SELECT * FROM configuracion WHERE clave = ?').get(red.clave);
  
  if (!existe) {
    db.prepare(`
      INSERT INTO configuracion (clave, valor, descripcion)
      VALUES (?, ?, ?)
    `).run(red.clave, red.valor, red.descripcion);
    console.log(`✅ Creada: ${red.clave} = ${red.valor}`);
  } else {
    console.log(`⚠️ Ya existe: ${red.clave}`);
  }
}

// Mostrar todas las configuraciones actualizadas
console.log('\n📋 Configuraciones actuales:');
const configs = db.prepare('SELECT clave, valor, descripcion FROM configuracion ORDER BY id').all();
console.table(configs);

console.log('\n🎉 Script completado');
db.close();