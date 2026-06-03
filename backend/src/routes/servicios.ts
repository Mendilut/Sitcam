import { Router } from 'express';
import { ServicioModel } from '../models/Servicio';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/servicios - Listar servicios con filtros (público)
router.get('/', (req, res) => {
  const { search = '', categoria_id = '', page = '1', limit = '6' } = req.query;
  
  console.log('📥 Parámetros recibidos en backend:', { search, categoria_id, page, limit });
  
  const result = ServicioModel.getAll({
    search: search as string,
    categoria_id: parseInt(categoria_id as string) || 0,
    page: parseInt(page as string),
    limit: parseInt(limit as string)
  });
  
  console.log('📤 Enviando:', result.servicios.length, 'de', result.total);
  res.json(result);
});

// GET /api/servicios/:id - Obtener un servicio (público)
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const servicio = ServicioModel.getById(id);
    
    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }
    
    res.json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
});

// GET /api/servicios/suggest - Sugerencias para autocompletado
router.get('/suggest', (req, res) => {
  const { q = '', limit = '5' } = req.query;
  
  if (!q || (q as string).length < 2) {
    res.json([]);
    return;
  }
  
  const suggestions = ServicioModel.getSuggestions(q as string, parseInt(limit as string));
  res.json(suggestions);
});

// POST /api/servicios - Crear servicio (protegido)
router.post('/', verificarToken, (req, res) => {
  try {
    const { 
      titulo, 
      descripcion, 
      precio, 
      categoria_id, 
      icono, 
      destacado, 
      orden, 
      imagen_data, 
      imagen_tipo,
      caracteristicas,
      tiempo_entrega,
      garantia,
      incluye
    } = req.body;
    
    console.log('📝 Creando servicio:', { 
      titulo, 
      precio, 
      categoria_id, 
      icono,
      caracteristicas: caracteristicas ? 'Sí' : 'No'
    });
    
    if (!titulo || !descripcion || !precio || !categoria_id || !icono) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }
    
    const id = ServicioModel.create({
      titulo,
      descripcion,
      precio,
      categoria_id,
      icono,
      destacado: destacado || 0,
      orden: orden || 0,
      imagen_data,
      imagen_tipo,
      caracteristicas,
      tiempo_entrega,
      garantia,
      incluye
    });
    
    res.status(201).json({ id, message: 'Servicio creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

// PUT /api/servicios/:id - Actualizar servicio (protegido)
router.put('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const { 
      titulo, 
      descripcion, 
      precio, 
      categoria_id, 
      icono, 
      destacado, 
      orden, 
      imagen_data, 
      imagen_tipo,
      caracteristicas,
      tiempo_entrega,
      garantia,
      incluye
    } = req.body;
    
    console.log('✏️ Actualizando servicio ID:', id);
    console.log('📋 Datos recibidos:', { 
      titulo, 
      precio, 
      categoria_id, 
      icono,
      caracteristicas: caracteristicas ? 'Sí' : 'No',
      tiempo_entrega,
      garantia,
      incluye: incluye ? 'Sí' : 'No'
    });
    
    const updated = ServicioModel.update(id, {
      titulo,
      descripcion,
      precio,
      categoria_id,
      icono,
      destacado,
      orden,
      imagen_data,
      imagen_tipo,
      caracteristicas,
      tiempo_entrega,
      garantia,
      incluye
    });
    
    if (!updated) {
      res.status(404).json({ error: 'Servicio no encontrado o no se pudo actualizar' });
      return;
    }
    
    res.json({ message: 'Servicio actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

// DELETE /api/servicios/:id - Eliminar servicio (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    
    const deleted = ServicioModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }
    
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

export default router;