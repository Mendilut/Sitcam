import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import ResponsiveTable from '../../components/admin/ResponsiveTable';

interface Suscriptor {
  id: number;
  email: string;
  activo: number;
  fecha_suscripcion: string;
}

function SuscriptoresAdmin() {
  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSuscriptores();
  }, []);

  const fetchSuscriptores = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/suscriptores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSuscriptores(data);
    } catch (error) {
      setError('Error al cargar suscriptores');
    } finally {
      setLoading(false);
    }
  };

  const eliminarSuscriptor = async (email: string) => {
    if (!confirm(`¿Eliminar suscripción de ${email}?`)) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/suscriptores/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Suscripción eliminada');
        fetchSuscriptores();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al eliminar');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
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
        <h1 className="text-2xl font-bold text-white">Boletín Informativo</h1>
        <p className="text-gray-400 text-sm mt-1">Administra los suscriptores al boletín</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4 flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      <ResponsiveTable>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-400">Email</th>
                <th className="text-left p-4 text-gray-400">Fecha de suscripción</th>
                <th className="text-left p-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suscriptores.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-gray-400">
                    No hay suscriptores registrados
                  </td>
                </tr>
              ) : (
                suscriptores.map((suscriptor) => (
                  <tr key={suscriptor.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 text-white">{suscriptor.email}</td>
                    <td className="p-4 text-gray-400">{formatDate(suscriptor.fecha_suscripcion)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => eliminarSuscriptor(suscriptor.email)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ResponsiveTable>
    </AdminLayout>
  );
}

export default SuscriptoresAdmin;