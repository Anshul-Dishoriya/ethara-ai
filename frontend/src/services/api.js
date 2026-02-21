import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// ── Employees ──────────────────────────────────────────────────────
export const getEmployees = () => api.get('/employees/');
export const createEmployee = (data) => api.post('/employees/', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}/`);

// ── Attendance ─────────────────────────────────────────────────────
export const getAttendanceAll = (date) => {
    const params = date ? { date } : {};
    return api.get('/attendance/', { params });
};
export const getEmployeeAttendance = (employeeId) =>
    api.get(`/employees/${employeeId}/attendance/`);
export const markAttendance = (data) => api.post('/attendance/', data);

export default api;
