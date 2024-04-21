import react, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "state";

const Index = () => {
  //const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");

  const logoutHandler = () => {
    dispatch(setLogout());
    navigate("/");
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
    <>
      {/* Left sidebar START */}
      <div className="col-xl-3">
        {/* Responsive offcanvas body START */}
        <nav className="navbar navbar-light navbar-expand-xl mx-0">
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            {/* Offcanvas header */}
            <div className="offcanvas-header bg-light">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                My profile
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            {/* Offcanvas body */}
            <div className="offcanvas-body p-3 p-xl-0">
              <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
                {/* Dashboard menu */}
                <div className="list-group list-group-dark list-group-borderless">
                  <Link
                    className={`list-group-item ${activeNavItem === "/dashboard-teacher" ? "active" : ""}`}
                    to="/dashboard-teacher"
                    onClick={() => handleNavItemClick("/dashboard-teacher")}
                  >
                    <i className="bi bi-ui-checks-grid fa-fw me-2" />
                    Dashboard
                  </Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/homeMeet" || activeNavItem.startsWith("/room/") ? "active" : ""}`}
                  to="/homeMeet"
                  onClick={() => handleNavItemClick("/homeMeet")}>
                    <i className="bi bi-basket fa-fw me-2" />
                    Create Meeting En Ligne
                  </Link>
                  <Link 
                  className={`list-group-item ${activeNavItem === "/planningTeacher" || activeNavItem.startsWith("/planningTeacher") ? "active" : ""}`}
                  to="/planningTeacher"
                  onClick={() => handleNavItemClick("/planningTeacher")}>
                    <i className="bi bi-basket fa-fw me-2" />
                    Planning                  </Link>

                  <Link 
                  className={`list-group-item ${activeNavItem === "/messages" ? "active" : ""}`}
                  to="/messages"
                  onClick={() => handleNavItemClick("/messages")}>
                    <i className="bi bi-chat-dots-fill fa-fw me-2" />
                    Messages
                  </Link>


                  <Link 
                  className={`list-group-item ${activeNavItem === "/StudentsGrades" ? "active" : ""}`}
                  to="/StudentsGrades"
                  onClick={() => handleNavItemClick("/StudentsGrades")}>
                    <i className="bi bi-people fa-fw me-2" />
                    Students Grades
                  </Link>


                  <a
                    className="list-group-item"
                    href="instructor-edit-profile.html"
                  >
                    <i className="bi bi-pencil-square fa-fw me-2" />
                    Edit Profile
                  </a>

                  <a
                    className="list-group-item text-danger bg-danger-soft-hover"
                    href="#"
                    onClick={logoutHandler}
                  >
                    <i className="fas fa-sign-out-alt fa-fw me-2" />
                    Sign Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* Responsive offcanvas body END */}
      </div>
      {/* Left sidebar END */}
    </>
  );
};
export default Index;
