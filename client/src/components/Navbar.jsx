import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import context
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); // Get user state and logout function
  
  const handleLogout = () => {
    logout();
    // No need to navigate here, the PrivateRoute/App will handle the redirect
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          Lost & Found 🔎
        </Link>
        <nav className="navbar-nav">
          
          <Link to="/" className="nav-link">Home</Link>
          
          {user ? (
            // --- Logged In View ---
            <>
              <Link to="/post" className="btn btn-success">
                Report Item
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </>
          ) : (
            // --- Logged Out View ---
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Navbar;