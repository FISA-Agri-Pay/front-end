import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from '../api/tokenStorage';

export default function PrivateRoute() {
  if (!tokenStorage.getAccess()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
