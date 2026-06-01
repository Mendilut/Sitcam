import { Router } from 'express';
import { CategoriaModel } from '../models/Categoria';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/categorias/public - Listar categorías (público)
router.get('/public', (req, res) => {
  try {
    const categorias = CategoriaModel.getAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar categorías' });
  }
});

// GET /api/categorias - Solo admin (protegido)
router.get('/', verificarToken, (req, res) => {
  try {
    const categorias = CategoriaModel.getAllAdmin();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar categorías' });
  }
});
// GET /api/categorias - Solo admin (protegido)
router.get('/', verificarToken, (req, res) => {
  try {
    const categorias = CategoriaModel.getAllAdmin();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar categorías' });
  }
});

// GET /api/categorias/:id - Solo admin (protegido)
router.get('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const categoria = CategoriaModel.getById(id);
    if (!categoria) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// POST /api/categorias - Crear categoría (protegido)
router.post('/', verificarToken, (req, res) => {
  try {
    const { nombre, descripcion, icono, tipo, activo, orden } = req.body;
    
    if (!nombre || !tipo) {
      res.status(400).json({ error: 'Nombre y tipo son requeridos' });
      return;
    }
    
    const id = CategoriaModel.create({ nombre, descripcion, icono, tipo, activo, orden });
    res.status(201).json({ id, message: 'Categoría creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// PUT /api/categorias/:id - Actualizar categoría (protegido)
router.put('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nombre, descripcion, icono, tipo, activo, orden } = req.body;
    
    const updated = CategoriaModel.update(id, { nombre, descripcion, icono, tipo, activo, orden });
    
    if (!updated) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    
    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// DELETE /api/categorias/:id - Eliminar categoría (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const deleted = CategoriaModel.delete(id);
    
    if (!deleted) {
      res.status(400).json({ error: 'No se puede eliminar la categoría porque tiene productos o servicios asociados' });
      return;
    }
    
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

export default router;