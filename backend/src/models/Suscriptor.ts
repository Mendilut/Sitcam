import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Suscriptor {
  id: number;
  email: string;
  activo: number;
  fecha_suscripcion: string;
}

export const SuscriptorModel = {
  // Obtener todos los suscriptores
  getAll: (): Suscriptor[] => {
    return db.prepare('SELECT * FROM suscriptores ORDER BY fecha_suscripcion DESC').all() as Suscriptor[];
  },
  
  // Obtener suscriptor por email
  getByEmail: (email: string): Suscriptor | undefined => {
    return db.prepare('SELECT * FROM suscriptores WHERE email = ?').get(email) as Suscriptor | undefined;
  },
  
  // Crear nueva suscripción
  create: (email: string): number => {
    const result = db.prepare(`
      INSERT INTO suscriptores (email)
      VALUES (?)
    `).run(email);
    return result.lastInsertRowid as number;
  },
  
  // Eliminar suscripción
  delete: (email: string): boolean => {
    const result = db.prepare('DELETE FROM suscriptores WHERE email = ?').run(email);
    return result.changes > 0;
  }
};