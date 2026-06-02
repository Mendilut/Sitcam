import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import productosRoutes from './routes/productos';
import authRoutes from './routes/auth';
import serviciosRoutes from './routes/servicios';
import testimoniosRoutes from './routes/testimonios';
import categoriasRoutes from './routes/categorias';
import configuracionRoutes from './routes/configuracion';
import mensajesRoutes from './routes/mensajes';
import { initSocket } from './socket';
import usuariosRoutes from './routes/usuarios';
import suscriptoresRoutes from './routes/suscriptores';
import equipoRoutes from './routes/equipo';
import archivosRoutes from './routes/archivos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/testimonios', testimoniosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/suscriptores', suscriptoresRoutes);
app.use('/api/equipo', equipoRoutes);
app.use('/api/archivos', archivosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Crear servidor HTTP
const server = createServer(app);

// Inicializar Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔌 Socket.io habilitado`);
});