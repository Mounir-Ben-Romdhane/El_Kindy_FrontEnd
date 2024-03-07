import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';

const HomePagee = () => {

  const navigate = useNavigate();

  const [value, setValue] = useState();
  const handleJoinRoom = useCallback((e) => { navigate(`/room/${value}`) }, [navigate, value]);


  return (


    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>

        <NavBar />
        {/* hedha l partie l fou9aneya  */}
        <TopBarTeacherStudent />

        {/* =======================
    Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarTeacher />
              <div className="col-xl-9">
                {/* Student review START */}
                <div className="card border bg-transparent rounded-3">

                  {/* Reviews START */}
                  <div className="card-body mt-2 mt-sm-4">
                    {/* Review item START */}
                    <div className="d-sm-flex">

                      <div>
                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                          {/* Title */}
                          <div>
                            <h5 className="m-0">Making a meeting</h5>

                          </div>

                        </div>

                        {/* Button */}
                        <div className="text-end">
                          {/* collapse textarea */}
                          <div className="collapse show" id="collapseComment">
                            <div className="d-flex mt-3">
                              <textarea className="form-control mb-0" placeholder="Add a name for your room..." rows={2} spellCheck="false" value={value}
                                onChange={(e) => setValue(e.target.value)} />
                              <button className="btn btn-sm btn-primary-soft ms-2 px-4 mb-0 flex-shrink-0" onClick={handleJoinRoom}><i className="fas fa-paper-plane fs-5" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Divider */}
                    <hr />

                    {/* Divider */}

                    {/* Review item END */}
                  </div>
                  {/* Reviews END */}

                </div>
                {/* Student review END */}
              </div>
            </div>
          </div>
        </section>
        {/* =======================
    Page content END */}


        <Footer />




      </main>
      {/* **************** MAIN CONTENT END **************** */}

    </div>




  );

};

export default HomePagee;

