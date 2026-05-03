import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute — Redirects to landing if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }} aria-busy="true">
        <div className="skeleton skeleton-heading" style={{ margin: '0 auto' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%', margin: '0 auto' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto' }} />
        <span className="sr-only">Loading, please wait...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
