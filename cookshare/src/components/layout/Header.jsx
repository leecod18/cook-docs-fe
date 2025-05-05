import { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUsername = localStorage.getItem("username");
      setUserName(storedUsername);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUserName(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Navbar expand="lg" className="navbar mt-2">
      <Navbar.Brand className="logo" style={{ color: "white", fontSize: "28px" }}>
        <a href="/" className="nav-links">
          CookDocs
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="me-auto">
          <a href="/aboutus" className="nav-links">
            What we do at CookDocs
          </a>
        </Nav>
        <Nav className="me-5">
          {userName ? (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                disabled={isLoading}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/user.png"
                  alt="User Icon"
                  style={{ width: "25px", height: "25px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item href="/profile">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: "bold" }}>View Profile</span>
                    <span style={{ color: "gray", fontSize: 12 }}>u/{userName}</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                <Dropdown.Item href="/add-recipe">Create</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} style={{ color: "red" }} disabled={isLoading}>
                  {isLoading ? "Logging out..." : "Logout"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/login" className="nav-links">
              Login
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

