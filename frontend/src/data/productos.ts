export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  destacado: boolean;
}

export const productos: Producto[] = [
  {
    id: 1,
    nombre: 'SITCAM ERP',
    descripcion: 'Sistema de gestión empresarial completo con módulos de facturación, inventario, RRHH y contabilidad.',
    precio: 2999,
    categoria: 'software',
    imagen: '/images/erp.jpg',
    destacado: true
  },
  {
    id: 2,
    nombre: 'SITCAM POS',
    descripcion: 'Punto de venta para comercios y restaurantes con interfaz táctil.',
    precio: 999,
    categoria: 'software',
    imagen: '/images/pos.jpg',
    destacado: true
  },
  {
    id: 3,
    nombre: 'SITCAM Cloud',
    descripcion: 'Almacenamiento seguro en la nube con 50GB incluidos.',
    precio: 49,
    categoria: 'cloud',
    imagen: '/images/cloud.jpg',
    destacado: true
  },
  {
    id: 4,
    nombre: 'SITCAM Analytics',
    descripcion: 'Plataforma de business intelligence y dashboards personalizables.',
    precio: 1999,
    categoria: 'software',
    imagen: '/images/analytics.jpg',
    destacado: false
  },
  {
    id: 5,
    nombre: 'SITCAM Automation',
    descripcion: 'Automatización de procesos empresariales con workflows personalizados.',
    precio: 1499,
    categoria: 'software',
    imagen: '/images/automation.jpg',
    destacado: false
  },
  {
    id: 6,
    nombre: 'SITCAM AI',
    descripcion: 'Soluciones con inteligencia artificial y machine learning.',
    precio: 3999,
    categoria: 'ia',
    imagen: '/images/ai.jpg',
    destacado: false
  },
  {
    id: 7,
    nombre: 'Soporte Premium',
    descripcion: 'Soporte técnico 24/7 con atención prioritaria.',
    precio: 199,
    categoria: 'servicio',
    imagen: '/images/soporte.jpg',
    destacado: false
  },
  {
    id: 8,
    nombre: 'Capacitación',
    descripcion: 'Curso de capacitación para tu equipo (5 días).',
    precio: 499,
    categoria: 'servicio',
    imagen: '/images/capacitacion.jpg',
    destacado: false
  },
  {
    id: 9,
    nombre: 'SITCAM Security',
    descripcion: 'Solución de ciberseguridad con protección en tiempo real.',
    precio: 799,
    categoria: 'software',
    imagen: '/images/security.jpg',
    destacado: false
  }
];