import React from "react";

function Footer() {
  return (
    <div>
        {/* =======================
Footer START */}

<div>

  <footer className="bg-blue p-3">
    <div className="container">
      <div className="row align-items-center">
        {/* Widget */}
        <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
          {/* Logo START */}
          <a href="index.html"> <img  src="/assets/images/logo/logo.png" style={{ width: '130px', height: '40px' }} alt="logo" /> </a>
        </div>
        {/* Widget */}
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="text-center text-white">
          ©2024 <a href="https://www.webestica.com/" className="text-reset btn-link">Conservatoire El Kindy</a>. All rights reserved.
          </div>
        </div>
        {/* Widget */}
        <div className="col-md-4">
          {/* Rating */}
          <ul className="list-inline mb-0 text-center text-md-end">
            <li className="list-inline-item ms-2"><a href="https://www.facebook.com/ConservatoireElkindy"><i className="text-white fab fa-facebook" /></a></li>
            <li className="list-inline-item ms-2"><a href="https://www.youtube.com/user/conservatoireelkindy"><i className="text-white fab fa-youtube" /></a></li>
            <li className="list-inline-item ms-2"><a href="https://www.instagram.com/conservatoireelkindy/"><i className="text-white fab fa-instagram" /></a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  {/* =======================
Footer END */}
</div>

    </div>
  );
}

export default Footer;
