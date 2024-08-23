import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide "Add User" button on spesific pages
  const showAddUserButton = location.pathname === '/users';

  const showLogoutButton = location.pathname === '/users';

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand object-center" href="/">
            User List
          </a>

          <div className="d-flex">
            {showAddUserButton && (
              <div className="d-flex">
                <Link className="btn btn-outline-light me-24" to="/adduser">
                  Add User
                </Link>
              </div>
            )}

            {showLogoutButton && (
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
