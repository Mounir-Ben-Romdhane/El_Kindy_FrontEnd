import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function SideBar() {
  return (
    <div>
       {/* Sidebar START */}
            <nav className="navbar sidebar navbar-expand-xl navbar-dark bg-dark">
            {/* Navbar brand for xl START */}
            <div className="d-flex align-items-center justify-content-center">
                <a className="navbar-brand" href="index.html">
                <img className="navbar-brand-item" src="/assets/images/logo/logo.png" style={{ width: '130px', height: '70px' }} alt />
                </a>
            </div>
            {/* Navbar brand for xl END */}
            <div className="offcanvas offcanvas-start flex-row custom-scrollbar h-100" data-bs-backdrop="true" tabIndex={-1} id="offcanvasSidebar">
                <div className="offcanvas-body sidebar-content d-flex flex-column bg-dark">
                {/* Sidebar menu START */}
                <ul className="navbar-nav flex-column" id="navbar-sidebar">
                    {/* Menu item 1 */}
                    <li className="nav-item"><Link to="/dashboard-admin" className="nav-link active"><i className="bi bi-house fa-fw me-2" />Dashboard</Link></li>
                    {/* Title */}
                    <li className="nav-item ms-2 my-2">Pages</li>
                    
                    {/* Menu item 3 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-student-list.html"><i className="fas fa-user-graduate fa-fw me-2" />Teachers</a></li>
                    {/* Menu item 3 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-student-list.html"><i className="fas fa-user-graduate fa-fw me-2" />Students</a></li>
                    {/* Menu item 3 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-student-list.html"><i className="fas fa-user-graduate fa-fw me-2" />Parents</a></li>
                    {/* Menu item 3 */}
                    <li className="nav-item"> <Link className="nav-link" to="/inscriptionsList"><i className="fas fa-user fa-fw me-2" />Inscriptions</Link></li>
                    {/* menu item 3 */}
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#collapsepage" role="button" aria-expanded="false" aria-controls="collapsepage">
                        <i className="bi bi-basket fa-fw me-2" />Courses
                    </a>
                   
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="collapsepage" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <Link className="nav-link" to="/listCourses">All Courses</Link></li>
                        <li className="nav-item"> <a className="nav-link" href="admin-course-category.html">Course Category</a></li>
                        <li className="nav-item"> <a className="nav-link" href="admin-course-detail.html">Course Detail</a></li>
                        
                        <li className="nav-item"> <Link className="nav-link" to="/addCourse">Add Course</Link></li>
                    </ul>
                    </li>

                    

                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#collapsepagee" role="button" aria-expanded="false" aria-controls="collapsepage">
                        <i className="bi bi-basket fa-fw me-2" />Category
                    </a>
                   
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="collapsepagee" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <Link className="nav-link" to="/listCategories">All Category</Link></li>
                          </ul>
                    </li>


                   

                    
                    
                    {/* Event */} 
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#event" role="button" aria-expanded="false" aria-controls="collapsepage">
                        <i className="bi bi-basket fa-fw me-2" />Event
                    </a>
                    {/* Submenu */} 
                    <ul className="nav collapse flex-column" id="event" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <Link className="nav-link" to="/listEvents">List Events</Link></li>
                        <li className="nav-item"> <a className="nav-link" href="/addEvent">Add Event</a></li>
                    </ul>
                    </li>


                    {/* classe */}
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#classe" role="button" aria-expanded="false" aria-controls="collapsepage">
                        <i className="bi bi-basket fa-fw me-2" />Class
                    </a>
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="classe" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <Link className="nav-link" to="/listClasse">All Class</Link></li>
                          </ul>
                    </li>

                    {/* Menu item 4 */}
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#collapseinstructors" role="button" aria-expanded="false" aria-controls="collapseinstructors">
                        <i className="fas fa-user-tie fa-fw me-2" />Instructors
                    </a>
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="collapseinstructors" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <a className="nav-link" href="admin-instructor-list.html">Instructors</a></li>
                        <li className="nav-item"> <a className="nav-link" href="admin-instructor-detail.html">Instructor Detail</a></li>
                        <li className="nav-item"> 
                        <a className="nav-link" href="admin-instructor-request.html">Instructor requests
                            <span className="badge bg-success text-white rounded-circle ms-2">2</span>
                        </a>
                        </li>
                    </ul>
                    </li>
                    {/* menu item Stage */}
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#collapsepage-event" role="button" aria-expanded="false" aria-controls="collapsepage">
                        <i className="bi bi-basket fa-fw me-2" />Internship
                    </a>
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="collapsepage-event" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <Link className="nav-link" to="/ListStage">All Internships</Link></li>
                        <li className="nav-item"> <Link className="nav-link" to="/AddStage">Add Internship</Link></li>
                        
                    </ul>
                    </li>
                    {/* Menu item 5 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-review.html"><i className="far fa-comment-dots fa-fw me-2" />Reviews</a></li>
                    {/* Menu item 6 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-earning.html"><i className="far fa-chart-bar fa-fw me-2" />Earnings</a></li>
                    {/* Menu item 7 */}
                    <li className="nav-item"> <a className="nav-link" href="admin-setting.html"><i className="fas fa-user-cog fa-fw me-2" />Admin Settings</a></li>
                    {/* Menu item 8 */}
                    <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#collapseauthentication" role="button" aria-expanded="false" aria-controls="collapseauthentication">
                        <i className="bi bi-lock fa-fw me-2" />Authentication
                    </a>
                    {/* Submenu */}
                    <ul className="nav collapse flex-column" id="collapseauthentication" data-bs-parent="#navbar-sidebar">
                        <li className="nav-item"> <a className="nav-link" href="sign-up.html">Sign Up</a></li>
                        <li className="nav-item"> <a className="nav-link" href="sign-in.html">Sign In</a></li>
                        <li className="nav-item"> <a className="nav-link" href="forgot-password.html">Forgot Password</a></li>
                        <li className="nav-item"> <a className="nav-link" href="admin-error-404.html">Error 404</a></li>
                    </ul>
                    </li>
                    {/* Title */}
                    <li className="nav-item ms-2 my-2">Documentation</li>
                    {/* Menu item 9 */}
                    <li className="nav-item"> <a className="nav-link" href="docs/index.html"><i className="far fa-clipboard fa-fw me-2" />Documentation</a></li>
                    {/* Menu item 10 */}
                    <li className="nav-item"> <a className="nav-link" href="docs/changelog.html"><i className="fas fa-sitemap fa-fw me-2" />Changelog</a></li>
                </ul>
                {/* Sidebar menu end */}
                {/* Sidebar footer START */}
                <div className="px-3 mt-auto pt-3">
                    <div className="d-flex align-items-center justify-content-between text-primary-hover">
                    <a className="h5 mb-0 text-body" href="admin-setting.html" data-bs-toggle="tooltip" data-bs-placement="top" title="Settings">
                        <i className="bi bi-gear-fill" />
                    </a>
                    <a className="h5 mb-0 text-body" href="index.html" data-bs-toggle="tooltip" data-bs-placement="top" title="Home">
                        <i className="bi bi-globe" />
                    </a>
                    <a className="h5 mb-0 text-body" href="sign-in.html" data-bs-toggle="tooltip" data-bs-placement="top" title="Sign out">
                        <i className="bi bi-power" />
                    </a>
                    </div>
                </div>
                {/* Sidebar footer END */}
                </div>
            </div>
            </nav>
        {/* Sidebar END */}

    </div>
  )
}

export default SideBar