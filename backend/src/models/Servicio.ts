import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Servicio {
  id: number;
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
  created_at: string;
}

export const ServicioModel = {
  // Obtener todos los servicios con filtros de búsqueda y paginación
  getAll: (filters: { search?: string; categoria_id?: number; page?: number; limit?: number }) => {
    const { search = '', categoria_id = 0, page = 1, limit = 6 } = filters;
    const offset = (page - 1) * limit;
    
    let query = `SELECT s.*, c.nombre as categoria_nombre 
                 FROM servicios s 
                 LEFT JOIN categorias c ON s.categoria_id = c.id 
                 WHERE 1=1`;
    const params: any[] = [];
    
    // Búsqueda por texto
    if (search && search.trim()) {
      const searchTerm = `%${search.toLowerCase()}%`;
      query += ' AND (LOWER(s.titulo) LIKE ? OR LOWER(s.descripcion) LIKE ?)';
      params.push(searchTerm, searchTerm);
      console.log('🔍 Buscando:', searchTerm);
    }
    
    // Filtro por categoría
    if (categoria_id && categoria_id > 0) {
      query += ' AND s.categoria_id = ?';
      params.push(categoria_id);
      console.log('🏷️ Filtrando por categoría:', categoria_id);
    }
    
    // Contar total
    const countQuery = query.replace('SELECT s.*, c.nombre as categoria_nombre', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as { total: number }).total;
    
    // Ordenar y paginar
    query += ' ORDER BY s.destacado DESC, s.orden ASC, s.id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const servicios = db.prepare(query).all(...params) as Servicio[];
    
    console.log(`📊 Resultado: ${servicios.length} de ${total} servicios`);
    
    return {
      servicios,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  // Obtener servicios destacados (sin paginación)
  getDestacados: (): Servicio[] => {
    const query = `SELECT s.*, c.nombre as categoria_nombre 
                   FROM servicios s 
                   LEFT JOIN categorias c ON s.categoria_id = c.id 
                   WHERE s.destacado = 1 
                   ORDER BY s.orden ASC, s.id ASC`;
    return db.prepare(query).all() as Servicio[];
  },
  
  // Obtener un servicio por ID
  getById: (id: number): Servicio | undefined => {
    const query = `SELECT s.*, c.nombre as categoria_nombre 
                   FROM servicios s 
                   LEFT JOIN categorias c ON s.categoria_id = c.id 
                   WHERE s.id = ?`;
    return db.prepare(query).get(id) as Servicio | undefined;
  },

  getSuggestions: (search: string, limit: number = 5): Array<{ id: number; titulo: string; icono: string | null }> => {
  if (!search || search.length < 2) return [];
  
  const normalized = `%${search.toLowerCase()}%`;
  
  const results = db.prepare(`
    SELECT id, titulo, icono 
    FROM servicios 
    WHERE LOWER(titulo) LIKE ? OR LOWER(descripcion) LIKE ?
    ORDER BY 
      CASE WHEN LOWER(titulo) LIKE ? THEN 1 ELSE 2 END,
      LENGTH(titulo)
    LIMIT ?
  `).all(normalized, normalized, normalized, limit) as Array<{ id: number; titulo: string; icono: string | null }>;
  
  return results;
},
  
  // Crear un nuevo servicio
  create: (servicio: Omit<Servicio, 'id' | 'created_at'>): number => {
    console.log('Creando servicio con categoria_id:', servicio.categoria_id);
    
    const result = db.prepare(`
      INSERT INTO servicios (
        titulo, 
        descripcion, 
        precio, 
        categoria_id, 
        icono, 
        destacado, 
        orden, 
        imagen_data, 
        imagen_tipo,
        caracteristicas,
        tiempo_entrega,
        garantia,
        incluye
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      servicio.titulo,
      servicio.descripcion,
      servicio.precio,
      servicio.categoria_id,
      servicio.icono,
      servicio.destacado || 0,
      servicio.orden || 0,
      servicio.imagen_data || null,
      servicio.imagen_tipo || null,
      servicio.caracteristicas || null,
      servicio.tiempo_entrega || null,
      servicio.garantia || null,
      servicio.incluye || null
    );
    return result.lastInsertRowid as number;
  },
  
  // Actualizar un servicio
  update: (id: number, servicio: Partial<Servicio>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (servicio.titulo !== undefined) {
      fields.push('titulo = ?');
      values.push(servicio.titulo);
    }
    if (servicio.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(servicio.descripcion);
    }
    if (servicio.precio !== undefined) {
      fields.push('precio = ?');
      values.push(servicio.precio);
    }
    if (servicio.categoria_id !== undefined) {
      fields.push('categoria_id = ?');
      values.push(servicio.categoria_id);
    }
    if (servicio.icono !== undefined) {
      fields.push('icono = ?');
      values.push(servicio.icono);
    }
    if (servicio.destacado !== undefined) {
      fields.push('destacado = ?');
      values.push(servicio.destacado);
    }
    if (servicio.orden !== undefined) {
      fields.push('orden = ?');
      values.push(servicio.orden);
    }
    if (servicio.imagen_data !== undefined) {
      fields.push('imagen_data = ?');
      values.push(servicio.imagen_data);
    }
    if (servicio.imagen_tipo !== undefined) {
      fields.push('imagen_tipo = ?');
      values.push(servicio.imagen_tipo);
    }
    if (servicio.caracteristicas !== undefined) {
      fields.push('caracteristicas = ?');
      values.push(servicio.caracteristicas);
    }
    if (servicio.tiempo_entrega !== undefined) {
      fields.push('tiempo_entrega = ?');
      values.push(servicio.tiempo_entrega);
    }
    if (servicio.garantia !== undefined) {
      fields.push('garantia = ?');
      values.push(servicio.garantia);
    }
    if (servicio.incluye !== undefined) {
      fields.push('incluye = ?');
      values.push(servicio.incluye);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE servicios SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Eliminar un servicio
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM servicios WHERE id = ?').run(id);
    return result.changes > 0;
  }
};