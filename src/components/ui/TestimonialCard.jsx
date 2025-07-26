import './TestimonialCard.css';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <div className="testimonial-stars">
          {[...Array(testimonial.rating)].map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>
        <p>"{testimonial.text}"</p>
        <div className="testimonial-author">
          <div className="author-avatar">
            {testimonial.name.charAt(0)}
          </div>
          <div className="author-info">
            <strong>{testimonial.name}</strong>
            {testimonial.role && <span className="author-role">{testimonial.role}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
