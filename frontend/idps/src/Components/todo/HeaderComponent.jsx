import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

import attackImage from "./assets/images/cyber-attack.png";

export default function HeaderComponent() {
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;

  function handleLogout() {
    authContext.logout();
  }

  return (
    <header className="mb-0 p-1">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg">
            <a
              className="navbar-brand ms-2 fs-2 fw-bold text-black"
              href="https://github.com/rexrk"
            >
              IntruDB
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link" to="/welcome">
                      <img
                        src="https://www.freeiconspng.com/thumbs/homepage-icon-png/house-icon-png-white-32.png"
                        alt=""
                        height={27}
                        style={{ marginRight: "5px", marginBottom: "5px" }}
                      ></img>
                      Home
                    </Link>
                  )}
                </li>
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link" to="/attacks">
                      <img
                        src={attackImage}
                        alt=""
                        height={27}
                        style={{ marginRight: "5px", marginBottom: "5px" }}
                      ></img>
                      Attacks
                    </Link>
                  )}
                </li>
                {isAuthenticated && (
                  <li
                    className="nav-item fs-5 dropdown"
                    onMouseEnter={() => document.getElementById("applicationDropdown").classList.add("show")}
                    onMouseLeave={() => document.getElementById("applicationDropdown").classList.remove("show")}
                  >
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdownMenuLink"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5738/5738077.png"
                        alt=""
                        height={25}
                        style={{ marginRight: "5px", marginBottom: "5px", opacity: "0.7" }}
                      ></img>
                      Application
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink"
                      id="applicationDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/application/add">
                          Add
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/application/view">
                          View
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link" to="/roles">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5151/5151146.png"
                        alt=""
                        height={23}
                        style={{ marginRight: "5px", marginBottom: "5px" }}
                      ></img>
                      Roles
                    </Link>
                  )}
                </li>
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link" to="/roles/privileges">
                      <img
                        src="https://cdn-icons-png.freepik.com/512/7439/7439921.png"
                        alt=""
                        height={23}
                        style={{ marginRight: "5px", marginBottom: "5px" }}
                      ></img>
                      Role Privileges
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item fs-5">
                {!isAuthenticated && (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                )}
              </li>
              <li className="nav-item fs-5">
                {isAuthenticated && (
                  <Link
                    className="nav-link"
                    to="/logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}