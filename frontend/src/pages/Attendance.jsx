import { useState, useEffect } from 'react';
import { getEmployees, getEmployeeAttendance, markAttendance } from '../services/api';
import { ClipboardList, CalendarX } from 'lucide-react';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import DataTable from '../components/DataTable';
import '../assets/styles/Attendance.css';

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [status, setStatus] = useState('Present');
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [filterDate, setFilterDate] = useState('');

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

    const fetchRecords = async (empId) => {
        if (!empId) {
            setRecords([]);
            return;
        }
        setRecordsLoading(true);
        try {
            const res = await getEmployeeAttendance(empId);
            setRecords(res.data);
        } catch {
            setRecords([]);
        } finally {
            setRecordsLoading(false);
        }
    };

    const handleEmployeeChange = (e) => {
        const id = e.target.value;
        setSelectedEmployee(id);
        setFormError(null);
        fetchRecords(id);
    };

    const handleMark = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            setFormError('Please select an employee.');
            return;
        }
        if (!date) {
            setFormError('Please select a date.');
            return;
        }
        setSubmitting(true);
        setFormError(null);
        try {
            await markAttendance({ employee: selectedEmployee, date, status });
            await fetchRecords(selectedEmployee);
        } catch (err) {
            const data = err.response?.data;
            if (data?.non_field_errors) {
                setFormError(data.non_field_errors.join(' '));
            } else if (data) {
                const msgs = Object.values(data).flat().join(' ');
                setFormError(msgs || 'Failed to mark attendance.');
            } else {
                setFormError('Failed to mark attendance.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const displayedRecords = filterDate
        ? records.filter((r) => r.date === filterDate)
        : records;

    const recordColumns = [
        { key: 'date', label: 'Date' },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
            ),
        },
    ];

    if (loading) return <Loader message="Loading attendance..." />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    if (employees.length === 0) {
        return (
            <div className="attendance-page">
                <h2 className="page-title">Attendance</h2>
                <EmptyState
                    icon={<ClipboardList size={40} />}
                    title="No employees found"
                    message="Add employees first before marking attendance."
                />
            </div>
        );
    }

    return (
        <div className="attendance-page">
            <h2 className="page-title">Attendance</h2>

            <form className="attendance-form" onSubmit={handleMark}>
                <h3 className="section-title">Mark Attendance</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="att-employee">Employee</label>
                        <select id="att-employee" value={selectedEmployee} onChange={handleEmployeeChange}>
                            <option value="">Select employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.employee_id} — {emp.full_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="att-date">Date</label>
                        <input id="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="att-status">Status</label>
                        <select id="att-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                </div>
                {formError && <p className="form-error">{formError}</p>}
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Marking...' : 'Mark Attendance'}
                </button>
            </form>

            {selectedEmployee && (
                <div className="records-section">
                    <div className="records-header">
                        <h3 className="section-title">Attendance Records</h3>
                        <div className="filter-group">
                            <label htmlFor="filter-date">Filter by date:</label>
                            <input id="filter-date" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                            {filterDate && (
                                <button type="button" className="btn btn-sm btn-outline" onClick={() => setFilterDate('')}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {recordsLoading ? (
                        <Loader message="Loading records..." />
                    ) : (
                        <DataTable
                            columns={recordColumns}
                            data={displayedRecords}
                            emptyState={{
                                icon: <CalendarX size={40} />,
                                title: 'No records found',
                                message: filterDate ? 'No records for this date.' : 'No attendance marked yet for this employee.',
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
