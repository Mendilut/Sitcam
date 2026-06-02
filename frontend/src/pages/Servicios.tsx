import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Loader, Code, Smartphone, Shield, Database, Cloud, BarChart } from 'lucide-react';

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
}

interface Categoria {
  id: number;
  nombre: string;
}

const iconos: { [key: string]: any } = {
  Code: Code,
  Smartphone: Smartphone,
  Shield: Shield,
  Database: Database,
  Cloud: Cloud,
  BarChart: BarChart
};

function Servicios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = '/api/servicios';

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias/public');
        const data = await response.json();
        const categoriasServicio = data.filter((c: any) => c.tipo === 'servicio');
        setCategorias(categoriasServicio);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Cargar servicios
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          search: searchTerm,
          categoria_id: categoriaId.toString(),
          page: currentPage.toString(),
          limit: '6'
        });

        console.log('Parámetros de búsqueda:', params.toString());

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
          throw new Error('Error al cargar servicios');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        setServicios(data.servicios || data);
        setTotalPages(data.totalPages || Math.ceil((data.length || 0) / 6));
        setTotal(data.total || data.length || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, [searchTerm, categoriaId, currentPage]);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeText(e.target.value);
    setSearchTerm(normalized);
    setCurrentPage(1);
  };
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaId(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading && servicios.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="text-blue-400 w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Nuestros Servicios</h1>
      <p className="text-gray-300 text-center text-base mb-8 max-w-2xl mx-auto">
        Ofrecemos soluciones tecnológicas integrales adaptadas a las necesidades específicas de tu negocio.
      </p>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="w-full md:w-56">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={categoriaId}
              onChange={handleCategoriaChange}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
      <div className="text-gray-400 text-xs mb-4">
        Mostrando {servicios.length} de {total} servicios
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Grid de servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 w-12 h-12 mx-auto mb-3">🔍</div>
          <p className="text-gray-400">No se encontraron servicios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => {
            const IconComponent = iconos[servicio.icono] || Code;
            return (
              <div key={servicio.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group">
                {/* Imagen o Icono */}
                <div className="h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
                  {servicio.imagen_data ? (
                    <img
                      src={servicio.imagen_data}
                      alt={servicio.titulo}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <IconComponent className="text-blue-400 w-16 h-16" />
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white line-clamp-1">{servicio.titulo}</h3>
                    {servicio.destacado === 1 && (
                      <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">Destacado</span>
                    )}
                  </div>

                  <div className="mb-2">
                    <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      📁 {servicio.categoria_nombre || `Cat. ${servicio.categoria_id}`}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{servicio.descripcion}</p>

                  {/* Precio y botones integrados */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-blue-400 font-bold text-lg">${servicio.precio}</span>
                      <span className="text-gray-500 text-xs ml-1">/ proyecto</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/servicio/${servicio.id}`}
                      className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                      Ver detalles
                    </Link>
                    <Link
                      to={`/contacto?producto=${encodeURIComponent(servicio.titulo)}&id=${servicio.id}&tipo=servicio`}
                      className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                      Solicitar
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded-lg transition ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && <span className="px-2 py-1 text-gray-400">...</span>}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Servicios;