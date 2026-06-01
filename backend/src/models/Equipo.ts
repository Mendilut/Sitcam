import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
  activo: number;
  created_at: string;
}

export const EquipoModel = {
  // Obtener todos los miembros activos (público)
  getAll: (): MiembroEquipo[] => {
    return db.prepare('SELECT * FROM equipo WHERE activo = 1 ORDER BY orden ASC').all() as MiembroEquipo[];
  },
  
  // Obtener todos (admin)
  getAllAdmin: (): MiembroEquipo[] => {
    return db.prepare('SELECT * FROM equipo ORDER BY orden ASC').all() as MiembroEquipo[];
  },
  
  // Obtener por ID
  getById: (id: number): MiembroEquipo | undefined => {
    return db.prepare('SELECT * FROM equipo WHERE id = ?').get(id) as MiembroEquipo | undefined;
  },
  
  // Crear
  create: (miembro: Omit<MiembroEquipo, 'id' | 'created_at'>): number => {
    const result = db.prepare(`
      INSERT INTO equipo (nombre, cargo, descripcion, imagen_url, orden, activo)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      miembro.nombre,
      miembro.cargo,
      miembro.descripcion || null,
      miembro.imagen_url || null,
      miembro.orden || 0,
      miembro.activo !== undefined ? miembro.activo : 1
    );
    return result.lastInsertRowid as number;
  },
  
  // Actualizar
  update: (id: number, miembro: Partial<MiembroEquipo>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (miembro.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(miembro.nombre);
    }
    if (miembro.cargo !== undefined) {
      fields.push('cargo = ?');
      values.push(miembro.cargo);
    }
    if (miembro.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(miembro.descripcion);
    }
    if (miembro.imagen_url !== undefined) {
      fields.push('imagen_url = ?');
      values.push(miembro.imagen_url);
    }
    if (miembro.orden !== undefined) {
      fields.push('orden = ?');
      values.push(miembro.orden);
    }
    if (miembro.activo !== undefined) {
      fields.push('activo = ?');
      values.push(miembro.activo);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE equipo SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Eliminar
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM equipo WHERE id = ?').run(id);
    return result.changes > 0;
  }
};