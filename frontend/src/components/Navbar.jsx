import { NavLink } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import '../assets/styles/Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <ClipboardList size={24} className="navbar-logo" />
                <h1>HRMS Lite</h1>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                        Employees
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                        Attendance
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
