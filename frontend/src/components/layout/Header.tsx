import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Shield, LogIn } from 'lucide-react';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
    
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setIsAdmin(!!newToken);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cerrar menú al cambiar de ruta
  const cerrarMenu = () => setMenuAbierto(false);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuAbierto]);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition" onClick={cerrarMenu}>
          <span className="text-lg sm:text-xl font-bold text-white hover:text-blue-400 transition">
            SITCAM
          </span>
        </Link>
        
        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition text-sm">Inicio</Link>
          <Link to="/nosotros" className="text-gray-300 hover:text-white transition text-sm">Nosotros</Link>
          <Link to="/servicios" className="text-gray-300 hover:text-white transition text-sm">Servicios</Link>
          <Link to="/productos" className="text-gray-300 hover:text-white transition text-sm">Productos</Link>
          <Link to="/testimonios" className="text-gray-300 hover:text-white transition text-sm">Testimonios</Link>
          <Link to="/contacto" className="text-gray-300 hover:text-white transition text-sm">Contacto</Link>
          
          {isAdmin ? (
            <Link 
              to="/admin" 
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition text-sm font-medium"
            >
              <Shield size={16} />
              <span>Admin</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition text-sm font-medium"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </nav>
        
        {/* Botón menú móvil con animación */}
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800 transition z-50"
          aria-label="Menú"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${
              menuAbierto ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
            }`}>
              <Menu size={24} className="text-white" />
            </span>
            <span className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${
              menuAbierto ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
            }`}>
              <X size={24} className="text-white" />
            </span>
          </div>
        </button>
      </div>
      
      {/* Menú móvil desplegable con animación suave */}
      <div 
        className={`fixed inset-0 bg-gray-900 z-40 transition-all duration-300 ease-in-out md:hidden ${
          menuAbierto ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '60px' }}
      >
        {/* Overlay con blur */}
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm"></div>
        
        {/* Contenido del menú */}
        <nav className="relative flex flex-col p-6 space-y-4 h-full overflow-y-auto">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Inicio
          </Link>
          <Link 
            to="/nosotros" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Nosotros
          </Link>
          <Link 
            to="/servicios" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Servicios
          </Link>
          <Link 
            to="/productos" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Productos
          </Link>
          <Link 
            to="/testimonios" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Testimonios
          </Link>
          <Link 
            to="/contacto" 
            className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800 text-lg" 
            onClick={cerrarMenu}
          >
            Contacto
          </Link>
          
          <div className="pt-4">
            {isAdmin ? (
              <Link 
                to="/admin" 
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition text-base font-medium" 
                onClick={cerrarMenu}
              >
                <Shield size={20} /> Panel Admin
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition text-base font-medium" 
                onClick={cerrarMenu}
              >
                <LogIn size={20} /> Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;