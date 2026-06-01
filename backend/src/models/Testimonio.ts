import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Testimonio {
  id: number;
  nombre: string;
  email: string | null;
  rol: string;
  empresa: string | null;
  texto: string;
  rating: number;
  activo: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  created_at: string;
}

export const TestimonioModel = {
  // Obtener todos los testimonios activos (público)
  getAll: (): Testimonio[] => {
    return db.prepare('SELECT * FROM testimonios WHERE activo = 1 ORDER BY created_at DESC').all() as Testimonio[];
  },
  
  // Obtener todos los testimonios (admin)
  getAllAdmin: (): Testimonio[] => {
    return db.prepare('SELECT * FROM testimonios ORDER BY created_at DESC').all() as Testimonio[];
  },
  
  // Obtener un testimonio por ID
  getById: (id: number): Testimonio | undefined => {
    return db.prepare('SELECT * FROM testimonios WHERE id = ?').get(id) as Testimonio | undefined;
  },
  
  // Crear un testimonio
  create: (testimonio: Omit<Testimonio, 'id' | 'created_at'>): number => {
    console.log('Creando testimonio:', { nombre: testimonio.nombre, email: testimonio.email });
    
    const result = db.prepare(`
      INSERT INTO testimonios (nombre, email, rol, empresa, texto, rating, activo, imagen_data, imagen_tipo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testimonio.nombre,
      testimonio.email || null,
      testimonio.rol || '',
      testimonio.empresa || null,
      testimonio.texto,
      testimonio.rating || 5,
      testimonio.activo !== undefined ? testimonio.activo : 1,
      testimonio.imagen_data || null,
      testimonio.imagen_tipo || null
    );
    return result.lastInsertRowid as number;
  },
  
  // Actualizar un testimonio
  update: (id: number, testimonio: Partial<Testimonio>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (testimonio.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(testimonio.nombre);
    }
    if (testimonio.email !== undefined) {
      fields.push('email = ?');
      values.push(testimonio.email);
    }
    if (testimonio.rol !== undefined) {
      fields.push('rol = ?');
      values.push(testimonio.rol);
    }
    if (testimonio.empresa !== undefined) {
      fields.push('empresa = ?');
      values.push(testimonio.empresa);
    }
    if (testimonio.texto !== undefined) {
      fields.push('texto = ?');
      values.push(testimonio.texto);
    }
    if (testimonio.rating !== undefined) {
      fields.push('rating = ?');
      values.push(testimonio.rating);
    }
    if (testimonio.activo !== undefined) {
      fields.push('activo = ?');
      values.push(testimonio.activo);
    }
    if (testimonio.imagen_data !== undefined) {
      fields.push('imagen_data = ?');
      values.push(testimonio.imagen_data);
    }
    if (testimonio.imagen_tipo !== undefined) {
      fields.push('imagen_tipo = ?');
      values.push(testimonio.imagen_tipo);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE testimonios SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Eliminar un testimonio
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM testimonios WHERE id = ?').run(id);
    return result.changes > 0;
  }
};