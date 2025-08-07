export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-64 flex flex-col">
      <div className="flex-1">
        <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">⭐</span>
          ))}
        </div>
        <p className="text-gray-600 italic mb-4 text-sm leading-relaxed flex-1">"{testimonial.text}"</p>
      </div>
      <div className="flex items-center mt-auto">
        <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
          {testimonial.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
          {testimonial.role && (
            <div className="text-gray-500 text-xs">{testimonial.role}</div>
          )}
        </div>
      </div>
    </div>
  );
}
