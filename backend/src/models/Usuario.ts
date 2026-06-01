import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: number;
  created_at: string;
}

export const UsuarioModel = {
  // Obtener todos los usuarios
  getAll: (): Usuario[] => {
    return db.prepare('SELECT id, email, nombre, rol, activo, created_at FROM usuarios ORDER BY id ASC').all() as Usuario[];
  },
  
  // Obtener un usuario por ID
  getById: (id: number): Usuario | undefined => {
    return db.prepare('SELECT id, email, nombre, rol, activo, created_at FROM usuarios WHERE id = ?').get(id) as Usuario | undefined;
  },
  
  // Verificar credenciales
  verifyCredentials: (email: string, password: string): Usuario | null => {
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ? AND activo = 1').get(email) as any;
    
    if (!user) return null;
    
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return null;
    
    const { password: _, ...usuarioSinPassword } = user;
    return usuarioSinPassword as Usuario;
  },
  
  // Crear un nuevo usuario
  create: (usuario: { email: string; password: string; nombre: string; rol: string }): number => {
    const hashedPassword = bcrypt.hashSync(usuario.password, 10);
    const result = db.prepare(`
      INSERT INTO usuarios (email, password, nombre, rol, activo)
      VALUES (?, ?, ?, ?, 1)
    `).run(usuario.email, hashedPassword, usuario.nombre, usuario.rol);
    return result.lastInsertRowid as number;
  },
  
  // Actualizar un usuario
  update: (id: number, usuario: Partial<{ email: string; nombre: string; rol: string; activo: number }>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (usuario.email !== undefined) {
      fields.push('email = ?');
      values.push(usuario.email);
    }
    if (usuario.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(usuario.nombre);
    }
    if (usuario.rol !== undefined) {
      fields.push('rol = ?');
      values.push(usuario.rol);
    }
    if (usuario.activo !== undefined) {
      fields.push('activo = ?');
      values.push(usuario.activo);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = db.prepare(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
  },
  
  // Cambiar contraseña
  cambiarPassword: (id: number, nuevaPassword: string): boolean => {
    const hashedPassword = bcrypt.hashSync(nuevaPassword, 10);
    const result = db.prepare('UPDATE usuarios SET password = ? WHERE id = ?').run(hashedPassword, id);
    return result.changes > 0;
  },
  
  // Eliminar un usuario
  delete: (id: number): boolean => {
    // No permitir eliminar el usuario admin principal (id=1)
    if (id === 1) return false;
    const result = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
    return result.changes > 0;
  }
};