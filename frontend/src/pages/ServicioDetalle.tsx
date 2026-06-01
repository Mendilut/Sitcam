import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader, CheckCircle, Clock, Shield, Gift, Tag, Star, Package } from 'lucide-react';

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  categoria_nombre?: string;
  icono: string;
  destacado: number;
  imagen_data: string | null;
  imagen_tipo: string | null;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
}

function ServicioDetalle() {
  const { id } = useParams();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServicio = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:3000/api/servicios/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Servicio no encontrado');
          }
          throw new Error('Error al cargar el servicio');
        }

        const data = await response.json();
        setServicio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

  const formatList = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-*]\s*/, '');
          if (!cleanLine.trim()) return null;
          return (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="text-blue-400 w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{error || 'Servicio no encontrado'}</h1>
        <Link to="/servicios" className="text-blue-400 hover:text-blue-300">
          Volver a servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Botón volver */}
      <Link to="/servicios" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition">
        <ArrowLeft size={16} /> Volver a servicios
      </Link>

      {/* Grid principal */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center border border-gray-700">
          {servicio.imagen_data ? (
            <img
              src={servicio.imagen_data}
              alt={servicio.titulo}
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-2">🚀</div>
              <p className="text-gray-500 text-sm">Sin imagen</p>
            </div>
          )}
        </div>

        {/* Información básica */}
        <div>
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-white">{servicio.titulo}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                <Tag size={12} /> {servicio.categoria_nombre || `Categoría ${servicio.categoria_id}`}
              </span>
              {servicio.destacado === 1 && (
                <span className="inline-flex items-center gap-1 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                  <Star size={12} /> Destacado
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">{servicio.descripcion}</p>

          {/* Precio */}
          <div className="mb-6">
            <span className="text-blue-400 font-bold text-2xl">${servicio.precio}</span>
            <span className="text-gray-500 text-sm ml-1">/ proyecto</span>
          </div>

          {/* Info rápida en 3 columnas */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {servicio.tiempo_entrega && (
              <div className="bg-gray-800 rounded-lg p-2 text-center border border-gray-700">
                <Clock className="text-blue-400 w-4 h-4 mx-auto mb-1" />
                <p className="text-gray-500 text-xs">Entrega</p>
                <p className="text-white text-xs font-medium truncate">{servicio.tiempo_entrega}</p>
              </div>
            )}
            {servicio.garantia && (
              <div className="bg-gray-800 rounded-lg p-2 text-center border border-gray-700">
                <Shield className="text-blue-400 w-4 h-4 mx-auto mb-1" />
                <p className="text-gray-500 text-xs">Garantía</p>
                <p className="text-white text-xs font-medium truncate">{servicio.garantia}</p>
              </div>
            )}
            {servicio.incluye && (
              <div className="bg-gray-800 rounded-lg p-2 text-center border border-gray-700">
                <Gift className="text-blue-400 w-4 h-4 mx-auto mb-1" />
                <p className="text-gray-500 text-xs">Incluye</p>
                <p className="text-white text-xs font-medium">Ver abajo</p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Link
              to={`/contacto?producto=${encodeURIComponent(servicio.titulo)}&id=${servicio.id}&tipo=servicio`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition text-center"
            >
              Solicitar este servicio
            </Link>
            <Link
              to="/servicios"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm py-2 rounded-lg transition text-center"
            >
              Ver más servicios
            </Link>
          </div>
        </div>
      </div>

      {/* Secciones adicionales en grid de 2 columnas */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Características */}
        {servicio.caracteristicas && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Package size={16} /> Características
            </h3>
            {formatList(servicio.caracteristicas)}
          </div>
        )}

        {/* Qué incluye */}
        {servicio.incluye && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Gift size={16} /> ¿Qué incluye?
            </h3>
            {formatList(servicio.incluye)}
          </div>
        )}
      </div>

      {/* Garantía y entrega adicionales */}
      {(servicio.garantia || servicio.tiempo_entrega) && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex flex-wrap gap-6">
            {servicio.tiempo_entrega && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Clock size={14} /> Tiempo de entrega
                </h3>
                <p className="text-white text-sm">{servicio.tiempo_entrega}</p>
              </div>
            )}
            {servicio.garantia && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Shield size={14} /> Garantía
                </h3>
                <p className="text-white text-sm">{servicio.garantia}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicioDetalle;