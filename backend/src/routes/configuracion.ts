import { Router } from 'express';
import { ConfiguracionModel } from '../models/Configuracion';
import { verificarToken } from '../middleware/auth';

const router = Router();

// GET /api/configuracion - Obtener todas las configuraciones (público)
router.get('/', (req, res) => {
  try {
    const configuracion = ConfiguracionModel.getAll();
    // Convertir a objeto clave:valor para fácil consumo
    const configObject: { [key: string]: string } = {};
    configuracion.forEach(item => {
      configObject[item.clave] = item.valor;
    });
    res.json(configObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar configuración' });
  }
});

// GET /api/configuracion/admin - Obtener todas las configuraciones (admin)
router.get('/admin', verificarToken, (req, res) => {
  try {
    const configuracion = ConfiguracionModel.getAll();
    res.json(configuracion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar configuración' });
  }
});


// PUT /api/configuracion/:clave - Actualizar una configuración (protegido)
router.put('/:clave', verificarToken, (req, res) => {
  try {
    const clave = req.params.clave as string;
    const { valor } = req.body;
    
    if (!valor) {
      res.status(400).json({ error: 'El valor es requerido' });
      return;
    }
    
    const updated = ConfiguracionModel.update(clave, valor);
    
    if (!updated) {
      res.status(404).json({ error: 'Configuración no encontrada' });
      return;
    }
    
    res.json({ message: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

// PUT /api/configuracion - Actualizar múltiples configuraciones (protegido)
router.put('/', verificarToken, (req, res) => {
  try {
    const configs = req.body;
    
    if (!Array.isArray(configs)) {
      res.status(400).json({ error: 'Se requiere un array de configuraciones' });
      return;
    }
    
    ConfiguracionModel.updateMultiple(configs);
    res.json({ message: 'Configuraciones actualizadas correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar configuraciones' });
  }
});

export default router;