import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Upload, Trash2, Download, FileArchive, CheckCircle, AlertCircle, Loader } from 'lucide-react';

function ProformaAdmin() {
  const [archivoInfo, setArchivoInfo] = useState<{ exists: boolean; size?: number; modified?: string; url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/archivos/proforma');
      const data = await response.json();
      setArchivoInfo(data);
    } catch (error) {
      setError('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.zip')) {
        setError('Solo se permiten archivos ZIP');
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no puede superar los 10MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecciona un archivo primero');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('archivo', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/api/archivos/proforma', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setSuccess('Proforma actualizada correctamente');
        setSelectedFile(null);
        fetchInfo();
        // Limpiar el input file
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al subir archivo');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar la proforma?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/archivos/proforma', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Proforma eliminada');
        fetchInfo();
      } else {
        setError('Error al eliminar');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Desconocido';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="text-blue-400 w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Proforma</h1>
        <p className="text-gray-400 text-sm mt-1">Administra el archivo de proforma de contrato que los clientes pueden descargar</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm mb-4 flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Información del archivo actual */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileArchive size={20} className="text-blue-400" />
            Proforma actual
          </h2>
          
          {archivoInfo?.exists ? (
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Archivo:</p>
                <p className="text-white font-medium">proforma-contrato.zip</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Tamaño:</p>
                <p className="text-white font-medium">{formatFileSize(archivoInfo.size)}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Última modificación:</p>
                <p className="text-white font-medium">{archivoInfo.modified ? new Date(archivoInfo.modified).toLocaleString() : 'Desconocida'}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href={archivoInfo.url}
                  download
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Descargar
                </a>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileArchive size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay ninguna proforma cargada</p>
              <p className="text-gray-500 text-sm mt-1">Sube un archivo ZIP para que los clientes puedan descargarlo</p>
            </div>
          )}
        </div>

        {/* Subir nueva proforma */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Upload size={20} className="text-blue-400" />
            Subir nueva proforma
          </h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              id="file-input"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer block"
            >
              <Upload className="mx-auto text-gray-400 w-12 h-12 mb-3" />
              <p className="text-gray-400 text-sm">
                {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo ZIP'}
              </p>
              <p className="text-gray-500 text-xs mt-1">Máximo 10MB, solo archivos ZIP</p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 bg-gray-800 rounded-lg p-3">
              <p className="text-gray-300 text-sm">Archivo seleccionado:</p>
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-gray-500 text-xs">Tamaño: {formatFileSize(selectedFile.size)}</p>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Subiendo...' : 'Subir proforma'}
          </button>
          
          <p className="text-gray-500 text-xs mt-3 text-center">
            Al subir un nuevo archivo, reemplazará al anterior
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProformaAdmin;