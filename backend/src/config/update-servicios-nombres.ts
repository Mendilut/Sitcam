import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Actualizando nombres de servicios...');

// Ver servicios actuales
const serviciosActuales = db.prepare('SELECT id, titulo, descripcion FROM servicios ORDER BY id').all();
console.log('\n📋 Servicios actuales:');
console.table(serviciosActuales);

// Actualizar servicios con nombres más específicos
const updates = [
  { 
    id: 1, 
    titulo: 'Desarrollo Web a Medida', 
    descripcion: 'Creación de sitios web profesionales, tiendas online y aplicaciones web a medida.'
  },
  { 
    id: 2, 
    titulo: 'Aplicaciones Móviles Cross-platform', 
    descripcion: 'Desarrollo de apps nativas para iOS y Android con React Native y Flutter.'
  },
  { 
    id: 3, 
    titulo: 'Auditoría y Ciberseguridad', 
    descripcion: 'Protección de sistemas, análisis de vulnerabilidades y pentesting.'
  },
  { 
    id: 4, 
    titulo: 'Consultoría Tecnológica', 
    descripcion: 'Asesoramiento para optimizar tus procesos IT y reducir costos.'
  },
  { 
    id: 5, 
    titulo: 'Infraestructura Cloud', 
    descripcion: 'Migración y gestión de infraestructura en la nube (AWS, Azure, Google Cloud).'
  },
  { 
    id: 6, 
    titulo: 'Administración de Bases de Datos', 
    descripcion: 'Diseño, optimización y mantenimiento de bases de datos SQL y NoSQL.'
  }
];

for (const service of updates) {
  const result = db.prepare(`
    UPDATE servicios 
    SET titulo = ?, descripcion = ? 
    WHERE id = ?
  `).run(service.titulo, service.descripcion, service.id);
  
  console.log(`✅ Servicio ID ${service.id}: "${service.titulo}"`);
}

// Verificar resultados
const serviciosFinales = db.prepare('SELECT id, titulo, categoria_id FROM servicios ORDER BY id').all();
console.log('\n📋 Servicios actualizados:');
console.table(serviciosFinales);

console.log('\n🎉 Actualización completada');
db.close();