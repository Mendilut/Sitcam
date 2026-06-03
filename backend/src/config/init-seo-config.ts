import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Agregando configuración SEO...');

const seoFields = [
  {
    clave: 'seo_titulo',
    valor: 'SitCAM - Soluciones Tecnológicas en Cuba',
    descripcion: 'Título principal para SEO y navegador'
  },
  {
    clave: 'seo_descripcion',
    valor: 'SitCAM: Tu aliado tecnológico en Cuba. Ofrecemos desarrollo web, apps móviles y consultoría IT. Transformamos tu negocio con soluciones digitales a medida.',
    descripcion: 'Descripción para SEO y redes sociales'
  },
  {
    clave: 'seo_keywords',
    valor: 'desarrollo web Cuba, apps móviles, software a medida, ciberseguridad, consultoría IT, sitcam',
    descripcion: 'Palabras clave para motores de búsqueda'
  },
  {
    clave: 'seo_og_title',
    valor: 'SitCAM - Soluciones Tecnológicas en Cuba',
    descripcion: 'Título para Open Graph (Facebook, WhatsApp, Telegram)'
  },
  {
    clave: 'seo_og_description',
    valor: '¿Necesitas una web, una app o asesoría tecnológica? En SitCAM te ofrecemos soluciones digitales de alto impacto para tu negocio.',
    descripcion: 'Descripción para Open Graph'
  },
  {
    clave: 'seo_og_image',
    valor: '/images/logo-social.jpg',
    descripcion: 'Imagen para compartir en redes sociales (1200x630px)'
  },
  {
    clave: 'seo_twitter_title',
    valor: 'SitCAM - Soluciones Tecnológicas en Cuba',
    descripcion: 'Título para Twitter Card'
  },
  {
    clave: 'seo_twitter_description',
    valor: 'Potencia tu negocio con nuestras soluciones tecnológicas: desarrollo web, apps y consultoría. ¡Contáctanos!',
    descripcion: 'Descripción para Twitter Card'
  }
];

for (const field of seoFields) {
  const existe = db.prepare('SELECT * FROM configuracion WHERE clave = ?').get(field.clave);
  
  if (!existe) {
    db.prepare(`
      INSERT INTO configuracion (clave, valor, descripcion)
      VALUES (?, ?, ?)
    `).run(field.clave, field.valor, field.descripcion);
    console.log(`✅ Creado: ${field.clave}`);
  } else {
    console.log(`⚠️ Ya existe: ${field.clave}`);
  }
}

// Verificar configuración SEO
console.log('\n📋 Configuración SEO actual:');
const seoConfigs = db.prepare("SELECT clave, valor, descripcion FROM configuracion WHERE clave LIKE 'seo_%'").all();
console.table(seoConfigs);

console.log('\n🎉 Script completado');
db.close();