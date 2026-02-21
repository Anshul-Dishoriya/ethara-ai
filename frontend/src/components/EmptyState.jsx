import { Inbox } from 'lucide-react';
import '../assets/styles/EmptyState.css';

export default function EmptyState({ icon, title, message }) {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">
                {icon || <Inbox size={40} />}
            </span>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-message">{message}</p>
        </div>
    );
}
