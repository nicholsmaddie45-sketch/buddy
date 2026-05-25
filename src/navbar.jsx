// the navigation bar at the top of every page
//
// if not logged in - show Login and Register links on the right
// if logged in - show Account link and a Logout button on the right
// the Books link always shows no matter what

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Navbar() {
  // grab the current user and the logout function from the shared login doc
  // user is null if nobody is logged in
  const { user, logout } = useAuth();

  // useNavigate gives us a function to change the page from inside code
  const navigate = useNavigate();

  // runs when the user clicks Logout
  // step 1 - call logout() to wipe the token and clear user info
  // step 2 - send them to the login page
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      {/* clicking the title always goes back to the books list */}
      <Link to="/books" className="navbar-brand">
        📚 Book Buddy
      </Link>

      <div className="navbar-links">
        <Link to="/books" className="nav-link">
          Books
        </Link>

        {/* user is not null means someone is logged in
            user is null means nobody is logged in
            the ? : is a shortcut if/else — pick one or the other */}
        {user ? (
          <>
            <Link to="/account" className="nav-link">
              Account
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
