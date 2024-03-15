import react from  'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { jwtDecode } from "jwt-decode";

 const  Index = () => {

      //const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.accessToken);
  const user = accessToken ? jwtDecode(accessToken) : "";

  const getAvatarSrc = () => {
    
    if (user && user.picturePath !== "" && !user.authSource === "local") {
      // If user has a custom picture path
      return `http://localhost:3001/assets/${user.picturePath}`;
    } else if (user && user.authSource === "local" && user.gender !== "") {

      // If user has no custom picture but has a gender
      return user.gender === 'male' ? '/assets/images/element/01.jpg' : '/assets/images/element/02.jpg';
    } else {
      // Default avatar if no picture path or gender is available
      return user.picturePath;
    }
  };


    return (
<section className="pt-0">
                    {/* Main banner background image */}
                    <div className="container-fluid px-0">
                        <div className="bg-blue h-100px h-md-200px rounded-0" style={{ background: 'url(assets/images/pattern/04.png) no-repeat center center', backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className="container mt-n4">
                        <div className="row">
                            {/* Profile banner START */}
                            <div className="col-12">
                                <div className="card bg-transparent card-body p-0">
                                    <div className="row d-flex justify-content-between">
                                        {/* Avatar */}
                                        <div className="col-auto mt-4 mt-md-0">
                                            <div className="avatar avatar-xxl mt-n3">
                                            <img
                                                className="avatar-img rounded-circle"
                                                src={getAvatarSrc()}
                                                alt="avatar"
                                                />          
                                             </div>
                                        </div>
                                        {/* Profile info */}
                                        <div className="col d-md-flex justify-content-between align-items-center mt-4">
                                            <div>
                                                <h1 className="my-1 fs-4">{user?.fullName} <i className="bi bi-patch-check-fill text-info small" /></h1>
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0"><i className="fas fa-user-graduate text-orange me-2" />12k Enrolled Students</li>
                                                    <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0"><i className="fas fa-book text-purple me-2" />25 Courses</li>
                                                </ul>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                {/* Profile banner END */}
                                {/* Advanced filter responsive toggler START */}
                                {/* Divider */}
                                <hr className="d-xl-none" />
                                <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center">
                                    <a className="h6 mb-0 fw-bold d-xl-none" href="#">Menu</a>
                                    <button className="btn btn-primary d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                                        <i className="fas fa-sliders-h" />
                                    </button>
                                </div>
                                {/* Advanced filter responsive toggler END */}
                            </div>
                        </div>
                    </div>
                </section>
);
    }
 export  default Index ;