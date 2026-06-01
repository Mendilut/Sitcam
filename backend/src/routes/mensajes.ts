import { Router } from 'express';
import { MensajeModel } from '../models/Mensaje';
import { verificarToken } from '../middleware/auth';
import { getIO } from '../socket';

const router = Router();

// GET /api/mensajes - Obtener todos los mensajes (protegido)
router.get('/', verificarToken, (req, res) => {
  try {
    const mensajes = MensajeModel.getAll();
    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

// GET /api/mensajes/noleidos - Obtener mensajes no leídos (protegido)
router.get('/noleidos', verificarToken, (req, res) => {
  try {
    const mensajes = MensajeModel.getNoLeidos();
    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

// GET /api/mensajes/:id - Obtener un mensaje (protegido)
router.get('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const mensaje = MensajeModel.getById(id);
    
    if (!mensaje) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }
    
    res.json(mensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensaje' });
  }
});

// POST /api/mensajes - Crear un mensaje (público)
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    
    if (!nombre || !email || !mensaje) {
      res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' });
      return;
    }
    
    const id = MensajeModel.create({ nombre, email, telefono, mensaje });
    
    // Emitir notificación a todos los clientes conectados
    const io = getIO();
    io.emit('nuevo-mensaje', {
      id,
      nombre,
      email,
      mensaje: mensaje.substring(0, 100),
      created_at: new Date().toISOString()
    });
    
    console.log(`📨 Mensaje de ${nombre} - Notificación enviada`);
    
    res.status(201).json({ id, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// PUT /api/mensajes/:id/leido - Marcar como leído (protegido)
router.put('/:id/leido', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const updated = MensajeModel.marcarLeido(id);
    
    if (!updated) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }
    
    res.json({ message: 'Mensaje marcado como leído' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

// PUT /api/mensajes/:id/respondido - Marcar como respondido (protegido)
router.put('/:id/respondido', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const updated = MensajeModel.marcarRespondido(id);
    
    if (!updated) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }
    
    res.json({ message: 'Mensaje marcado como respondido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

// DELETE /api/mensajes/:id - Eliminar mensaje (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    const deleted = MensajeModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }
    
    res.json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

export default router;