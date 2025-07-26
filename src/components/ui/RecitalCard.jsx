import './RecitalCard.css';

export default function RecitalCard({ recital }) {
  return (
    <div className="recital-card">
      <div className="recital-header">
        <div className="recital-date">{recital.date}</div>
        <div className="recital-icon">🎼</div>
      </div>
      <div className="recital-content">
        <h3>{recital.title}</h3>
        <p>{recital.description}</p>
        {recital.participants && (
          <div className="participants">
            <span className="participants-label">
              {recital.participants.length} {recital.participants.length === 1 ? 'participante' : 'participantes'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
