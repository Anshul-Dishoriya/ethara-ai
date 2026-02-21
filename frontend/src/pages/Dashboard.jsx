import { useState, useEffect } from 'react';
import { getEmployees, getAttendanceAll } from '../services/api';
import { Users, UserCheck, UserX } from 'lucide-react';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import '../assets/styles/Dashboard.css';

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [empRes, attRes] = await Promise.all([
                getEmployees(),
                getAttendanceAll(),
            ]);
            setEmployees(empRes.data);
            setAttendance(attRes.data);
        } catch {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <Loader message="Loading dashboard..." />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter((r) => r.date === today);
    const presentToday = todayRecords.filter((r) => r.status === 'Present').length;
    const absentToday = todayRecords.filter((r) => r.status === 'Absent').length;

    const presentCountMap = {};
    attendance.forEach((r) => {
        if (r.status === 'Present') {
            presentCountMap[r.employee] = (presentCountMap[r.employee] || 0) + 1;
        }
    });

    const summaryColumns = [
        { key: 'employee_id', label: 'Employee ID' },
        { key: 'full_name', label: 'Name' },
        { key: 'department', label: 'Department' },
        {
            key: 'present_days',
            label: 'Total Present Days',
            render: (_val, row) => (
                <span className="badge badge-present">
                    {presentCountMap[row.id] || 0}
                </span>
            ),
        },
    ];

    return (
        <div className="dashboard">
            <h2 className="page-title">Dashboard</h2>

            <div className="stats-grid">
                <StatCard icon={<Users size={28} />} value={employees.length} label="Total Employees" className="stat-total" />
                <StatCard icon={<UserCheck size={28} />} value={presentToday} label="Present Today" className="stat-present" />
                <StatCard icon={<UserX size={28} />} value={absentToday} label="Absent Today" className="stat-absent" />
            </div>

            {employees.length > 0 && (
                <div className="table-section">
                    <h3 className="section-title">Employee Attendance Summary</h3>
                    <DataTable columns={summaryColumns} data={employees} />
                </div>
            )}
        </div>
    );
}
