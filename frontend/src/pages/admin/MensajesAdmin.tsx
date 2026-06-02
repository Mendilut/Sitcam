import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Eye, CheckCircle, Reply, Trash2, Loader, AlertCircle, MessageCircle, Filter } from 'lucide-react';
import { io } from 'socket.io-client';


interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  leido: number;
  respondido: number;
  created_at: string;
}

type FiltroType = 'todos' | 'noLeidos' | 'noRespondidos' | 'respondidos';

function MensajesAdmin() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMensaje, setSelectedMensaje] = useState<Mensaje | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notificacion, setNotificacion] = useState<{ show: boolean; mensaje: string }>({ show: false, mensaje: '' });
  const [filtro, setFiltro] = useState<FiltroType>('todos');

  // Solicitar permiso para notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Conexión WebSocket
  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('nuevo-mensaje', (data) => {
      console.log('📨 Nuevo mensaje recibido:', data);

      setNotificacion({ show: true, mensaje: `Nuevo mensaje de ${data.nombre}` });
      setTimeout(() => setNotificacion({ show: false, mensaje: '' }), 5000);

      if (Notification.permission === 'granted') {
        new Notification('📨 Nuevo mensaje de contacto', {
          body: `${data.nombre}: ${data.mensaje}`,
          icon: '/favicon.ico'
        });
      }

      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => console.log('Audio no disponible'));

      fetchMensajes();
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchMensajes = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/mensajes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMensajes(data);
    } catch (error) {
      setError('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const marcarLeido = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/mensajes/${id}/leido`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMensajes(mensajes.map(m => m.id === id ? { ...m, leido: 1 } : m));
        if (selectedMensaje?.id === id) {
          setSelectedMensaje({ ...selectedMensaje, leido: 1 });
        }
        setSuccess('Mensaje marcado como leído');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al actualizar');
    }
  };

  const marcarRespondido = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/mensajes/${id}/respondido`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMensajes(mensajes.map(m => m.id === id ? { ...m, respondido: 1 } : m));
        if (selectedMensaje?.id === id) {
          setSelectedMensaje({ ...selectedMensaje, respondido: 1 });
        }
        setSuccess('Mensaje marcado como respondido');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al actualizar');
    }
  };

  const eliminarMensaje = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/mensajes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMensajes();
        setSelectedMensaje(null);
        setSuccess('Mensaje eliminado');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al eliminar');
    }
  };

  const responderWhatsApp = (telefono: string, nombre: string) => {
    let numero = telefono.replace(/\s/g, '').replace(/-/g, '').replace(/\+/g, '');
    if (!numero.startsWith('53') && numero.length === 8) {
      numero = `53${numero}`;
    }
    const mensaje = encodeURIComponent(`Hola ${nombre}, gracias por contactarnos. Hemos recibido tu mensaje. ¿En qué más podemos ayudarte?`);
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // Filtrar mensajes según el filtro seleccionado
  const mensajesFiltrados = mensajes.filter(m => {
    if (filtro === 'noLeidos') return m.leido === 0;
    if (filtro === 'noRespondidos') return m.respondido === 0;
    if (filtro === 'respondidos') return m.respondido === 1;
    return true;
  });

  const noLeidos = mensajes.filter(m => m.leido === 0).length;
  const noRespondidos = mensajes.filter(m => m.respondido === 0).length;

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
      {/* Notificación flotante */}
      {notificacion.show && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          💬 {notificacion.mensaje}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Mensajes de Contacto</h1>
            <p className="text-gray-400 text-sm mt-1">Administra los mensajes recibidos</p>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${filtro === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              <Filter size={14} /> Todos ({mensajes.length})
            </button>
            <button
              onClick={() => setFiltro('noLeidos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${filtro === 'noLeidos'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              📖 No leídos ({noLeidos})
            </button>
            <button
              onClick={() => setFiltro('noRespondidos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${filtro === 'noRespondidos'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              ⏳ Sin responder ({noRespondidos})
            </button>
            <button
              onClick={() => setFiltro('respondidos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${filtro === 'respondidos'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              ✅ Respondidos
            </button>
          </div>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de mensajes */}
        <div className="lg:col-span-1 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-800">
            <h2 className="font-semibold text-white">
              Mensajes ({mensajesFiltrados.length})
              {filtro !== 'todos' && (
                <span className="text-gray-400 text-sm ml-2">(filtrado)</span>
              )}
            </h2>
          </div>
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {mensajesFiltrados.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Mail size={40} className="mx-auto mb-2 opacity-50" />
                <p>No hay mensajes</p>
              </div>
            ) : (
              mensajesFiltrados.map((mensaje) => (
                <div
                  key={mensaje.id}
                  onClick={() => setSelectedMensaje(mensaje)}
                  className={`p-4 cursor-pointer hover:bg-gray-800 transition ${selectedMensaje?.id === mensaje.id ? 'bg-gray-800' : ''
                    } ${mensaje.leido === 0 ? 'border-l-4 border-l-yellow-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {mensaje.nombre}
                        {mensaje.respondido === 0 && mensaje.leido === 1 && (
                          <span className="ml-2 text-xs text-orange-400">⏳</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">{mensaje.email}</p>
                      <p className="text-gray-500 text-xs mt-1">{formatDate(mensaje.created_at)}</p>
                    </div>
                    {mensaje.leido === 0 && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                    {mensaje.respondido === 1 && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{mensaje.mensaje}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detalle del mensaje */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-700 p-6">
          {selectedMensaje ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedMensaje.nombre}</h2>
                  <p className="text-gray-400">{selectedMensaje.email}</p>
                  {selectedMensaje.telefono && (
                    <p className="text-gray-400 text-sm">Tel: {selectedMensaje.telefono}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formatDate(selectedMensaje.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => marcarLeido(selectedMensaje.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    title="Marcar como leído"
                    disabled={selectedMensaje.leido === 1}
                  >
                    <Eye size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => marcarRespondido(selectedMensaje.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded transition"
                    title="Marcar como respondido"
                    disabled={selectedMensaje.respondido === 1}
                  >
                    <Reply size={16} className="text-white" />
                  </button>
                  {selectedMensaje.telefono ? (
                    <button
                      onClick={() => responderWhatsApp(selectedMensaje.telefono!, selectedMensaje.nombre)}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded transition"
                      title="Responder por WhatsApp"
                    >
                      <MessageCircle size={16} className="text-white" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="p-2 bg-gray-600 rounded transition opacity-50 cursor-not-allowed"
                      title="No tiene número de teléfono"
                    >
                      <MessageCircle size={16} className="text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarMensaje(selectedMensaje.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Mensaje:</h3>
                <p className="text-white whitespace-pre-wrap">{selectedMensaje.mensaje}</p>
              </div>

              <div className="mt-4 flex gap-2 items-center flex-wrap">
                {selectedMensaje.leido === 0 && (
                  <span className="text-yellow-500 text-sm">📖 No leído</span>
                )}
                {selectedMensaje.leido === 1 && (
                  <span className="text-green-500 text-sm">✅ Leído</span>
                )}
                {selectedMensaje.respondido === 0 && (
                  <span className="text-orange-500 text-sm ml-2">⏳ Pendiente de respuesta</span>
                )}
                {selectedMensaje.respondido === 1 && (
                  <span className="text-blue-500 text-sm ml-2">💬 Respondido</span>
                )}
                {!selectedMensaje.telefono && (
                  <span className="text-yellow-500 text-sm ml-2">⚠️ Sin número de teléfono</span>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Mail size={48} className="mx-auto mb-3 opacity-50" />
              <p>Selecciona un mensaje para ver su contenido</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default MensajesAdmin;