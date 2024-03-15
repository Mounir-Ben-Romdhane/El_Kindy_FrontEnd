import react from  'react';
import {  Link } from "react-router-dom";


const  Index = () => {


   return (
       <>
{/* Left sidebar START */}
<div className="col-xl-3">
{/* Responsive offcanvas body START */}
<nav className="navbar navbar-light navbar-expand-xl mx-0">
   <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
       {/* Offcanvas header */}
       <div className="offcanvas-header bg-light">
           <h5 className="offcanvas-title" id="offcanvasNavbarLabel">My profile</h5>
           <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
       </div>
       {/* Offcanvas body */}
       <div className="offcanvas-body p-3 p-xl-0">
           <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
               {/* Dashboard menu */}
               <div className="list-group list-group-dark list-group-borderless">
                   <a className="list-group-item active" href="instructor-dashboard.html"><i className="bi bi-ui-checks-grid fa-fw me-2" />Dashboard</a>
                   <Link className="list-group-item" to="/meetingHomeS"><i className="bi bi-basket fa-fw me-2" />Meeting En Ligne</Link>

                   <Link className="list-group-item" to="/planningStudent"><i className="bi bi-basket fa-fw me-2" />Planning</Link>


                   <Link className="list-group-item" to="/TeachersList"  > <i className="bi bi-people fa-fw me-2" />Teachers</Link>
                   
                   <a className="list-group-item" href="instructor-edit-profile.html"><i className="bi bi-pencil-square fa-fw me-2" />Edit Profile</a>
                   <a className="list-group-item text-danger bg-danger-soft-hover" href="sign-in.html"><i className="fas fa-sign-out-alt fa-fw me-2" />Sign Out</a>
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
   }
export  default Index ;