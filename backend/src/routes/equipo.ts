import { Router } from 'express';
import { EquipoModel } from '../models/Equipo';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/equipo - Listar equipo (público)
router.get('/', (req, res) => {
  try {
    const equipo = EquipoModel.getAll();
    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar equipo' });
  }
});

// GET /api/equipo/admin - Listar equipo (admin)
router.get('/admin', verificarToken, (req, res) => {
  try {
    const equipo = EquipoModel.getAllAdmin();
    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar equipo' });
  }
});

// POST /api/equipo - Crear miembro (admin)
router.post('/', verificarToken, (req, res) => {
  try {
    const { nombre, cargo, descripcion, imagen_url, orden, activo } = req.body;
    
    if (!nombre || !cargo) {
      res.status(400).json({ error: 'Nombre y cargo son requeridos' });
      return;
    }
    
    const id = EquipoModel.create({ nombre, cargo, descripcion, imagen_url, orden, activo });
    res.status(201).json({ id, message: 'Miembro agregado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear miembro' });
  }
});

// PUT /api/equipo/:id - Actualizar miembro (admin)
router.put('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nombre, cargo, descripcion, imagen_url, orden, activo } = req.body;
    
    const updated = EquipoModel.update(id, { nombre, cargo, descripcion, imagen_url, orden, activo });
    
    if (!updated) {
      res.status(404).json({ error: 'Miembro no encontrado' });
      return;
    }
    
    res.json({ message: 'Miembro actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE /api/equipo/:id - Eliminar miembro (admin)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const deleted = EquipoModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Miembro no encontrado' });
      return;
    }
    
    res.json({ message: 'Miembro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

export default router;