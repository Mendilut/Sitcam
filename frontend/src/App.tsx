import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import ServicioDetalle from './pages/ServicioDetalle';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Testimonios from './pages/Testimonios';
import Contacto from './pages/Contactos';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import ServiciosAdmin from './pages/admin/ServiciosAdmin';
import ConfiguracionAdmin from './pages/admin/ConfiguracionAdmin';
import MensajesAdmin from './pages/admin/MensajesAdmin';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import Nosotros from './pages/Nosotros';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import SuscriptoresAdmin from './pages/admin/SuscriptoresAdmin';
import TestimoniosAdmin from './pages/admin/TestimoniosAdmin';
import EquipoAdmin from './pages/admin/EquipoAdmin';




function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas con Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/servicios" element={<Layout><Servicios /></Layout>} />
          <Route path="/servicio/:id" element={<Layout><ServicioDetalle /></Layout>} />
          <Route path="/productos" element={<Layout><Productos /></Layout>} />
          <Route path="/producto/:id" element={<Layout><ProductoDetalle /></Layout>} />
          <Route path="/testimonios" element={<Layout><Testimonios /></Layout>} />
          <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
          <Route path="/nosotros" element={<Layout><Nosotros /></Layout>} />

          {/* Ruta de login (sin Layout) */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas de admin */}
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/productos" element={<ProtectedRoute><ProductosAdmin /></ProtectedRoute>} />
          <Route path="/admin/servicios" element={<ProtectedRoute><ServiciosAdmin /></ProtectedRoute>} />
          <Route path="/admin/configuracion" element={<ProtectedRoute><ConfiguracionAdmin /></ProtectedRoute>} />
          <Route path="/admin/mensajes" element={<ProtectedRoute><MensajesAdmin /></ProtectedRoute>} />
          <Route path="/admin/categorias"element={<ProtectedRoute><CategoriasAdmin /></ProtectedRoute>}/>
          <Route path="/admin/suscriptores" element={<ProtectedRoute><SuscriptoresAdmin /></ProtectedRoute>} />
          <Route path="/admin/testimonios" element={<ProtectedRoute><TestimoniosAdmin /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute><UsuariosAdmin /></ProtectedRoute>} />
          <Route path="/admin/equipo" element={<ProtectedRoute><EquipoAdmin /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;