import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  categoria_nombre?: string;
  imagen_data: string | null;
  imagen_tipo: string | null;
  destacado: number;
}

interface Categoria {
  id: number;
  nombre: string;
}

function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = '/api/productos';

  // Cargar categorías
  useEffect(() => {
    // En Productos.tsx, modifica el fetch de categorías:
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias/public');
        const data = await response.json();
        // Filtrar solo categorías de productos
        const categoriasProducto = data.filter((c: any) => c.tipo === 'producto');
        setCategorias(categoriasProducto);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          search: searchTerm,
          categoria_id: categoriaId.toString(),
          page: currentPage.toString(),
          limit: '6'
        });

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }

        const data = await response.json();
        setProductos(data.productos);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [searchTerm, categoriaId, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaId(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading && productos.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="text-blue-400 w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">Productos</h1>
      <p className="text-gray-300 text-center text-lg mb-12 max-w-2xl mx-auto">
        Soluciones de software diseñadas para potenciar tu negocio.
      </p>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={categoriaId}
              onChange={handleCategoriaChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value={0}>Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-gray-400 text-sm mb-6">
        Mostrando {productos.length} de {total} productos
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-center text-red-300 mb-6">
          {error}
        </div>
      )}

      {/* Grid de productos */}
      {productos.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="text-gray-600 w-16 h-16 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group">
              {/* Imagen */}
              <div className="h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
                {producto.imagen_data ? (
                  <img
                    src={producto.imagen_data}
                    alt={producto.nombre}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <ShoppingBag className="text-blue-400 w-16 h-16" />
                )}
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white line-clamp-1">{producto.nombre}</h3>
                  
                </div>

                <div className="mb-2">
                  <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    📁 {producto.categoria_nombre || `Cat. ${producto.categoria_id}`}
                  </span>
                </div>

                <p className="text-gray-400 text-xs mb-4 line-clamp-2">{producto.descripcion}</p>

                {/* Botones integrados */}
                <div className="flex gap-2">
                  <Link
                    to={`/producto/${producto.id}`}
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Ver detalles
                  </Link>
                  <Link
                    to={`/contacto?producto=${encodeURIComponent(producto.nombre)}&id=${producto.id}&tipo=producto`}
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Solicitar inf
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Productos;