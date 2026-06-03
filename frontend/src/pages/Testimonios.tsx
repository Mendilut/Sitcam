import { useState, useEffect } from 'react';
import { Star, Loader, User, Send, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Testimonio {
  id: number;
  nombre: string;
  rol: string;
  empresa: string | null;
  texto: string;
  rating: number;
  imagen_data: string | null;
  created_at: string;
}

function Testimonios() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados de paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 6;
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    empresa: '',
    texto: '',
    rating: 5
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Cargar testimonios
  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const response = await fetch('/api/testimonios');
        if (!response.ok) throw new Error('Error al cargar testimonios');
        const data = await response.json();
        setTestimonios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonios();
  }, []);

  // Filtrar testimonios por calificación
  const filteredTestimonios = filterRating
    ? testimonios.filter(t => t.rating === filterRating)
    : testimonios;

  // Ordenar por más recientes (primero los nuevos)
  const sortedTestimonios = [...filteredTestimonios].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Paginación
  const totalPages = Math.ceil(sortedTestimonios.length / itemsPerPage);
  const paginatedTestimonios = sortedTestimonios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Resetear página al cambiar filtro
  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFormMessage('');
    setFormError('');

    if (!formData.nombre.trim()) {
      setFormError('Por favor, ingresa tu nombre');
      setSending(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Por favor, ingresa un email válido');
      setSending(false);
      return;
    }

    if (!formData.texto.trim() || formData.texto.length < 10) {
      setFormError('El testimonio debe tener al menos 10 caracteres');
      setSending(false);
      return;
    }

    try {
      const response = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          rol: formData.rol.trim(),
          empresa: formData.empresa.trim(),
          texto: formData.texto.trim(),
          rating: formData.rating,
          activo: 1
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFormMessage('✅ ¡Gracias por tu testimonio!');
        setFormData({
          nombre: '',
          email: '',
          rol: '',
          empresa: '',
          texto: '',
          rating: 5
        });
        
        // Recargar testimonios
        const testimoniosResponse = await fetch('/api/testimonios');
        const nuevosTestimonios = await testimoniosResponse.json();
        setTestimonios(nuevosTestimonios);
        
        setTimeout(() => setFormMessage(''), 5000);
        setShowForm(false);
      } else {
        setFormError(data.error || 'Error al enviar testimonio');
        setTimeout(() => setFormError(''), 5000);
      }
    } catch {
      setFormError('Error de conexión. Intenta nuevamente.');
      setTimeout(() => setFormError(''), 5000);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="text-blue-400 w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Testimonios</h1>
      <p className="text-gray-300 text-center text-lg mb-8 max-w-2xl mx-auto">
        Lo que nuestros clientes dicen sobre nosotros
      </p>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-center text-red-300 mb-8">
          {error}
        </div>
      )}

      {/* Filtros y botón para escribir */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${
              filterRating === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Filter size={14} /> Todos ({testimonios.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = testimonios.filter(t => t.rating === rating).length;
            return (
              <button
                key={rating}
                onClick={() => handleFilterChange(rating)}
                className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'} />
                  ))}
                </div>
                ({count})
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition flex items-center gap-2"
        >
          ✍️ {showForm ? 'Cerrar formulario' : 'Escribir testimonio'}
        </button>
      </div>

      {/* Formulario (colapsable) */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Comparte tu experiencia</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {formMessage && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4">
              {formMessage}
            </div>
          )}

          {formError && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tu nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tu email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tu cargo / rol</label>
                <input
                  type="text"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  placeholder="CEO, Director, Gerente..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Empresa</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder="Nombre de tu empresa"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Tu calificación *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={`${
                        star <= (hoverRating || formData.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-600'
                      } transition`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Tu testimonio *</label>
              <textarea
                rows={4}
                value={formData.texto}
                onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                placeholder="Cuéntanos tu experiencia con SITCAM..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              {sending ? 'Enviando...' : 'Enviar testimonio'}
            </button>
          </form>
        </div>
      )}

      {/* Grid de testimonios */}
      {paginatedTestimonios.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-400">No hay testimonios que coincidan con el filtro seleccionado</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTestimonios.map((testimonio) => (
              <div key={testimonio.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition">
                <div className="flex items-center gap-3 mb-3">
                  {testimonio.imagen_data ? (
                    <img 
                      src={testimonio.imagen_data} 
                      alt={testimonio.nombre}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white text-sm">{testimonio.nombre}</h3>
                    <p className="text-gray-400 text-xs">
                      {testimonio.rol}
                      {testimonio.empresa && ` en ${testimonio.empresa}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < testimonio.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                    />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">"{testimonio.texto}"</p>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    currentPage === page
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
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Testimonios;