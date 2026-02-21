export default function StatCard({ icon, value, label, className = '' }) {
    return (
        <div className={`stat-card ${className}`}>
            <span className="stat-icon">{icon}</span>
            <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
}
