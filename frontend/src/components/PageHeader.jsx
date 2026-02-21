export default function PageHeader({ title, children }) {
    return (
        <div className="page-header">
            <h2 className="page-title">{title}</h2>
            {children}
        </div>
    );
}
