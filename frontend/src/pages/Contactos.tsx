import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import MapaContacto from '../components/ui/MapaContacto';

function Contacto() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  // Detectar si viene de un producto o servicio
  const params = new URLSearchParams(location.search);
  const producto = params.get('producto');
  const productoServicio = params.get('tipo') === 'servicio' ? 'servicio' : 'producto';
  const itemId = params.get('id');
  const itemNombre = params.get('nombre');

  useEffect(() => {
    if (producto) {
      setFormData(prev => ({
        ...prev,
        mensaje: `Hola, estoy interesado en el ${productoServicio}: ${producto}. Me gustaría recibir más información.`
      }));
    }
  }, [producto, productoServicio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEnviado(false);

    try {
      const response = await fetch('http://localhost:3000/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        setTimeout(() => setEnviado(false), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al enviar mensaje');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Determinar la ruta de retorno
  const getBackUrl = () => {
    if (itemId && itemNombre) {
      return productoServicio === 'servicio' ? `/servicio/${itemId}` : `/producto/${itemId}`;
    }
    return productoServicio === 'servicio' ? '/servicios' : '/productos';
  };

  const getBackText = () => {
    if (itemId && itemNombre) {
      return `Volver a ${itemNombre}`;
    }
    return productoServicio === 'servicio' ? 'Volver a servicios' : 'Volver a productos';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Botón volver dinámico */}
      <Link
        to={getBackUrl()}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft size={20} /> {getBackText()}
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">Contacto</h1>
      <p className="text-gray-300 text-center text-lg mb-12 max-w-2xl mx-auto">
        ¿Tienes un proyecto en mente? Contáctanos y te asesoraremos sin compromiso.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Formulario */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Envíanos un mensaje</h2>

          {enviado && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4 flex items-center gap-2">
              <CheckCircle size={16} /> ¡Mensaje enviado! Te contactaremos pronto.
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Nombre completo *</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Mensaje *</label>
              <textarea
                required
                rows={6}
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : <Send size={18} />}
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>

        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Dirección</p>
                  <p className="text-gray-400">La Habana, Cuba</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400">contacto@sitcam.cu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Teléfono</p>
                  <p className="text-gray-400">+53 5 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Horario de atención</p>
                  <p className="text-gray-400">Lunes a Viernes: 9am - 6pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Ubicación</h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📍 Nuestra Ubicación</h2>
              <MapaContacto />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;