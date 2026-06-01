import { Router } from 'express';
import { UsuarioModel } from '../models/Usuario';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/usuarios - Obtener todos los usuarios (protegido)
router.get('/', verificarToken, (req, res) => {
  try {
    const usuarios = UsuarioModel.getAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar usuarios' });
  }
});

// GET /api/usuarios/:id - Obtener un usuario (protegido)
router.get('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const usuario = UsuarioModel.getById(id);
    
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/usuarios - Crear usuario (protegido)
router.post('/', verificarToken, (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;
    
    if (!email || !password || !nombre || !rol) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }
    
    const id = UsuarioModel.create({ email, password, nombre, rol });
    res.status(201).json({ id, message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario (protegido)
router.put('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { email, nombre, rol, activo } = req.body;
    
    const updated = UsuarioModel.update(id, { email, nombre, rol, activo });
    
    if (!updated) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// PUT /api/usuarios/:id/password - Cambiar contraseña (protegido)
router.put('/:id/password', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { password } = req.body;
    
    if (!password) {
      res.status(400).json({ error: 'La contraseña es requerida' });
      return;
    }
    
    const updated = UsuarioModel.cambiarPassword(id, password);
    
    if (!updated) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (id === 1) {
      res.status(400).json({ error: 'No se puede eliminar el usuario administrador principal' });
      return;
    }
    
    const deleted = UsuarioModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;