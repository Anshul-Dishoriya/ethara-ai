import '../assets/styles/Modal.css';

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button type="button" className="btn btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
