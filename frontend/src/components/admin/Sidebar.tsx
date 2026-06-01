import { NavLink } from 'react-router-dom';
import { LayoutDashboard,Users, Package, Server,Star, MessageSquare, Settings, Tags, UserCog, Mail as MailIcon } from 'lucide-react';


function Sidebar() {
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/productos', icon: Package, label: 'Productos', end: false },
    { path: '/admin/servicios', icon: Server, label: 'Servicios', end: false },
    { path: '/admin/categorias', icon: Tags, label: 'Categorías', end: false },
    { path: '/admin/mensajes', icon: MessageSquare, label: 'Mensajes', end: false },
    { path: '/admin/testimonios', icon: Star, label: 'Testimonios', end: false },
    { path: '/admin/suscriptores', icon: MailIcon, label: 'Suscriptores', end: false },
    { path: '/admin/usuarios', icon: UserCog, label: 'Usuarios', end: false },
    { path: '/admin/equipo', icon: Users, label: 'Equipo', end: false },
    { path: '/admin/configuracion', icon: Settings, label: 'Configuración', end: false },
    
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">SITCAM Admin</h2>
        <p className="text-gray-500 text-sm mt-1">Panel de control</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;