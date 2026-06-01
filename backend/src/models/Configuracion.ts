import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

export interface Configuracion {
  id: number;
  clave: string;
  valor: string;
  tipo: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export const ConfiguracionModel = {
  // Obtener todas las configuraciones
  getAll: (): Configuracion[] => {
    return db.prepare('SELECT * FROM configuracion ORDER BY id ASC').all() as Configuracion[];
  },
  
  // Obtener una configuración por clave
  getByClave: (clave: string): Configuracion | undefined => {
    return db.prepare('SELECT * FROM configuracion WHERE clave = ?').get(clave) as Configuracion | undefined;
  },
  
  // Actualizar una configuración
  update: (clave: string, valor: string): boolean => {
    const result = db.prepare(`
      UPDATE configuracion 
      SET valor = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE clave = ?
    `).run(valor, clave);
    return result.changes > 0;
  },
  
  // Actualizar múltiples configuraciones
  updateMultiple: (configs: { clave: string; valor: string }[]): boolean => {
    const updateStmt = db.prepare(`
      UPDATE configuracion 
      SET valor = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE clave = ?
    `);
    
    for (const config of configs) {
      updateStmt.run(config.valor, config.clave);
    }
    return true;
  }
};