export default function RecitalCard({ recital }) {
  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-80"
      style={{
        backgroundImage: recital.image ? `url(${recital.image})` : 'linear-gradient(135deg, #2a7a6c 0%, #1e5e54 100%)'
      }}
    >
      <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{recital.date}</span>
          </div>
          {recital.icon && (
            <div className="text-white text-2xl">
              {recital.icon}
            </div>
          )}
        </div>
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">{recital.title}</h3>
          <p className="text-white/90 text-sm mb-4 line-clamp-3">{recital.description}</p>
          {recital.participants && (
            <div className="flex items-center">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {recital.participants}{' '}
                {recital.participants === 1 ? 'participante' : 'participantes'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
