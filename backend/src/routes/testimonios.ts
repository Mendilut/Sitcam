import { Router } from 'express';
import { TestimonioModel } from '../models/Testimonio';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/testimonios - Listar testimonios (público)
router.get('/', (req, res) => {
  try {
    const testimonios = TestimonioModel.getAll();
    res.json(testimonios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar testimonios' });
  }
});

// GET /api/testimonios/admin - Listar testimonios (admin)
router.get('/admin', verificarToken, (req, res) => {
  try {
    const testimonios = TestimonioModel.getAllAdmin();
    res.json(testimonios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar testimonios' });
  }
});

// GET /api/testimonios/:id - Obtener un testimonio
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const testimonio = TestimonioModel.getById(id);
    
    if (!testimonio) {
      res.status(404).json({ error: 'Testimonio no encontrado' });
      return;
    }
    
    res.json(testimonio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener testimonio' });
  }
});

// POST /api/testimonios - Crear testimonio (protegido)
// POST /api/testimonios - Crear testimonio (público - clientes pueden enviar)
router.post('/', (req, res) => {
  try {
    const { nombre, email, rol, empresa, texto, rating, activo, imagen_data, imagen_tipo } = req.body;
    
    if (!nombre || !email || !texto) {
      res.status(400).json({ error: 'Nombre, email y texto son requeridos' });
      return;
    }
    
    // Los testimonios de clientes se guardan como inactivos (pendiente de aprobación)
    const id = TestimonioModel.create({
      nombre,
      email,
      rol: rol || '',
      empresa: empresa || '',
      texto,
      rating: rating || 5,
      activo: 1, // Pendiente de aprobación por el admin
      imagen_data: null,
      imagen_tipo: null
    });
    
    res.status(201).json({ id, message: 'Testimonio enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar testimonio' });
  }
});

// PUT /api/testimonios/:id - Actualizar testimonio (protegido)
router.put('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nombre, rol, empresa, texto, rating, activo, imagen_data, imagen_tipo } = req.body;
    
    const updated = TestimonioModel.update(id, {
      nombre,
      rol,
      empresa,
      texto,
      rating,
      activo,
      imagen_data,
      imagen_tipo
    });
    
    if (!updated) {
      res.status(404).json({ error: 'Testimonio no encontrado' });
      return;
    }
    
    res.json({ message: 'Testimonio actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar testimonio' });
  }
});

// DELETE /api/testimonios/:id - Eliminar testimonio (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const deleted = TestimonioModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Testimonio no encontrado' });
      return;
    }
    
    res.json({ message: 'Testimonio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar testimonio' });
  }
});

export default router;