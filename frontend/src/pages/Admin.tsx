import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import { Package, Server, Star, Mail } from 'lucide-react';

function Admin() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({
    productos: 0,
    servicios: 0,
    testimonios: 0,
    mensajes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Obtener productos
        const productosRes = await fetch('/api/productos?limit=100');
        const productosData = await productosRes.json();

        // Obtener servicios
        let servicios = 0;
        try {
          const serviciosRes = await fetch('http://localhost:3000/api/servicios');
          const serviciosData = await serviciosRes.json();
          if (Array.isArray(serviciosData)) {
            servicios = serviciosData.length;
          } else if (serviciosData.servicios && Array.isArray(serviciosData.servicios)) {
            servicios = serviciosData.servicios.length;
          }
        } catch (e) {
          console.log('Endpoint de servicios no disponible');
        }

        // Obtener testimonios
        let testimonios = 0;
        try {
          const testimoniosRes = await fetch('http://localhost:3000/api/testimonios');
          const testimoniosData = await testimoniosRes.json();
          testimonios = Array.isArray(testimoniosData) ? testimoniosData.length : 0;
        } catch (e) {
          console.log('Endpoint de testimonios no disponible');
        }

        // Obtener mensajes (solo para admin)
        let mensajes = 0;
        const token = localStorage.getItem('token');
        try {
          const mensajesRes = await fetch('http://localhost:3000/api/mensajes', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (mensajesRes.ok) {
            const mensajesData = await mensajesRes.json();
            mensajes = Array.isArray(mensajesData) ? mensajesData.length : 0;
          }
        } catch (e) {
          console.log('Endpoint de mensajes no disponible');
        }

        setStats({
          productos: productosData.total || productosData.length || 0,
          servicios: servicios,
          testimonios: testimonios,
          mensajes: mensajes
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Productos',
      value: stats.productos,
      icon: Package,
      color: 'bg-blue-500',
      description: 'Total de productos registrados',
      link: '/admin/productos'
    },
    {
      title: 'Servicios',
      value: stats.servicios,
      icon: Server,
      color: 'bg-green-500',
      description: 'Servicios disponibles',
      link: '/admin/servicios'
    },
    {
      title: 'Testimonios',
      value: stats.testimonios,
      icon: Star,
      color: 'bg-yellow-500',
      description: 'Opiniones de clientes',
      link: '/admin/testimonios'
    },
    {
      title: 'Mensajes',
      value: stats.mensajes,
      icon: Mail,
      color: 'bg-purple-500',
      description: 'Mensajes de contacto',
      link: '/admin/mensajes'
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Cargando estadísticas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => window.location.href = card.link}
            className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-white">{card.value}</span>
            </div>
            <h3 className="text-gray-400 font-medium mb-1">{card.title}</h3>
            <p className="text-gray-600 text-xs">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Sección de acciones rápidas */}
      {/* Sección de acciones rápidas */}

      {/* Información adicional */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Información del sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Versión del panel</p>
            <p className="text-white font-medium">v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-500">Último acceso</p>
            <p className="text-white font-medium">{new Date().toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Rol de usuario</p>
            <p className="text-white font-medium capitalize">{usuario?.rol || 'Administrador'}</p>
          </div>
          <div>
            <p className="text-gray-500">Email de contacto</p>
            <p className="text-white font-medium">{usuario?.email}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Admin;