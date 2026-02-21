import { AlertTriangle } from 'lucide-react';
import '../assets/styles/ErrorState.css';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
    return (
        <div className="error-state">
            <span className="error-state-icon">
                <AlertTriangle size={40} />
            </span>
            <h3 className="error-state-title">Error</h3>
            <p className="error-state-message">{message}</p>
            {onRetry && (
                <button className="error-state-btn" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}
