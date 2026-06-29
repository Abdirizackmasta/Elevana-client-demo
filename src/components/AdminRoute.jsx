import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default AdminRoute;
