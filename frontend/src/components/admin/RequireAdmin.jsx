import { Navigate, useLocation } from 'react-router-dom';
import { getToken, parseJwtPayload } from '../../utils/auth';

export function RequireAdmin({ children }) {
    const location = useLocation();
    const token = getToken();
    const role = parseJwtPayload(token)?.role;

    if (!token) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        );
    }
    if (role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}
