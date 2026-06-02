import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Loader, Edit2, CheckCircle, XCircle } from 'lucide-react';

interface ConfigItem {
  id: number;
  clave: string;
  valor: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

function ConfiguracionAdmin() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConfiguraciones();
  }, []);

  const fetchConfiguraciones = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/configuracion/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setConfigs(data);
    } catch (error) {
      setError('Error al cargar configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ConfigItem) => {
    setEditingId(config.id);
    setEditValue(config.valor);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
    setError('');
  };

  const handleSave = async (config: ConfigItem) => {
    setSaving(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`api/configuracion/${config.clave}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ valor: editValue })
      });

      if (response.ok) {
        setSuccess(`✅ ${config.descripcion || config.clave} actualizado correctamente`);
        setEditingId(null);
        fetchConfiguraciones();
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

  const getInputType = (clave: string) => {
    if (clave.includes('email')) return 'email';
    if (clave.includes('telefono') || clave.includes('tel')) return 'tel';
    if (clave.includes('facebook') || clave.includes('twitter') || clave.includes('instagram') || clave.includes('linkedin')) return 'url';
    return 'text';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Configuración del Sitio</h1>
        <p className="text-gray-400 text-sm mt-1">Administra la información de contacto, redes sociales y datos del sitio</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-300 hover:text-red-100">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-300 hover:text-green-100">
            <CheckCircle size={16} />
          </button>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-400 w-1/4">Campo</th>
              <th className="text-left p-4 text-gray-400 w-1/2">Valor</th>
              <th className="text-left p-4 text-gray-400 w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <tr key={config.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="text-white font-medium">{config.descripcion || config.clave}</div>
                  <div className="text-gray-500 text-xs mt-1">clave: {config.clave}</div>
                 </td>
                <td className="p-4">
                  {editingId === config.id ? (
                    <input
                      type={getInputType(config.clave)}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="text-gray-300 break-all">
                      {config.valor || <span className="text-gray-500 italic">No definido</span>}
                    </div>
                  )}
                 </td>
                <td className="p-4">
                  {editingId === config.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(config)}
                        disabled={saving}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded transition disabled:opacity-50"
                        title="Guardar"
                      >
                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} className="text-white" />}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded transition"
                        title="Cancelar"
                      >
                        <XCircle size={16} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(config)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      title="Editar"
                    >
                      <Edit2 size={16} className="text-white" />
                    </button>
                  )}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-2">💡 Información</h3>
        <p className="text-gray-400 text-xs">
          Los cambios se aplican inmediatamente en todo el sitio. 
          Los datos de contacto se muestran en el footer y en la página de contacto.
        </p>
      </div>
    </AdminLayout>
  );
}

export default ConfiguracionAdmin;