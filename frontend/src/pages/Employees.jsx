import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import { UserPlus } from 'lucide-react';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ConfirmModal from '../components/ConfirmModal';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import '../assets/styles/Employees.css';

const INITIAL_FORM = { employee_id: '', full_name: '', email: '', department: '' };

/* ── Add Employee Form ── */
function AddEmployeeForm({ onSubmit, onCancel }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formError) setFormError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.employee_id || !form.full_name || !form.email || !form.department) {
            setFormError('All fields are required.');
            return;
        }
        setSubmitting(true);
        setFormError(null);
        try {
            await onSubmit(form);
            setForm(INITIAL_FORM);
            onCancel();
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.values(data).flat().join(' ');
                setFormError(messages || 'Failed to add employee.');
            } else {
                setFormError('Failed to add employee.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="employee-form" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="employee_id">Employee ID</label>
                    <input id="employee_id" name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="e.g. EMP001" />
                </div>
                <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. John Doe" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. john@company.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
                </div>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Employee'}
            </button>
        </form>
    );
}

/* ── Employees Page ── */
export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEmployees();
            setEmployees(res.data);
        } catch {
            setError('Failed to load employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async (formData) => {
        await createEmployee(formData);
        await fetchEmployees();
    };

    const handleDeleteClick = (id, name) => {
        setDeleteConfirm({ id, name });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteEmployee(deleteConfirm.id);
            setDeleteConfirm(null);
            await fetchEmployees();
        } catch {
            setDeleteConfirm(null);
        }
    };

    const columns = [
        { key: 'employee_id', label: 'Employee ID' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
        {
            key: 'actions',
            label: 'Actions',
            render: (_val, row) => (
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(row.id, row.full_name)}
                >
                    Delete
                </button>
            ),
        },
    ];

    if (loading) return <Loader message="Loading employees..." />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    return (
        <div className="employees-page">
            {deleteConfirm && (
                <ConfirmModal
                    title="Confirm Delete"
                    message={`Are you sure you want to delete ${deleteConfirm.name}? This action cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}

            <PageHeader title="Employees">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Employee'}
                </button>
            </PageHeader>

            {showForm && (
                <AddEmployeeForm
                    onSubmit={handleAddEmployee}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <DataTable
                columns={columns}
                data={employees}
                emptyState={{ icon: <UserPlus size={40} />, title: 'No employees yet', message: "Click '+ Add Employee' to get started." }}
            />
        </div>
    );
}
