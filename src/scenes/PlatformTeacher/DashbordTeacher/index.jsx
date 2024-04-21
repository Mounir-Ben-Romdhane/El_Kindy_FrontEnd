
import React from 'react';
import SideBarTeacher from 'components/SideBarTeacher';


import TopBarTeacherStudent from 'components/TopBarTeacherStudent';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

function Index() {



    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
            <main>
            <NavBar />

                {/* hedha l partie l fou9aneya  */}
                < TopBarTeacherStudent />
                {/* =======================
Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarTeacher />
                            {/* Main content START */}
                            <div className="col-xl-9">

                                {/* Counter boxes START */}
                                <div className="row g-4">
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
                                            <span className="display-6 text-warning mb-0"><i className="fas fa-tv fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={25} data-purecounter-delay={200}>0</h5>
                                                </div>
                                                <span className="mb-0 h6 fw-light">Total Courses</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-10 rounded-3">
                                            <span className="display-6 text-purple mb-0"><i className="fas fa-user-graduate fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={25} data-purecounter-delay={200}>0</h5>
                                                    <span className="mb-0 h5">K+</span>
                                                </div>
                                                <span className="mb-0 h6 fw-light">Total Students</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-info bg-opacity-10 rounded-3">
                                            <span className="display-6 text-info mb-0"><i className="fas fa-gem fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={12} data-purecounter-delay={300}>0</h5>
                                                    <span className="mb-0 h5">K</span>
                                                </div>
                                                <span className="mb-0 h6 fw-light">Enrolled Students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Counter boxes END */}


                            {/* Main content END */}
                        </div>{/* Row END */}
                    </div>
                </section>
                {/* =======================
Page content END */}
      <Footer />

            </main>
            {/* **************** MAIN CONTENT END **************** */}

        </div>
    )
}

export default Index