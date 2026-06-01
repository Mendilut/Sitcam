import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'sitcam-secret-key-2025';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
  userRol?: string;
}

export const generarToken = (userId: number, email: string, rol: string) => {
  return jwt.sign({ userId, email, rol }, SECRET_KEY, { expiresIn: '8h' });
};

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string; rol: string };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRol = decoded.rol;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }
};