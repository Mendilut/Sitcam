import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  leido: number;
  respondido: number;
  created_at: string;
}

export const MensajeModel = {
  // Obtener todos los mensajes
  getAll: (): Mensaje[] => {
    return db.prepare('SELECT * FROM mensajes_contacto ORDER BY created_at DESC').all() as Mensaje[];
  },
  
  // Obtener mensajes no leídos
  getNoLeidos: (): Mensaje[] => {
    return db.prepare('SELECT * FROM mensajes_contacto WHERE leido = 0 ORDER BY created_at DESC').all() as Mensaje[];
  },
  
  // Obtener un mensaje por ID
  getById: (id: number): Mensaje | undefined => {
    return db.prepare('SELECT * FROM mensajes_contacto WHERE id = ?').get(id) as Mensaje | undefined;
  },
  
  // Crear un nuevo mensaje
  create: (mensaje: Omit<Mensaje, 'id' | 'created_at' | 'leido' | 'respondido'>): number => {
    const result = db.prepare(`
      INSERT INTO mensajes_contacto (nombre, email, telefono, mensaje)
      VALUES (?, ?, ?, ?)
    `).run(
      mensaje.nombre,
      mensaje.email,
      mensaje.telefono || null,
      mensaje.mensaje
    );
    return result.lastInsertRowid as number;
  },
  
  // Marcar mensaje como leído
  marcarLeido: (id: number): boolean => {
    const result = db.prepare('UPDATE mensajes_contacto SET leido = 1 WHERE id = ?').run(id);
    return result.changes > 0;
  },
  
  // Marcar mensaje como respondido
  marcarRespondido: (id: number): boolean => {
    const result = db.prepare('UPDATE mensajes_contacto SET respondido = 1 WHERE id = ?').run(id);
    return result.changes > 0;
  },
  
  // Eliminar un mensaje
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM mensajes_contacto WHERE id = ?').run(id);
    return result.changes > 0;
  }
};