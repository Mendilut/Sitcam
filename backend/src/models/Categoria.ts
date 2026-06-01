import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  tipo: string;
  activo: number;
  orden: number;
  created_at: string;
}

export const CategoriaModel = {
  // Obtener todas las categorías activas
  getAll: (): Categoria[] => {
    return db.prepare('SELECT * FROM categorias WHERE activo = 1 ORDER BY tipo, orden ASC').all() as Categoria[];
  },
  
  // Obtener todas las categorías (admin)
  getAllAdmin: (): Categoria[] => {
    return db.prepare('SELECT * FROM categorias ORDER BY tipo, orden ASC').all() as Categoria[];
  },
  
  // Obtener una categoría por ID
  getById: (id: number): Categoria | undefined => {
    return db.prepare('SELECT * FROM categorias WHERE id = ?').get(id) as Categoria | undefined;
  },
  
  // Crear una nueva categoría
  create: (categoria: Omit<Categoria, 'id' | 'created_at'>): number => {
    const result = db.prepare(`
      INSERT INTO categorias (nombre, descripcion, icono, tipo, activo, orden)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      categoria.nombre,
      categoria.descripcion || null,
      categoria.icono || null,
      categoria.tipo,
      categoria.activo !== undefined ? categoria.activo : 1,
      categoria.orden || 0
    );
    return result.lastInsertRowid as number;
  },
  
  // Actualizar una categoría
  update: (id: number, categoria: Partial<Categoria>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (categoria.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(categoria.nombre);
    }
    if (categoria.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(categoria.descripcion);
    }
    if (categoria.icono !== undefined) {
      fields.push('icono = ?');
      values.push(categoria.icono);
    }
    if (categoria.tipo !== undefined) {
      fields.push('tipo = ?');
      values.push(categoria.tipo);
    }
    if (categoria.activo !== undefined) {
      fields.push('activo = ?');
      values.push(categoria.activo);
    }
    if (categoria.orden !== undefined) {
      fields.push('orden = ?');
      values.push(categoria.orden);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Eliminar una categoría (solo si no tiene productos o servicios asociados)
  delete: (id: number): boolean => {
    // Verificar si hay productos con esta categoría
    const productos = db.prepare('SELECT COUNT(*) as total FROM productos WHERE categoria_id = ?').get(id) as { total: number };
    if (productos.total > 0) {
      return false;
    }
    // Verificar si hay servicios con esta categoría
    const servicios = db.prepare('SELECT COUNT(*) as total FROM servicios WHERE categoria_id = ?').get(id) as { total: number };
    if (servicios.total > 0) {
      return false;
    }
    const result = db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
    return result.changes > 0;
  }
};