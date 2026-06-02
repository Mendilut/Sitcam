import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductoForm from '../../components/admin/ProductoForm';
import ResponsiveTable from '../../components/admin/ResponsiveTable';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import { Producto, ProductoFormData } from '../../types';


function ProductosAdmin() {
  const location = useLocation();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<ProductoFormData | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'nuevo') {
      setShowForm(true);
    }
  }, [location]);

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos?limit=100');
      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchProductos();
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria_id: producto.categoria_id,
      imagen_data: producto.imagen_data,
      imagen_tipo: producto.imagen_tipo,
      destacado: producto.destacado,
      caracteristicas: producto.caracteristicas ?? null,
      tiempo_entrega: producto.tiempo_entrega ?? null,
      garantia: producto.garantia ?? null,
      incluye: producto.incluye ?? null
    });
    setShowForm(true);
  };
  
  const handleCreate = () => {
    setEditingProducto(undefined);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProducto(undefined);
  };

  const handleFormSuccess = () => {
    fetchProductos();
    handleFormClose();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Cargando productos...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Productos</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 mb-4">
          {error}
        </div>
      )}

      <ResponsiveTable>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-400">Imagen</th>
                <th className="text-left p-4 text-gray-400">Nombre</th>
                <th className="text-left p-4 text-gray-400">Categoría</th>
                <th className="text-left p-4 text-gray-400">Precio</th>
                <th className="text-left p-4 text-gray-400">Destacado</th>
                <th className="text-left p-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      {producto.imagen_data ? (
                        <img
                          src={producto.imagen_data}
                          alt={producto.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                          <Eye size={20} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-white">{producto.nombre}</td>
                    <td className="p-4 text-gray-400 capitalize">
                      {producto.categoria_nombre || `ID: ${producto.categoria_id}`}
                    </td>
                    <td className="p-4 text-blue-400">${producto.precio}</td>
                    <td className="p-4">
                      {producto.destacado === 1 ? (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">Destacado</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          <Pencil size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ResponsiveTable>

      {showForm && (
        <ProductoForm
          producto={editingProducto}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </AdminLayout>
  );
}

export default ProductosAdmin;