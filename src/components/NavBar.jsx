import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../state";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loadScripts } from "../scriptLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faTags, faCalendarAlt, faUsers, faClipboardList, faEnvelope, faBriefcase } from '@fortawesome/free-solid-svg-icons';




function NavBar() {
  const accessToken = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const userRole = useSelector((state) => state.userRole);
  const role = accessToken ? jwtDecode(accessToken).roles : null;

  const user = accessToken ? jwtDecode(accessToken) : "";

  const getAvatarSrc = () => {
    
    if (user && user.picturePath !== "" && !user.authSource === "local") {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${user.picturePath}`;
    } else if (user && user.authSource === "local" && user.gender !== "") {

      // If user has no custom picture but has a gender
      return user.gender === 'male' ? '/assets/images/element/01.jpg' : '/assets/images/element/02.jpg';
    } else {
      // Default avatar if no picture path or gender is available
      return user.picturePath;
    }
  };



  const getDashboardLink = () => {
    if (!role) return "/"; // Default link if role is not available
  
    // Check each role individually
    if (role.includes("student")) {
      return "/dashboard-student";
    } else if (role.includes("teacher")) {
      return "/dashboard-teacher";
    } else if (role.includes("admin") || role.includes("superAdmin")) {
      return "/dashboard-admin";
    } else {
      return "/"; // Default link if role does not match any of the specified roles
    }
  };
  
  const logoutHandler = () => {
    dispatch(setLogout());

    navigate("/");
  };

  const scriptsLoaded = useRef(false);

  useEffect(() => {
    const scripts = [
      //'/assets/js/functions.js',
    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  useEffect(() => {
    // Set activeNavItem based on current location
    const pathname = location.pathname;
    setActiveNavItem(pathname);
  }, [location]);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item === activeNavItem ? "" : item);
  };
  return (
    <div>
      {/* Header START */}
      <header className="navbar-light bg-light navbar-sticky header-static">
        {/* Logo Nav START */}
        <nav className="navbar navbar-expand-xl">
          <div className="container">
            {/* Logo START */}

            <Link className="navbar-brand" to="/home">
              <img
                className="light-mode-item navbar-brand-item"
                src="/assets/images/logo/logo.png"
                style={{ width: "150px", height: "60px" }}
                alt="logo"
              />
              <img
                className="dark-mode-item navbar-brand-item"
                src="/assets/images/logo/logo.png"
                style={{ width: "150px", height: "60px" }}
                alt="logo"
              />
            </Link>
            {/* Logo END */}
            {/* Responsive navbar toggler */}
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-animation">
                <span />
                <span />
                <span />
              </span>
            </button>
            {/* Main navbar START */}
            <div className="navbar-collapse w-100 collapse" id="navbarCollapse">
              {/* Nav Main menu START */}
              <ul className="navbar-nav navbar-nav-scroll mx-auto">
                {/* Nav HOME*/}
                <li className="nav-item ">
                  <Link 
                    className={`nav-link ${activeNavItem === "/home" ? "active" : ""}`}
                    to="/home"
                    onClick={() => handleNavItemClick("/home")}>
                    <i className="fas fa-home fa-fw me-1" />
                    Home
                  </Link>
                </li>
                {/* CORSUS */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${activeNavItem === "/category" || activeNavItem === "/courses" || activeNavItem === "/stage" ? "active" : ""}`}
                    href="#"
                    id="demoMenu"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="fa-fw me-1" /> 
                    Corsus
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="demoMenu">
                    <li>
                      {" "}
                      <Link 
                         className={`dropdown-item ${activeNavItem === "/category" ? "active" : ""}`}
                         to="/category"
                         onClick={() => handleNavItemClick("/category")}>
                       <FontAwesomeIcon icon={faTags} className="fa-fw me-1" /> {/* Category Courses */}
                        Category
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link 
                         className={`dropdown-item ${activeNavItem === "/courses" ? "active" : ""}`}
                         to="/courses"
                         onClick={() => handleNavItemClick("/courses")}>
                      <FontAwesomeIcon icon={faGraduationCap} className="fa-fw me-1" /> 
                        Courses
                      </Link>
                    </li>
                    <li>
                      {" "}
                      
                      <Link 
                         className={`dropdown-item ${activeNavItem === "/stage" ? "active" : ""}`}
                         to="/stage"
                         onClick={() => handleNavItemClick("/stage")}>
                      <FontAwesomeIcon icon={faGraduationCap} className="fa-fw me-1" /> 
                      Internship
                      </Link>
                    </li>
                  </ul>
                </li>
                
                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link 
                         className={`nav-link ${activeNavItem === "/listEventUser" ? "active" : ""}`}
                         to="/listEventUser"
                         onClick={() => handleNavItemClick("/listEventUser")}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="fa-fw me-1" /> 
                      Events
                      </Link>
                </li>
                

                {/* Nav item 4 Component
                <li className="nav-item ">
                  <a className="nav-link" href="docs/alerts.html">
                  <FontAwesomeIcon icon={faUsers} className="fa-fw me-1" /> 
                    Témoignags
                  </a>
                </li>
                */}
                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link className={`nav-link ${activeNavItem === "/inscription" ? "active" : ""}`}
                    to="/inscription"
                    onClick={() => handleNavItemClick("/inscription")}>
                      <FontAwesomeIcon icon={faClipboardList} className="fa-fw me-1" /> {/* Preinscription */}
                    Inscription
                  </Link>
                </li>
                {/* Nav item 4 Component*/}
                <li className="nav-item ">
                  <Link 
                  className={`nav-link ${activeNavItem === "/contact-us" ? "active" : ""}`}
                  to="/contact-us"
                  onClick={() => handleNavItemClick("/contact-us")}>
                    <FontAwesomeIcon icon={faEnvelope} className="fa-fw me-1" /> {/* Contact */}
                    Contact
                  </Link>
                </li>
              </ul>
              {/* Nav Main menu END */}
              {/* Dark mode switch */}
              {
                !accessToken && 
                <div className="navbar-nav my-2 ms-2">
                  <div className="modeswitch-wrap" id="darkModeSwitch">
                    <div className="modeswitch-item">
                      <div className="modeswitch-icon" />
                    </div>
                  </div>
                </div>
              }
            
            </div>
            {/* Main navbar END */}
            
            {/* Profile START */}
            {accessToken ? (
              <div className="dropdown ms-1 ms-lg-0">
                <a
                  className="avatar avatar-sm p-0"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-auto-close="outside"
                  data-bs-display="static"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="avatar-img rounded-circle"
                    src={getAvatarSrc()}
                    alt="avatar"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
                  aria-labelledby="profileDropdown"
                >
                  {/* Profile info */}
                  <li className="px-3">
                    <div className="d-flex align-items-center">
                      {/* Avatar */}
                      <div className="avatar me-3">
                        <img
                          className="avatar-img rounded-circle shadow"
                          src={getAvatarSrc()}
                          alt="avatar"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <a className="h6 mt-2 mt-sm-0 text-truncate" href="#">
                        {user?.fullName}
                        </a>
                        <p className="small m-0">{user?.email}</p>
                      </div>
                    </div>
                    <hr />
                  </li>
                  {/* Links */}
                  <li>
  <Link
    to={getDashboardLink()}
    className="dropdown-item"
  >
    <i className="bi bi-grid-fill fa-fw me-1" /> {/* Replace "bi-person" with "bi-house-door" for a dashboard icon */}
    Dashboard
  </Link>
</li>

                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person fa-fw me-2" />
                      Edit Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-gear fa-fw me-2" />
                      Account Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-info-circle fa-fw me-2" />
                      Help
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item bg-danger-soft-hover"
                      onClick={logoutHandler}
                    >
                      <i className="bi bi-power fa-fw me-2" />
                      Sign Out
                    </a>
                  </li>
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Dark mode switch START */}
                  <li>
                    <div className="modeswitch-wrap" id="darkModeSwitch">
                      <div className="modeswitch-item">
                        <div className="modeswitch-icon" />
                      </div>
                      <span>Dark mode</span>
                    </div>
                  </li>
                  {/* Dark mode switch END */}
                </ul>
              </div>
            ) : (
              <div class="navbar-nav">
                
                {/* Signout button  */}
                <div className="navbar-nav d-lg-inline-block">
                  <button className="btn btn-orange-soft mb-0 rounded-pill" onClick={handleSignIn}><i className="fas fa-sign-in-alt me-2" />Sign In</button>
                </div>
              </div>
            )}

            {/* Profile START */}
          </div>
        </nav>
        {/* Logo Nav END */}
      </header>

      {/* Header END */}
    </div>
  );
}

export default NavBar;