import { Router } from 'express';
import { UsuarioModel } from '../models/Usuario';
import { generarToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña son requeridos' });
    return;
  }
  
  const usuario = UsuarioModel.verifyCredentials(email, password);
  
  if (!usuario) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }
  
  const token = generarToken(usuario.id, usuario.email, usuario.rol);
  
  res.json({
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    }
  });
});

// GET /api/auth/verify - Verificar token (para mantener sesión)
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const jwt = require('jsonwebtoken');
    const SECRET_KEY = process.env.JWT_SECRET || 'sitcam-secret-key-2025';
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token inválido' });
  }
});

export default router;