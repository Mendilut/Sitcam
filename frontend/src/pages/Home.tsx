import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Shield, ShoppingBag, Star, Users, CheckCircle } from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Banner principal */}
      <section id="inicio" className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Soluciones Tecnológicas para tu <span className="text-blue-400">Negocio</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Desarrollo web, aplicaciones móviles y consultoría TI. Transformamos tu visión en realidad digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contacto" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              Contáctanos
            </Link>
            <Link 
              to="/servicios" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Quiénes somos - Versión más compacta */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              ¿Quiénes <span className="text-blue-400">somos?</span>
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              SITCAM es una empresa cubana de tecnología especializada en soluciones de software a medida, 
              desarrollo web, aplicaciones móviles y consultoría tecnológica.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Nuestro equipo está formado por profesionales apasionados por la innovación, 
              comprometidos con ayudar a negocios a transformarse digitalmente.
            </p>
            <Link 
              to="/nosotros" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition mt-6"
            >
              Conoce más sobre nosotros →
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section id="servicios" className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Nuestros Servicios
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ofrecemos soluciones tecnológicas integrales adaptadas a tus necesidades
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code, title: 'Desarrollo Web', desc: 'Sitios web modernos y responsivos con las últimas tecnologías.', link: '/servicios' },
              { icon: Smartphone, title: 'Apps Móviles', desc: 'Aplicaciones nativas y multiplataforma para iOS y Android.', link: '/servicios' },
              { icon: Shield, title: 'Ciberseguridad', desc: 'Protección y auditoría para tus sistemas y datos.', link: '/servicios' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-750 transition border border-gray-700 group">
                <item.icon className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/servicios" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
              Ver todos los servicios <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Productos Destacados
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Soluciones de software diseñadas para potenciar tu negocio
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'SITCAM ERP', desc: 'Sistema de gestión empresarial completo.', link: '/productos' },
              { name: 'SITCAM POS', desc: 'Punto de venta para comercios.', link: '/productos' },
              { name: 'SITCAM Cloud', desc: 'Almacenamiento seguro en la nube.', link: '/productos' }
            ].map((product, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
                <ShoppingBag className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/productos" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
              Ver todos los productos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos - Versión compacta */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              ¿Por qué <span className="text-blue-400">elegirnos?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Razones que nos convierten en tu mejor opción
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Equipo Experto</h3>
              <p className="text-gray-400 text-sm">Profesionales certificados con años de experiencia</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Garantía de Calidad</h3>
              <p className="text-gray-400 text-sm">Entregamos soluciones probadas y documentadas</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Clientes Satisfechos</h3>
              <p className="text-gray-400 text-sm">Más de 30 clientes confían en nosotros</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios - Simplificado */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Opiniones de quienes han confiado en nosotros
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'María García', role: 'CEO TechCuba', text: 'Excelente servicio y atención. Superaron nuestras expectativas.' },
              { name: 'Carlos Méndez', role: 'Gerente Comercial', text: 'La implementación del ERP transformó nuestra operación.' }
            ].map((test, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-gray-300 mb-3 text-sm">"{test.text}"</p>
                <p className="font-semibold text-white text-sm">{test.name}</p>
                <p className="text-gray-500 text-xs">{test.role}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/testimonios" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 text-sm">
              Ver todos los testimonios <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contacto" className="py-16 px-4 bg-gradient-to-r from-blue-800 to-purple-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-gray-200 mb-6">
            Contáctanos hoy mismo y descubre cómo podemos ayudarte.
          </p>
          <Link
            to="/contacto"
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition inline-flex items-center gap-2 text-sm"
          >
            Contactar ahora <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;