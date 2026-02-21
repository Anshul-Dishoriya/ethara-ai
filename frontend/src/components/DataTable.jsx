import EmptyState from './EmptyState';

/**
 * Reusable config-driven data table.
 *
 * @param {Array}  columns    - { key, label, render?(value, row) }
 * @param {Array}  data       - row objects
 * @param {string} keyField   - field to use as React key (default: 'id')
 * @param {Object} emptyState - optional { icon, title, message }
 */
export default function DataTable({ columns, data, keyField = 'id', emptyState }) {
    if (data.length === 0 && emptyState) {
        return (
            <EmptyState
                icon={emptyState.icon}
                title={emptyState.title}
                message={emptyState.message}
            />
        );
    }

    if (data.length === 0) return null;

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[keyField]}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
