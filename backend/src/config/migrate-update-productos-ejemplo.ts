import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'database.sqlite'));

console.log('🔄 Actualizando productos con datos de ejemplo...');

// Actualizar SITCAM ERP
db.prepare(`
  UPDATE productos SET 
    caracteristicas = '• Gestión de inventario en tiempo real\n• Facturación electrónica\n• Módulo de RRHH\n• Dashboard de indicadores\n• Reportes personalizables',
    tiempo_entrega = '2-3 semanas',
    garantia = '12 meses',
    incluye = '• Licencia perpetua\n• Instalación incluida\n• Capacitación para 5 usuarios\n• Soporte técnico por 1 año'
  WHERE id = 1
`).run();

// Actualizar SITCAM POS
db.prepare(`
  UPDATE productos SET 
    caracteristicas = '• Interfaz táctil\n• Control de inventario\n• Múltiples métodos de pago\n• Reportes de ventas\n• Gestión de clientes',
    tiempo_entrega = '1-2 semanas',
    garantia = '12 meses',
    incluye = '• Licencia perpetua\n• Instalación incluida\n• Capacitación para 3 usuarios\n• Soporte técnico por 1 año'
  WHERE id = 2
`).run();

// Actualizar SITCAM Cloud
db.prepare(`
  UPDATE productos SET 
    caracteristicas = '• Almacenamiento seguro\n• Sincronización automática\n• Acceso desde cualquier lugar\n• Encriptación de datos\n• Copias de seguridad automáticas',
    tiempo_entrega = 'Inmediato',
    garantia = '99.9% de disponibilidad',
    incluye = '• 50GB de almacenamiento\n• Soporte 24/7\n• Actualizaciones automáticas'
  WHERE id = 3
`).run();

console.log('✅ Productos actualizados con datos de ejemplo');

// Verificar productos actualizados
const productos = db.prepare('SELECT id, nombre, caracteristicas, tiempo_entrega, garantia, incluye FROM productos').all();
console.table(productos);

console.log('\n🎉 Actualización completada');

db.close();