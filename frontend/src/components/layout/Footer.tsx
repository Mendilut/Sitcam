import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Clock, FileText, Download } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface Configuracion {
  empresa_nombre?: string;
  email_contacto?: string;
  telefono?: string;
  direccion?: string;
  horario?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

function Footer() {
  const [config, setConfig] = useState<Configuracion>({});
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMensaje, setNewsletterMensaje] = useState('');
  const [newsletterError, setNewsletterError] = useState(false);
  const [proformaExists, setProformaExists] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/configuracion');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const checkProforma = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/archivos/proforma');
        if (response.ok) {
          const data = await response.json();
          setProformaExists(data.exists);
        }
      } catch (error) {
        console.error('Error al verificar proforma:', error);
      }
    };
    checkProforma();
  }, []);

  const handleSubmitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMensaje('');
    setNewsletterError(false);
    
    if (!newsletterEmail) {
      setNewsletterMensaje('Por favor, ingresa un email');
      setNewsletterError(true);
      setNewsletterLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/suscriptores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewsletterMensaje('✅ ¡Suscripción exitosa!');
        setNewsletterEmail('');
        setNewsletterError(false);
      } else {
        setNewsletterMensaje(data.error || 'Error al suscribir');
        setNewsletterError(true);
      }
    } catch (error) {
      setNewsletterMensaje('Error de conexión');
      setNewsletterError(true);
    } finally {
      setNewsletterLoading(false);
      setTimeout(() => setNewsletterMensaje(''), 5000);
    }
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-400">
          Cargando...
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Información de la empresa */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{config.empresa_nombre || 'SITCAM'}</h3>
            <p className="text-gray-400 text-sm mb-4">
              Soluciones tecnológicas innovadoras para tu negocio. Calidad y compromiso en cada proyecto.
            </p>
            <div className="flex space-x-4">
              {config.facebook && (
                <a 
                  href={config.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-600 transition"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {config.twitter && (
                <a 
                  href={config.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-sky-500 transition"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {config.instagram && (
                <a 
                  href={config.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-pink-600 transition"
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {config.linkedin && (
                <a 
                  href={config.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-700 transition"
                >
                  <FaLinkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition text-sm">Inicio</Link></li>
              <li><Link to="/nosotros" className="text-gray-400 hover:text-blue-400 transition text-sm">¿Quiénes somos?</Link></li>
              <li><Link to="/servicios" className="text-gray-400 hover:text-blue-400 transition text-sm">Servicios</Link></li>
              <li><Link to="/productos" className="text-gray-400 hover:text-blue-400 transition text-sm">Productos</Link></li>
              <li><Link to="/testimonios" className="text-gray-400 hover:text-blue-400 transition text-sm">Testimonios</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-blue-400 transition text-sm">Contacto</Link></li>
              {proformaExists && (
                <li>
                  <a 
                    href="/docs/proforma-contrato.zip" 
                    download 
                    className="text-gray-400 hover:text-blue-400 transition text-sm flex items-center gap-1"
                  >
                    <FileText size={14} /> Proforma de contrato
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {config.direccion && (
                <li className="flex items-center gap-2"><MapPin size={16} /> {config.direccion}</li>
              )}
              {config.email_contacto && (
                <li className="flex items-center gap-2"><Mail size={16} /> {config.email_contacto}</li>
              )}
              {config.telefono && (
                <li className="flex items-center gap-2"><Phone size={16} /> {config.telefono}</li>
              )}
              {config.horario && (
                <li className="flex items-center gap-2"><Clock size={16} /> {config.horario}</li>
              )}
            </ul>
          </div>

          {/* Columna 4: Boletín Informativo */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Boletín Informativo</h3>
            <p className="text-gray-400 text-sm mb-4">
              Suscríbete para recibir novedades y ofertas especiales.
            </p>
            <form onSubmit={handleSubmitNewsletter} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
              >
                {newsletterLoading ? 'Enviando...' : 'Suscribirme'}
              </button>
            </form>
            {newsletterMensaje && (
              <p className={`text-xs mt-2 ${newsletterError ? 'text-red-400' : 'text-green-400'}`}>
                {newsletterMensaje}
              </p>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} {config.empresa_nombre || 'SITCAM'}. Todos los derechos reservados.
          </p>
          <Link to="/admin" className="text-gray-600 text-xs hover:text-gray-400 transition">
            Panel de Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;