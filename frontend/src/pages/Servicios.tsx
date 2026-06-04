import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, Loader, Code, Smartphone, Shield, Database, Cloud, BarChart, LucideIcon } from 'lucide-react';
import SearchInput from '../components/ui/SearchInput';

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
  tipo: string;
}

const iconos: Record<string, LucideIcon> = {
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
        const categoriasServicio = data.filter((c: Categoria) => c.tipo === 'servicio');
        setCategorias(categoriasServicio);
      } catch {
        console.error('Error al cargar categorías');
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

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
          throw new Error('Error al cargar servicios');
        }

        const data = await response.json();
        // Manejar respuesta paginada o array directo
        if (data.servicios) {
          setServicios(data.servicios);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        } else {
          setServicios(data);
          setTotalPages(Math.ceil(data.length / 6));
          setTotal(data.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [searchTerm, categoriaId, currentPage]);

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
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">Servicios</h1>
      <p className="text-gray-300 text-center text-lg mb-12 max-w-2xl mx-auto">
        Ofrecemos soluciones tecnológicas integrales adaptadas a las necesidades específicas de tu negocio.
      </p>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <SearchInput
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          placeholder="Buscar servicios..."
          endpoint="/api/servicios/suggest"
        />
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
        Mostrando {servicios.length} de {total} servicios
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-center text-red-300 mb-6">
          {error}
        </div>
      )}

      {/* Grid de servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 w-16 h-16 mx-auto mb-4">🔍</div>
          <p className="text-gray-400 text-lg">No se encontraron servicios</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    {servicio.precio ? (
                      <span className="text-blue-400 font-bold text-sm">${servicio.precio}</span>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      📁 {servicio.categoria_nombre || `Cat. ${servicio.categoria_id}`}
                    </span>
                    {servicio.destacado === 1 && (
                      <span className="ml-2 inline-block bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{servicio.descripcion}</p>

                  {/* Botones integrados */}
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
                      Solicitar inf
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

export default Servicios;