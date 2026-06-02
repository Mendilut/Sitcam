import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ResponsiveTable from '../../components/admin/ResponsiveTable';
import { Pencil, Trash2, Plus, Eye, EyeOff, Loader, X, Save, Users} from 'lucide-react';
import { MiembroEquipo, MiembroEquipoFormData } from '../../types';

function EquipoAdmin() {
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMiembro, setEditingMiembro] = useState<MiembroEquipoFormData | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    descripcion: '',
    imagen_url: '',
    orden: 0,
    activo: 1
  });

  useEffect(() => {
    fetchMiembros();
  }, []);

  const fetchMiembros = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/equipo/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMiembros(data);
    } catch (error) {
      setError('Error al cargar equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMiembro(undefined);
    setFormData({ nombre: '', cargo: '', descripcion: '', imagen_url: '', orden: 0, activo: 1 });
    setShowForm(true);
  };

  const handleEdit = (miembro: MiembroEquipo) => {
    setEditingMiembro(miembro);
    setFormData({
      nombre: miembro.nombre,
      cargo: miembro.cargo,
      descripcion: miembro.descripcion || '',
      imagen_url: miembro.imagen_url || '',
      orden: miembro.orden,
      activo: miembro.activo
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    const url = editingMiembro?.id 
      ? `/api/equipo/${editingMiembro.id}`
      : '/api/equipo';
    const method = editingMiembro?.id ? 'PUT' : 'POST';

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
        setSuccess(editingMiembro?.id ? 'Miembro actualizado' : 'Miembro agregado');
        setShowForm(false);
        fetchMiembros();
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
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/equipo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Miembro eliminado');
        fetchMiembros();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Error al eliminar');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleToggleActivo = async (miembro: MiembroEquipo) => {
    const token = localStorage.getItem('token');
    const nuevoEstado = miembro.activo === 1 ? 0 : 1;
    
    try {
      const response = await fetch(`/api/equipo/${miembro.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...miembro, activo: nuevoEstado })
      });

      if (response.ok) {
        fetchMiembros();
        setSuccess(`Miembro ${nuevoEstado === 1 ? 'activado' : 'desactivado'}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al cambiar estado');
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipo de Trabajo</h1>
          <p className="text-gray-400 text-sm mt-1">Administra los miembros del equipo</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Miembro
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
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-400">Foto</th>
                <th className="text-left p-4 text-gray-400">Nombre</th>
                <th className="text-left p-4 text-gray-400">Cargo</th>
                <th className="text-left p-4 text-gray-400">Orden</th>
                <th className="text-left p-4 text-gray-400">Estado</th>
                <th className="text-left p-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    No hay miembros registrados
                  </td>
                </tr>
              ) : (
                miembros.map((miembro) => (
                  <tr key={miembro.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      {miembro.imagen_url ? (
                        <img 
                          src={miembro.imagen_url} 
                          alt={miembro.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-white">{miembro.nombre}</td>
                    <td className="p-4 text-gray-400">{miembro.cargo}</td>
                    <td className="p-4 text-gray-400">{miembro.orden}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActivo(miembro)}
                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                          miembro.activo === 1
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                        }`}
                      >
                        {miembro.activo === 1 ? <Eye size={12} /> : <EyeOff size={12} />}
                        {miembro.activo === 1 ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(miembro)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                          title="Editar"
                        >
                          <Pencil size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(miembro.id, miembro.nombre)}
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
                {editingMiembro?.id ? 'Editar Miembro' : 'Nuevo Miembro'}
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
                <label className="block text-gray-300 text-sm mb-1">Cargo *</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
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

              <div>
                <label className="block text-gray-300 text-sm mb-1">URL de la imagen (ImgBB)</label>
                <input
                  type="url"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="https://i.imgur.com/xxxxx.jpg"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-gray-500 text-xs mt-1">Sube la imagen a ImgBB y pega el enlace directo</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Orden</label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo === 1}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                  />
                  <label htmlFor="activo" className="text-gray-300 text-sm">
                    Visible en el sitio
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

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
                  {saving ? 'Guardando...' : (editingMiembro?.id ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default EquipoAdmin;