import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import React, { useEffect, useState } from "react";
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';

function index() {

    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
                        {/* ****************testt **************** */}

            <main>


                {/* hedha l partie l fou9aneya  */}
                < NavBar />
                < TopBarTeacherStudent />
                {/* =======================
Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarStudent />
                            <div className="col-xl-9">
                                {/* Counter boxes START */}
                                <div className="row mb-4">
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-orange bg-opacity-15 rounded-3">
                                            <span className="display-6 lh-1 text-orange mb-0"><i className="fas fa-tv fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={9} data-purecounter-delay={200}>0</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Total Courses</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-15 rounded-3">
                                            <span className="display-6 lh-1 text-purple mb-0"><i className="fas fa-clipboard-check fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={52} data-purecounter-delay={200}>0</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Complete lessons</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Counter item */}
                                    <div className="col-sm-6 col-lg-4 mb-3 mb-lg-0">
                                        <div className="d-flex justify-content-center align-items-center p-4 bg-success bg-opacity-10 rounded-3">
                                            <span className="display-6 lh-1 text-success mb-0"><i className="fas fa-medal fa-fw" /></span>
                                            <div className="ms-4">
                                                <div className="d-flex">
                                                    <h5 className="purecounter mb-0 fw-bold" data-purecounter-start={0} data-purecounter-end={8} data-purecounter-delay={300}>0</h5>
                                                </div>
                                                <p className="mb-0 h6 fw-light">Achieved Certificates</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Counter boxes END */}
                                {/* Main content END */}
                            </div>{/* Row END */}

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

export default index