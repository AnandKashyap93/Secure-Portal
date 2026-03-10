import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ApproverDashboard from './pages/ApproverDashboard';




const ProtectedRoute = ({ role, children }: { role: 'admin' | 'user' | 'approver'; children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'user') return <Navigate to="/user" />;
    if (user.role === 'approver') return <Navigate to="/approver" />;
  }
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();

  const getIndexRedirect = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'user': return '/user';
      case 'approver': return '/approver';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={getIndexRedirect(user.role)} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={getIndexRedirect(user.role)} />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/approver" element={<ProtectedRoute role="approver"><ApproverDashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
