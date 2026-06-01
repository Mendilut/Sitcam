export default function Banner() {
  return (
    <section id="inicio" className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 overflow-hidden">
      {/* Decoración de fondo */}
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
          <a 
            href="#contacto" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
          >
            Contáctanos
          </a>
          <a 
            href="#servicios" 
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-white hover:text-gray-900 transition-all"
          >
            Ver Servicios
          </a>
        </div>
      </div>
    </section>
  );
}