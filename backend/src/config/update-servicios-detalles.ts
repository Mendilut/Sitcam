import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Actualizando servicios con datos de ejemplo...');

// Actualizar cada servicio con datos de ejemplo
const updates = [
  {
    id: 1,
    caracteristicas: '• Sitios web responsivos\n• Optimización SEO\n• Panel de administración\n• Integración con redes sociales\n• Formularios de contacto',
    tiempo_entrega: '2-3 semanas',
    garantia: '6 meses de soporte post-lanzamiento',
    incluye: '• Dominio por 1 año\n• Hosting por 6 meses\n• Capacitación básica\n• Soporte técnico'
  },
  {
    id: 2,
    caracteristicas: '• Apps para iOS y Android\n• Código compartido (80%)\n• Notificaciones push\n• Sincronización en tiempo real\n• Modo offline',
    tiempo_entrega: '4-6 semanas',
    garantia: '12 meses de actualizaciones',
    incluye: '• Publicación en stores\n• Código fuente\n• Documentación técnica\n• Soporte por 6 meses'
  },
  {
    id: 3,
    caracteristicas: '• Análisis de vulnerabilidades\n• Pruebas de penetración\n• Auditoría de seguridad\n• Reporte detallado\n• Plan de remediación',
    tiempo_entrega: '1-2 semanas',
    garantia: '3 meses de seguimiento',
    incluye: '• Informe ejecutivo\n• Certificado de auditoría\n• Reunión de presentación'
  },
  {
    id: 4,
    caracteristicas: '• Evaluación de procesos\n• Optimización de recursos\n• Plan de transformación digital\n• Análisis ROI\n• Hoja de ruta tecnológica',
    tiempo_entrega: '2-4 semanas',
    garantia: 'Seguimiento post-consultoría',
    incluye: '• Informe detallado\n• Plan de acción\n• 2 sesiones de seguimiento'
  },
  {
    id: 5,
    caracteristicas: '• Migración a la nube\n• Arquitectura escalable\n• Backup automatizado\n• Monitoreo 24/7\n• Optimización de costos',
    tiempo_entrega: '3-5 semanas',
    garantia: 'Garantía de disponibilidad 99.9%',
    incluye: '• Configuración inicial\n• Documentación\n• Transferencia de conocimiento'
  },
  {
    id: 6,
    caracteristicas: '• Diseño de esquemas\n• Optimización de consultas\n• Replicación y respaldos\n• Seguridad de datos\n• Monitoreo de rendimiento',
    tiempo_entrega: '1-3 semanas',
    garantia: 'Garantía de integridad de datos',
    incluye: '• Backup inicial\n• Scripts de migración\n• Documentación completa'
  }
];

for (const service of updates) {
  db.prepare(`
    UPDATE servicios 
    SET caracteristicas = ?, tiempo_entrega = ?, garantia = ?, incluye = ? 
    WHERE id = ?
  `).run(
    service.caracteristicas,
    service.tiempo_entrega,
    service.garantia,
    service.incluye,
    service.id
  );
  console.log(`✅ Servicio ID ${service.id} actualizado`);
}

// Verificar resultados
const servicios = db.prepare('SELECT id, titulo, caracteristicas, tiempo_entrega, garantia, incluye FROM servicios').all();
console.log('\n📋 Servicios actualizados:');
console.table(servicios);

console.log('\n🎉 Actualización completada');
db.close();