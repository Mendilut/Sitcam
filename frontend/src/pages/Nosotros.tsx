import { useState, useEffect } from 'react';
import { Users, Target, Award, Heart, Code, Loader } from 'lucide-react';

interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
}

function Nosotros() {
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await fetch('/api/equipo');
        const data = await response.json();
        setEquipo(data);
      } catch (error) {
        console.error('Error al cargar equipo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipo();
  }, []);

  const valores = [
    { icon: Heart, title: 'Compromiso', desc: 'Nos dedicamos al éxito de cada proyecto' },
    { icon: Target, title: 'Innovación', desc: 'Buscamos siempre la mejor solución' },
    { icon: Award, title: 'Calidad', desc: 'Estándares internacionales' },
    { icon: Users, title: 'Pasión', desc: 'Amamos lo que hacemos' },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="text-blue-400 w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ¿Quiénes <span className="text-blue-400">somos?</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Conoce la empresa, nuestros valores y el equipo que hace posible transformar ideas en soluciones digitales.
        </p>
      </div>

      {/* Historia */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Code size={24} className="text-blue-400" /> Nuestra Historia
        </h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          SITCAM nació en 2020 con la visión de democratizar el acceso a la tecnología en Cuba. 
          Comenzamos como un pequeño equipo de desarrolladores apasionados y hoy somos una empresa 
          reconocida por ofrecer soluciones innovadoras y de calidad.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Hemos trabajado con más de 30 clientes en diversos sectores: comercio, educación, 
          salud y gobierno, ayudándolos a transformar sus procesos mediante la tecnología.
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Target size={20} className="text-blue-400" /> Misión
          </h3>
          <p className="text-gray-400">
            Ofrecer soluciones tecnológicas innovadoras que impulsen el crecimiento de las empresas, 
            mejorando su eficiencia y competitividad en el mercado digital.
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Award size={20} className="text-blue-400" /> Visión
          </h3>
          <p className="text-gray-400">
            Ser la empresa de tecnología líder en Cuba, reconocida por la excelencia en desarrollo 
            de software y la satisfacción de nuestros clientes.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Nuestros Valores</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {valores.map((valor, idx) => (
            <div key={idx} className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
              <valor.icon className="text-blue-400 w-12 h-12 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{valor.title}</h3>
              <p className="text-gray-400 text-sm">{valor.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipo - Dinámico */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Nuestro Equipo</h2>
        {equipo.length === 0 ? (
          <p className="text-center text-gray-400">Cargando equipo...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipo.map((miembro) => (
              <div key={miembro.id} className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700">
                {miembro.imagen_url ? (
                  <img 
                    src={miembro.imagen_url} 
                    alt={miembro.nombre}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users size={40} className="text-blue-400" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{miembro.nombre}</h3>
                <p className="text-blue-400 text-sm mb-2">{miembro.cargo}</p>
                {miembro.descripcion && (
                  <p className="text-gray-500 text-xs">{miembro.descripcion}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">¿Tienes un proyecto en mente?</h2>
        <a
          href="/contacto"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          Contáctanos
        </a>
      </div>
    </div>
  );
}

export default Nosotros;