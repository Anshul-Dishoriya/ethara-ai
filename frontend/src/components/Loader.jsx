import '../assets/styles/Loader.css';

export default function Loader({ message = 'Loading...' }) {
    return (
        <div className="loader-container">
            <div className="loader-spinner" />
            <p className="loader-message">{message}</p>
        </div>
    );
}
