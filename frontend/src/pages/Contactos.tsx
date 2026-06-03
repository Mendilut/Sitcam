import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
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
  const [proformaExists, setProformaExists] = useState(true);
  const [checkingProforma, setCheckingProforma] = useState(true);
  
  const params = new URLSearchParams(location.search);
  const producto = params.get('producto');
  const productoServicio = params.get('tipo') === 'servicio' ? 'servicio' : 'producto';
  const itemId = params.get('id');
  const itemNombre = params.get('nombre');
  
  const initialMessageSet = useRef(false);

  // Verificar si existe la proforma
  useEffect(() => {
    const checkProforma = async () => {
      try {
        const response = await fetch('/api/archivos/proforma');
        if (response.ok) {
          const data = await response.json();
          setProformaExists(data.exists);
        }
      } catch {
        setProformaExists(false);
      } finally {
        setCheckingProforma(false);
      }
    };
    checkProforma();
  }, []);

  // Establecer mensaje inicial solo una vez
  useEffect(() => {
    if (producto && !initialMessageSet.current) {
      setFormData(prev => ({
        ...prev,
        mensaje: `Hola, estoy interesado en el ${productoServicio}: ${producto}. Me gustaría recibir más información.`
      }));
      initialMessageSet.current = true;
    }
  }, [producto, productoServicio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEnviado(false);

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setError('Por favor, completa los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: formData.mensaje
        })
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        setTimeout(() => setEnviado(false), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al enviar mensaje');
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Columna derecha */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Información de contacto</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Dirección</p>
                  <p className="text-gray-400">Camagüey, Cuba</p>
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
          
          {!checkingProforma && proformaExists && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <FileText className="text-blue-400 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Proforma de contrato</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Descarga nuestro modelo de contrato para revisar los términos y condiciones de nuestros servicios.
                  </p>
                  <a
                    href="/docs/proforma-contrato.zip"
                    download
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                  >
                    <Download size={16} />
                    Descargar proforma
                  </a>
                  <p className="text-gray-500 text-xs mt-2">
                    Formato ZIP - Tamaño aproximado: 2.5 MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">📍 Nuestra Ubicación</h2>
            <MapaContacto />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;