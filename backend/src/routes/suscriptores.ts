import { Router } from 'express';
import { SuscriptorModel } from '../models/Suscriptor';
import { verificarToken } from '../middleware/auth';

const router = Router();


// POST /api/suscriptores - Suscribirse (público)
router.post('/', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'El email es requerido' });
      return;
    }
    
    // Verificar si ya existe
    const existe = SuscriptorModel.getByEmail(email);
    if (existe) {
      res.status(400).json({ error: 'Este email ya está suscrito' });
      return;
    }
    
    const id = SuscriptorModel.create(email);
    res.status(201).json({ id, message: 'Suscripción exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al suscribir' });
  }
});

// GET /api/suscriptores - Listar suscriptores (protegido)
router.get('/', verificarToken, (req, res) => {
  try {
    const suscriptores = SuscriptorModel.getAll();
    res.json(suscriptores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar suscriptores' });
  }
});

// DELETE /api/suscriptores/:email - Eliminar suscripción (protegido)
// DELETE /api/suscriptores/:email - Eliminar suscripción (protegido)
router.delete('/:email', verificarToken, (req, res) => {
  try {
    const email = req.params.email as string;
    const deleted = SuscriptorModel.delete(email);
    
    if (!deleted) {
      res.status(404).json({ error: 'Suscriptor no encontrado' });
      return;
    }
    
    res.json({ message: 'Suscripción eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

export default router;