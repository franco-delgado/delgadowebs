import './StatCard.css';

export default function StatCard({ label, value, delta, tone = 'neutral' }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {delta && <p className={`stat-delta stat-delta-${tone}`}>{delta}</p>}
    </div>
  );
}
