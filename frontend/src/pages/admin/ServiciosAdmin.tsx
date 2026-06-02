import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ServicioForm from '../../components/admin/ServicioForm';
import ResponsiveTable from '../../components/admin/ResponsiveTable';
import { Pencil, Trash2, Plus, Code, Smartphone, Shield, Database, Cloud, BarChart } from 'lucide-react';
import { Servicio, ServicioFormData } from '../../types';





const iconos: { [key: string]: any } = {
  Code: Code,
  Smartphone: Smartphone,
  Shield: Shield,
  Database: Database,
  Cloud: Cloud,
  BarChart: BarChart
};

function ServiciosAdmin() {
  const location = useLocation();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioFormData | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'nuevo') {
      setShowForm(true);
    }
  }, [location]);

 const fetchServicios = async () => {
  try {
    const response = await fetch('/api/servicios');
    const data = await response.json();
    
    // Si la respuesta es un array, usarlo directamente
    if (Array.isArray(data)) {
      setServicios(data);
    } 
    // Si la respuesta tiene propiedad 'servicios' (paginación)
    else if (data.servicios && Array.isArray(data.servicios)) {
      setServicios(data.servicios);
    } 
    else {
      console.error('Formato inesperado:', data);
      setServicios([]);
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Error al cargar servicios');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchServicios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/servicios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchServicios();
      } else {
        alert('Error al eliminar servicio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio({
      id: servicio.id,
      titulo: servicio.titulo,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      categoria_id: servicio.categoria_id,
      icono: servicio.icono,
      destacado: servicio.destacado,
      orden: servicio.orden,
      imagen_data: servicio.imagen_data,
      imagen_tipo: servicio.imagen_tipo,
      caracteristicas: servicio.caracteristicas ?? null,
      tiempo_entrega: servicio.tiempo_entrega ?? null,
      garantia: servicio.garantia ?? null,
      incluye: servicio.incluye ?? null
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingServicio(undefined);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingServicio(undefined);
  };

  const handleFormSuccess = () => {
    fetchServicios();
    handleFormClose();
  };

  const getIconComponent = (iconName: string) => {
    const Icon = iconos[iconName];
    return Icon ? <Icon size={20} className="text-blue-400" /> : <Code size={20} className="text-blue-400" />;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Cargando servicios...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Servicios</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Servicio
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 mb-4">
          {error}
        </div>
      )}

      <ResponsiveTable>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-400">Icono</th>
                <th className="text-left p-4 text-gray-400">Título</th>
                <th className="text-left p-4 text-gray-400">Categoría</th>
                <th className="text-left p-4 text-gray-400">Precio</th>
                <th className="text-left p-4 text-gray-400">Destacado</th>
                <th className="text-left p-4 text-gray-400">Orden</th>
                <th className="text-left p-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-400">
                    No hay servicios registrados
                  </td>
                </tr>
              ) : (
                servicios.map((servicio) => (
                  <tr key={servicio.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      {getIconComponent(servicio.icono)}
                    </td>
                    <td className="p-4 text-white">{servicio.titulo}</td>
                    <td className="p-4 text-gray-400">
                      {servicio.categoria_nombre || `ID: ${servicio.categoria_id}`}
                    </td>
                    <td className="p-4 text-blue-400">${servicio.precio}</td>
                    <td className="p-4">
                      {servicio.destacado === 1 ? (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">Destacado</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">{servicio.orden}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(servicio)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          <Pencil size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(servicio.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ResponsiveTable>

      {showForm && (
        <ServicioForm
          servicio={editingServicio}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </AdminLayout>
  );
}

export default ServiciosAdmin;