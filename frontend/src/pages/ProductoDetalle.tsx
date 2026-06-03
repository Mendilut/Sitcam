import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Tag, Package, Info, Loader, Clock, Shield, Gift, CheckCircle } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoria_id: number;
  categoria_nombre?: string;
  imagen_data: string | null;
  imagen_tipo: string | null;
  destacado: number;
  caracteristicas: string | null;
  tiempo_entrega: string | null;
  garantia: string | null;
  incluye: string | null;
}

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/productos/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          throw new Error('Error al cargar el producto');
        }

        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const formatList = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-*]\s*/, '');
          if (!cleanLine.trim()) return null;
          return (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-" />
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

  if (error || !producto) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{error || 'Producto no encontrado'}</h1>
        <Link to="/productos" className="text-blue-400 hover:text-blue-300">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Botón volver */}
      <Link to="/productos" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition">
        <ArrowLeft size={16} /> Volver a productos
      </Link>

      {/* Grid principal */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center border border-gray-700">
          {producto.imagen_data ? (
            <img
              src={producto.imagen_data}
              alt={producto.nombre}
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <ShoppingBag className="text-blue-400 w-20 h-20" />
          )}
        </div>

        {/* Información básica */}
        <div>
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-white">{producto.nombre}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                <Tag size={12} /> {producto.categoria_nombre || `Categoría ${producto.categoria_id}`}
              </span>
              {producto.destacado === 1 && (
                <span className="inline-flex items-center gap-1 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                  <Info size={12} /> Destacado
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">{producto.descripcion}</p>

          {/* Precio - solo si existe */}
          {producto.precio ? (
            <div className="mb-6">
              <span className="text-blue-400 font-bold text-2xl">${producto.precio}</span>
            </div>
          ) : null}

          {/* Botones */}
          <div className="flex gap-3">
            <Link
              to={`/contacto?producto=${encodeURIComponent(producto.nombre)}&id=${producto.id}&tipo=producto`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition text-center"
            >
              Solicitar información
            </Link>
            <Link
              to="/productos"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm py-2 rounded-lg transition text-center"
            >
              Ver más productos
            </Link>
          </div>
        </div>
      </div>

      {/* Secciones adicionales en grid de 2 columnas */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Características */}
        {producto.caracteristicas && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Package size={16} /> Características
            </h3>
            {formatList(producto.caracteristicas)}
          </div>
        )}

        {/* Qué incluye */}
        {producto.incluye && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Gift size={16} /> ¿Qué incluye?
            </h3>
            {formatList(producto.incluye)}
          </div>
        )}
      </div>

      {/* Garantía y entrega */}
      {(producto.garantia || producto.tiempo_entrega) && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex flex-wrap gap-6">
            {producto.tiempo_entrega && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Clock size={14} /> Tiempo de entrega
                </h3>
                <p className="text-white text-sm">{producto.tiempo_entrega}</p>
              </div>
            )}
            {producto.garantia && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Shield size={14} /> Garantía
                </h3>
                <p className="text-white text-sm">{producto.garantia}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductoDetalle;