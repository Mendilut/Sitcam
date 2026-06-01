import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TestimonioForm from '../../components/admin/TestimonioForm';
import { Pencil, Trash2, Plus, Star, User, Eye, EyeOff } from 'lucide-react';
import { Testimonio, TestimonioFormData } from '../../types';
import ResponsiveTable from '../../components/admin/ResponsiveTable';



function TestimoniosAdmin() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonio, setEditingTestimonio] = useState<TestimonioFormData | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const fetchTestimonios = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/testimonios/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTestimonios(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar testimonios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el testimonio de "${nombre}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/testimonios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Testimonio eliminado correctamente');
        fetchTestimonios();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    }
  };

  const handleToggleActivo = async (testimonio: Testimonio) => {
    const token = localStorage.getItem('token');
    const nuevoEstado = testimonio.activo === 1 ? 0 : 1;

    try {
      const response = await fetch(`http://localhost:3000/api/testimonios/${testimonio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...testimonio, activo: nuevoEstado })
      });

      if (response.ok) {
        fetchTestimonios();
        setSuccess(`Testimonio ${nuevoEstado === 1 ? 'publicado' : 'archivado'}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al cambiar estado');
    }
  };

  const handleEdit = (testimonio: Testimonio) => {
    setEditingTestimonio({
      id: testimonio.id,
      nombre: testimonio.nombre,
      email: testimonio.email || '',
      rol: testimonio.rol,
      empresa: testimonio.empresa || '',
      texto: testimonio.texto,
      rating: testimonio.rating,
      activo: testimonio.activo,
      imagen_data: testimonio.imagen_data,
      imagen_tipo: testimonio.imagen_tipo
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingTestimonio(undefined);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTestimonio(undefined);
  };

  const handleFormSuccess = () => {
    fetchTestimonios();
    handleFormClose();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Cargando testimonios...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Testimonios</h1>
          <p className="text-gray-400 text-sm mt-1">Administra las opiniones de los clientes</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Testimonio
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4">
          {success}
        </div>
      )}
      <ResponsiveTable>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-400">Cliente</th>
                  <th className="text-left p-4 text-gray-400">Testimonio</th>
                  <th className="text-left p-4 text-gray-400">Calif.</th>
                  <th className="text-left p-4 text-gray-400">Origen</th>
                  <th className="text-left p-4 text-gray-400">Fecha</th>
                  <th className="text-left p-4 text-gray-400">Estado</th>
                  <th className="text-left p-4 text-gray-400">Acciones</th>
                </tr>

              </thead>
              <tbody>
                {testimonios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-400">
                      No hay testimonios registrados
                    </td>
                  </tr>
                ) : (
                  testimonios.map((testimonio) => (
                    <tr key={testimonio.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {testimonio.imagen_data ? (
                            <img
                              src={testimonio.imagen_data}
                              alt={testimonio.nombre}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{testimonio.nombre}</p>
                            <p className="text-gray-500 text-xs">
                              {testimonio.rol}
                              {testimonio.empresa && ` - ${testimonio.empresa}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-400 text-sm max-w-md line-clamp-2">{testimonio.texto}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= testimonio.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {testimonio.email ? (
                          <span className="inline-flex items-center gap-1 text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded-full">
                            🌐 Web
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                            👨‍💼 Admin
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{formatDate(testimonio.created_at)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActivo(testimonio)}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${testimonio.activo === 1
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                            }`}
                        >
                          {testimonio.activo === 1 ? (
                            <><Eye size={12} /> Publicado</>
                          ) : (
                            <><EyeOff size={12} /> Pendiente</>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(testimonio)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                            title="Editar"
                          >
                            <Pencil size={16} className="text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonio.id, testimonio.nombre)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                            title="Eliminar"
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
        </div>
      </ResponsiveTable>

      {showForm && (
        <TestimonioForm
          testimonio={editingTestimonio}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </AdminLayout>
  );
}

export default TestimoniosAdmin;