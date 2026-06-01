import { useState, useEffect } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { ServicioFormData } from '../../types';

interface ServicioFormProps {
  servicio?: ServicioFormData;
  onClose: () => void;
  onSuccess: () => void;
}

interface Categoria {
  id: number;
  nombre: string;
  icono: string;
}

function ServicioForm({ servicio, onClose, onSuccess }: ServicioFormProps) {
  const [formData, setFormData] = useState<ServicioFormData>({
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria_id: 5,
    icono: 'Code',
    destacado: 0,
    orden: 0,
    imagen_data: null,
    imagen_tipo: null,
    caracteristicas: '',
    tiempo_entrega: '',
    garantia: '',
    incluye: ''
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/categorias', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const categoriasServicio = data.filter((c: any) => c.tipo === 'servicio');
        setCategorias(categoriasServicio);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (servicio) {
      setFormData({
        id: servicio.id,
        titulo: servicio.titulo,
        descripcion: servicio.descripcion,
        precio: servicio.precio,
        categoria_id: servicio.categoria_id,
        icono: servicio.icono,
        destacado: servicio.destacado,
        orden: servicio.orden,
        imagen_data: servicio.imagen_data,
        imagen_tipo: servicio.imagen_tipo,
        caracteristicas: servicio.caracteristicas || '',
        tiempo_entrega: servicio.tiempo_entrega || '',
        garantia: servicio.garantia || '',
        incluye: servicio.incluye || ''
      });
      setPreviewImage(servicio.imagen_data);
    }
  }, [servicio]);

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
    const url = servicio?.id 
      ? `http://localhost:3000/api/servicios/${servicio.id}`
      : 'http://localhost:3000/api/servicios';
    const method = servicio?.id ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Error al guardar servicio');
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
            {servicio?.id ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Imagen del servicio</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Vista previa" 
                    className="h-40 mx-auto rounded-lg object-contain"
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
                  <p className="text-gray-400 text-sm">Haz clic para subir una imagen</p>
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

          <div>
            <label className="block text-gray-300 text-sm mb-1">Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Descripción *</label>
            <textarea
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Precio USD *</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio === 0 ? '' : formData.precio}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    precio: value === '' ? 0 : parseFloat(value) 
                  });
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Categoría *</label>
              {loadingCategorias ? (
                <div className="w-full px-4 py-2 bg-gray-700 rounded-lg text-gray-400">Cargando...</div>
              ) : (
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Icono *</label>
            <select
              value={formData.icono}
              onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Code">💻 Desarrollo Web</option>
              <option value="Smartphone">📱 Apps Móviles</option>
              <option value="Shield">🛡️ Ciberseguridad</option>
              <option value="Database">🗄️ Bases de Datos</option>
              <option value="Cloud">☁️ Cloud Computing</option>
              <option value="BarChart">📊 Consultoría IT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="destacado"
                checked={formData.destacado === 1}
                onChange={(e) => setFormData({ ...formData, destacado: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="destacado" className="text-gray-300 text-sm">Servicio destacado</label>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Orden</label>
              <input
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Características</label>
            <textarea
              rows={5}
              value={formData.caracteristicas || ''}
              onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
              placeholder="• Característica 1&#10;• Característica 2&#10;• Característica 3"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Usa una línea por característica, comienza con • o -</p>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Tiempo de entrega</label>
            <input
              type="text"
              value={formData.tiempo_entrega || ''}
              onChange={(e) => setFormData({ ...formData, tiempo_entrega: e.target.value })}
              placeholder="Ej: 2-3 semanas"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Garantía</label>
            <input
              type="text"
              value={formData.garantia || ''}
              onChange={(e) => setFormData({ ...formData, garantia: e.target.value })}
              placeholder="Ej: 12 meses"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">¿Qué incluye?</label>
            <textarea
              rows={4}
              value={formData.incluye || ''}
              onChange={(e) => setFormData({ ...formData, incluye: e.target.value })}
              placeholder="• Licencia perpetua&#10;• Instalación incluida&#10;• Capacitación"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Usa una línea por elemento, comienza con • o -</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

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
              {loading ? 'Guardando...' : (servicio?.id ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServicioForm;