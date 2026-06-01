import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  destacado: number;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
  created_at: string;
}

export const ProductoModel = {
  // Obtener todos los productos con filtros y paginación
  getAll: (filters: { search?: string; categoria_id?: number; page?: number; limit?: number }) => {
    const { search = '', categoria_id = 0, page = 1, limit = 6 } = filters;
    const offset = (page - 1) * limit;
    
    let query = `SELECT p.*, c.nombre as categoria_nombre 
                 FROM productos p 
                 LEFT JOIN categorias c ON p.categoria_id = c.id 
                 WHERE 1=1`;
    const params: any[] = [];
    
    if (search) {
      query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (categoria_id && categoria_id > 0) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }
    
    const countQuery = query.replace('SELECT p.*, c.nombre as categoria_nombre', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as { total: number }).total;
    
    query += ' ORDER BY p.destacado DESC, p.id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const productos = db.prepare(query).all(...params) as Producto[];
    
    return {
      productos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  // Obtener un producto por ID
  getById: (id: number): Producto | undefined => {
    return db.prepare('SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?').get(id) as Producto | undefined;
  },
  
  // Crear un nuevo producto
  create: (producto: Omit<Producto, 'id' | 'created_at'>): number => {
    console.log('Creando producto con categoria_id:', producto.categoria_id);
    
    const result = db.prepare(`
      INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_data, imagen_tipo, destacado, caracteristicas, tiempo_entrega, garantia, incluye)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.categoria_id,
      producto.imagen_data || null,
      producto.imagen_tipo || null,
      producto.destacado || 0,
      producto.caracteristicas || null,
      producto.tiempo_entrega || null,
      producto.garantia || null,
      producto.incluye || null
    );
    return result.lastInsertRowid as number;
  },
  
  // Actualizar un producto
  update: (id: number, producto: Partial<Producto>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (producto.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(producto.nombre);
    }
    if (producto.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(producto.descripcion);
    }
    if (producto.precio !== undefined) {
      fields.push('precio = ?');
      values.push(producto.precio);
    }
    if (producto.categoria_id !== undefined) {
      fields.push('categoria_id = ?');
      values.push(producto.categoria_id);
    }
    if (producto.imagen_data !== undefined) {
      fields.push('imagen_data = ?');
      values.push(producto.imagen_data);
    }
    if (producto.imagen_tipo !== undefined) {
      fields.push('imagen_tipo = ?');
      values.push(producto.imagen_tipo);
    }
    if (producto.destacado !== undefined) {
      fields.push('destacado = ?');
      values.push(producto.destacado);
    }
    if (producto.caracteristicas !== undefined) {
      fields.push('caracteristicas = ?');
      values.push(producto.caracteristicas);
    }
    if (producto.tiempo_entrega !== undefined) {
      fields.push('tiempo_entrega = ?');
      values.push(producto.tiempo_entrega);
    }
    if (producto.garantia !== undefined) {
      fields.push('garantia = ?');
      values.push(producto.garantia);
    }
    if (producto.incluye !== undefined) {
      fields.push('incluye = ?');
      values.push(producto.incluye);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE productos SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Eliminar un producto
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM productos WHERE id = ?').run(id);
    return result.changes > 0;
  }
};