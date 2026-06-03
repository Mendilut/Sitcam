import { useState, useEffect } from 'react';
import { X, Upload, Loader, Star } from 'lucide-react';
import { TestimonioFormData } from '../../types';



interface TestimonioFormProps {
  testimonio?: TestimonioFormData;
  onClose: () => void;
  onSuccess: () => void;
}

function TestimonioForm({ testimonio, onClose, onSuccess }: TestimonioFormProps) {
  const [formData, setFormData] = useState<TestimonioFormData>({
    nombre: '',
    rol: '',
    empresa: '',
    texto: '',
    rating: 5,
    activo: 1,
    imagen_data: null,
    imagen_tipo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (testimonio) {
      setFormData({
        id: testimonio.id,
        nombre: testimonio.nombre,
        rol: testimonio.rol,
        empresa: testimonio.empresa || '',
        texto: testimonio.texto,
        rating: testimonio.rating,
        activo: testimonio.activo,
        imagen_data: testimonio.imagen_data,
        imagen_tipo: testimonio.imagen_tipo
      });
      setPreviewImage(testimonio.imagen_data);
    }
  }, [testimonio]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      setFormData({
        ...formData,
        imagen_data: base64String,
        imagen_tipo: file.type
      });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const url = testimonio?.id 
      ? `/api/testimonios/${testimonio.id}`
      : '/api/testimonios';
    const method = testimonio?.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar testimonio');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {testimonio?.id ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Imagen del cliente */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Foto del cliente</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              {previewImage ? (
                <div className="relative inline-block">
                  <img 
                    src={previewImage} 
                    alt="Vista previa" 
                    className="w-24 h-24 mx-auto rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData({ ...formData, imagen_data: null, imagen_tipo: null });
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="mx-auto text-gray-400 w-12 h-12 mb-2" />
                  <p className="text-gray-400 text-sm">Haz clic para subir una foto</p>
                  <p className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG (máx 2MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Nombre completo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Rol y Empresa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Rol / Cargo *</label>
              <input
                type="text"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                placeholder="CEO, Director, Gerente..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Empresa</label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nombre de la empresa"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Testimonio */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Testimonio *</label>
            <textarea
              rows={5}
              value={formData.texto}
              onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
              placeholder="Escribe aquí la opinión del cliente..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Calificación con estrellas */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
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
              <span className="text-gray-400 text-sm ml-2 self-center">
                ({formData.rating} / 5)
              </span>
            </div>
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo === 1}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="activo" className="text-gray-300 text-sm cursor-pointer">
              Testimonio visible en el sitio web
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : null}
              {loading ? 'Guardando...' : (testimonio?.id ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestimonioForm;