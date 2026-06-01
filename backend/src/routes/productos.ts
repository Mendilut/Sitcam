import { Router } from 'express';
import { ProductoModel } from '../models/Producto';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/productos - Listar productos (público)
router.get('/', (req, res) => {
  const { search = '', categoria_id = '', page = '1', limit = '6' } = req.query;
  
  const result = ProductoModel.getAll({
    search: search as string,
    categoria_id: parseInt(categoria_id as string) || 0,
    page: parseInt(page as string),
    limit: parseInt(limit as string)
  });
  
  res.json(result);
});

// GET /api/productos/:id - Obtener un producto (público)
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id as string);
  const producto = ProductoModel.getById(id);
  
  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  
  res.json(producto);
});

// POST /api/productos - Crear producto (protegido)
router.post('/', verificarToken, (req, res) => {
  const { 
    nombre, 
    descripcion, 
    precio, 
    categoria_id, 
    imagen_data, 
    imagen_tipo, 
    destacado,
    caracteristicas,
    tiempo_entrega,
    garantia,
    incluye
  } = req.body;
  
  console.log('Creando producto:', { nombre, precio, categoria_id, caracteristicas: caracteristicas ? 'Sí' : 'No' });
  
  if (!nombre || !descripcion || !precio || !categoria_id) {
    res.status(400).json({ error: 'Faltan campos requeridos' });
    return;
  }
  
  const id = ProductoModel.create({
    nombre,
    descripcion,
    precio,
    categoria_id,
    imagen_data,
    imagen_tipo,
    destacado: destacado || 0,
    caracteristicas,
    tiempo_entrega,
    garantia,
    incluye
  });
  
  res.status(201).json({ id, message: 'Producto creado correctamente' });
});

// PUT /api/productos/:id - Actualizar producto (protegido)
router.put('/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id as string);
  const { 
    nombre, 
    descripcion, 
    precio, 
    categoria_id, 
    imagen_data, 
    imagen_tipo, 
    destacado,
    caracteristicas,
    tiempo_entrega,
    garantia,
    incluye
  } = req.body;
  
  console.log('Actualizando producto ID:', id);
  console.log('Campos recibidos:', { 
    nombre, 
    precio, 
    categoria_id, 
    caracteristicas: caracteristicas ? 'Sí' : 'No',
    tiempo_entrega,
    garantia,
    incluye: incluye ? 'Sí' : 'No'
  });
  
  const updated = ProductoModel.update(id, {
    nombre,
    descripcion,
    precio,
    categoria_id,
    imagen_data,
    imagen_tipo,
    destacado,
    caracteristicas,
    tiempo_entrega,
    garantia,
    incluye
  });
  
  if (!updated) {
    res.status(404).json({ error: 'Producto no encontrado o no se pudo actualizar' });
    return;
  }
  
  res.json({ message: 'Producto actualizado correctamente' });
});

// DELETE /api/productos/:id - Eliminar producto (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id as string);
  
  const deleted = ProductoModel.delete(id);
  
  if (!deleted) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  
  res.json({ message: 'Producto eliminado correctamente' });
});

export default router;