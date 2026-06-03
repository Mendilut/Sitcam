export interface ProductoFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria_id: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  destacado: number;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria_id: number;
  categoria_nombre?: string;
  imagen_data: string | null;
  imagen_tipo: string | null;
  destacado: number;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
  created_at: string;
}

export interface Producto extends ProductoFormData {
  id: number;
  created_at: string;
}

export interface TestimonioFormData {
  id?: number;
  nombre: string;
  email?: string;
  rol: string;
  empresa: string;
  texto: string;
  rating: number;
  activo: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
}


export interface Testimonio extends TestimonioFormData {
  id: number;
  created_at: string;
}
export interface ServicioFormData {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  icono: string;
  destacado: number;
  orden: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
}

export interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  categoria_nombre?: string;
  icono: string;
  destacado: number;
  orden: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
  created_at: string;
}


export interface Servicio extends ServicioFormData {
  id: number;
  created_at: string;
}

// ========== EQUIPO ==========
export interface MiembroEquipoFormData {
  id?: number;
  nombre: string;
  cargo: string;
  descripcion: string;
  imagen_url: string | null;
  orden: number;
  activo: number;
}

export interface MiembroEquipo extends MiembroEquipoFormData {
  id: number;
  created_at: string;
}