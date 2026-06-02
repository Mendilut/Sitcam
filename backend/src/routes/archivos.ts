import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verificarToken } from '../middleware/auth';

const router = Router();

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../../frontend/public/docs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'proforma-contrato.zip');
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos ZIP'));
    }
  }
});

// GET /api/archivos/proforma - Verificar si existe
router.get('/proforma', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../../frontend/public/docs/proforma-contrato.zip');
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      res.json({
        exists: true,
        size: stats.size,
        modified: stats.mtime,
        url: '/docs/proforma-contrato.zip'
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar archivo' });
  }
});

// POST /api/archivos/proforma - Subir nueva proforma (protegido)
router.post('/proforma', verificarToken, upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha subido ningún archivo' });
      return;
    }
    
    res.json({ 
      message: 'Proforma actualizada correctamente',
      file: {
        name: 'proforma-contrato.zip',
        size: req.file.size,
        url: '/docs/proforma-contrato.zip'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// DELETE /api/archivos/proforma - Eliminar proforma (protegido)
router.delete('/proforma', verificarToken, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../../frontend/public/docs/proforma-contrato.zip');
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Proforma eliminada' });
    } else {
      res.status(404).json({ error: 'No existe archivo para eliminar' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

export default router;