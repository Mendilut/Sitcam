import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Save, X, Loader, Eye, EyeOff } from 'lucide-react';
import ResponsiveTable from '../../components/admin/ResponsiveTable';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  tipo: string;
  activo: number;
  orden: number;
  created_at: string;
}

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: '',
    tipo: 'producto',
    activo: 1,
    orden: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/categorias', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategorias(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setCategorias([]);
      }
    } catch (error) {
      setError('Error al cargar categorías');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = () => {
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      icono: '',
      tipo: 'producto',
      activo: 1,
      orden: 0
    });
    setShowForm(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono || '',
      tipo: categoria.tipo,
      activo: categoria.activo,
      orden: categoria.orden
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    const url = editingCategoria
      ? `http://localhost:3000/api/categorias/${editingCategoria.id}`
      : 'http://localhost:3000/api/categorias';
    const method = editingCategoria ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(editingCategoria ? 'Categoría actualizada' : 'Categoría creada');
        setShowForm(false);
        fetchCategorias();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al guardar');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Categoría eliminada');
        fetchCategorias();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleToggleActivo = async (categoria: Categoria) => {
    const token = localStorage.getItem('token');
    const nuevoEstado = categoria.activo === 1 ? 0 : 1;

    try {
      const response = await fetch(`http://localhost:3000/api/categorias/${categoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...categoria, activo: nuevoEstado })
      });

      if (response.ok) {
        fetchCategorias();
        setSuccess(`Categoría ${nuevoEstado === 1 ? 'activada' : 'desactivada'}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al cambiar estado');
    }
  };

  const iconosDisponibles = [
    'Package', 'Cloud', 'Cpu', 'Server', 'Code', 'Smartphone',
    'Shield', 'Database', 'BarChart', 'Users', 'Mail', 'Settings'
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="text-blue-400 w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Categorías</h1>
          <p className="text-gray-400 text-sm mt-1">Administra las categorías de productos y servicios</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Categoría
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

      {/* Tabla de categorías */}
      <ResponsiveTable>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-400">ID</th>
                <th className="text-left p-4 text-gray-400">Nombre</th>
                <th className="text-left p-4 text-gray-400">Tipo</th>
                <th className="text-left p-4 text-gray-400">Icono</th>
                <th className="text-left p-4 text-gray-400">Orden</th>
                <th className="text-left p-4 text-gray-400">Estado</th>
                <th className="text-left p-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-400">
                    No hay categorías registradas
                  </td>
                </tr>
              ) : (
                categorias.map((categoria) => (
                  <tr key={categoria.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 text-white">{categoria.id}</td>
                    <td className="p-4 text-white">{categoria.nombre}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${categoria.tipo === 'producto'
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'bg-green-600/20 text-green-400'
                        }`}>
                        {categoria.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{categoria.icono || '-'}</td>
                    <td className="p-4 text-gray-400">{categoria.orden}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActivo(categoria)}
                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${categoria.activo === 1
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                          }`}
                      >
                        {categoria.activo === 1 ? (
                          <>
                            <Eye size={12} /> Activo
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                          title="Editar"
                        >
                          <Pencil size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.id, categoria.nombre)}
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
      </ResponsiveTable>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="producto">Producto</option>
                    <option value="servicio">Servicio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Orden</label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Icono</label>
                <select
                  value={formData.icono}
                  onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sin icono</option>
                  {iconosDisponibles.map((icono) => (
                    <option key={icono} value={icono}>{icono}</option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">Icono de lucide-react para mostrar</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo === 1}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="activo" className="text-gray-300 text-sm">
                  Categoría activa
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Guardando...' : (editingCategoria ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default CategoriasAdmin;