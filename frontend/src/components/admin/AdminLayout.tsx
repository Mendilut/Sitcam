import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

 const handleLogout = () => {
  logout();
  // Esperar a que el estado se actualice
  setTimeout(() => {
    navigate('/', { replace: true });
  }, 50);
};
  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-white">Panel de Control</h1>
            <p className="text-gray-400 text-sm">Bienvenido, {usuario?.nombre}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;