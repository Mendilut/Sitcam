import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Shield, LogIn } from 'lucide-react';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    if (!initialCheckDone.current) {
      const token = localStorage.getItem('token');
      setIsAdmin(!!token);
      initialCheckDone.current = true;
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setIsAdmin(!!newToken);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="bg-gray-800 border-b border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition" onClick={cerrarMenu}>
          <div className="bg-gray-700 p-1.5 rounded-full border-2 border-blue-400">
          <img 
            src="public/images/Logo-sitcam.png" 
            alt="SITCAM" 
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          </div>
          <span className="text-lg sm:text-xl font-bold text-white hover:text-blue-400 transition">
            
          </span>
        </Link>        
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
        
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition z-50"
          aria-label="Menú"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div 
        className={`fixed inset-0 bg-gray-900 z-40 transition-transform duration-300 ease-in-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        style={{ top: '60px' }}
      >
        <nav className="flex flex-col p-6 space-y-4">
          <Link to="/" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Inicio</Link>
          <Link to="/nosotros" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Nosotros</Link>
          <Link to="/servicios" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Servicios</Link>
          <Link to="/productos" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Productos</Link>
          <Link to="/testimonios" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Testimonios</Link>
          <Link to="/contacto" className="text-gray-300 hover:text-white transition py-3 border-b border-gray-800" onClick={cerrarMenu}>Contacto</Link>
          
          {isAdmin ? (
            <Link to="/admin" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg transition" onClick={cerrarMenu}>
              <Shield size={18} /> Panel Admin
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-gray-700 text-white px-4 py-3 rounded-lg transition" onClick={cerrarMenu}>
              <LogIn size={18} /> Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;