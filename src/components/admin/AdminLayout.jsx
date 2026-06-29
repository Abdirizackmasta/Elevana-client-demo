import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Tag, Users, CreditCard, BarChart3, Settings, LogOut, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const AdminLayout = () => {
  const { logout } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={settings.logo || '/brand/logo-horizontal.png'} alt={settings.siteName} />
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end><LayoutDashboard size={17} /> Dashboard</NavLink>
          <NavLink to="/admin/courses"><BookOpen size={17} /> Courses</NavLink>
          <NavLink to="/admin/categories"><Tag size={17} /> Categories</NavLink>
          <NavLink to="/admin/students"><Users size={17} /> Students</NavLink>
          <NavLink to="/admin/payments"><CreditCard size={17} /> Payments</NavLink>
          <NavLink to="/admin/reports"><BarChart3 size={17} /> Reports</NavLink>
          <NavLink to="/admin/settings"><Settings size={17} /> Settings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/"><Globe size={17} /> View site</NavLink>
          <button onClick={handleLogout}><LogOut size={17} /> Log out</button>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
