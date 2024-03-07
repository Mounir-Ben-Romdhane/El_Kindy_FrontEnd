import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import React from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import { Link } from 'react-router-dom';
import TopBarTeacherStudent from  'components/TopBarTeacherStudent';
function index() {
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
                                {/* Counter boxes END */}
                                {/* Chart START */}
                                <div className="row mt-5">
                                    <div className="col-12">
                                        <div className="card card-body bg-transparent border p-4 h-100">
                                            <div className="row g-4">
                                                {/* Content */}
                                                <div className="col-sm-6 col-md-4">
                                                    <span className="badge bg-dark text-white">Current Month</span>
                                                    <h4 className="text-primary my-2">$35000</h4>
                                                    <p className="mb-0"><span className="text-success me-1">0.20%<i className="bi bi-arrow-up" /></span>vs last month</p>
                                                </div>
                                                {/* Content */}
                                                <div className="col-sm-6 col-md-4">
                                                    <span className="badge bg-dark text-white">Last Month</span>
                                                    <h4 className="my-2">$28000</h4>
                                                    <p className="mb-0"><span className="text-danger me-1">0.10%<i className="bi bi-arrow-down" /></span>Then last month</p>
                                                </div>
                                            </div>
                                            {/* Apex chart */}
                                            <div id="ChartPayout" />
                                        </div>
                                    </div>
                                </div>
                                {/* Chart END */}
                                {/* Course List table START */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card border bg-transparent rounded-3 mt-5">
                                            {/* Card header START */}
                                            <div className="card-header bg-transparent border-bottom">
                                                <div className="d-sm-flex justify-content-sm-between align-items-center">
                                                    <h3 className="mb-2 mb-sm-0">Most Selling Courses</h3>
                                                    <a href="#" className="btn btn-sm btn-primary-soft mb-0">View all</a>
                                                </div>
                                            </div>
                                            {/* Card header END */}
                                            {/* Card body START */}
                                            <div className="card-body">
                                                <div className="table-responsive border-0 rounded-3">
                                                    {/* Table START */}
                                                    <table className="table table-dark-gray align-middle p-4 mb-0">
                                                        {/* Table head */}
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="border-0 rounded-start">Course Name</th>
                                                                <th scope="col" className="border-0">Selling</th>
                                                                <th scope="col" className="border-0">Amount</th>
                                                                <th scope="col" className="border-0">Period</th>
                                                                <th scope="col" className="border-0 rounded-end">Action</th>
                                                            </tr>
                                                        </thead>
                                                        {/* Table body START */}
                                                        <tbody>
                                                            {/* Table item */}
                                                            <tr>
                                                                {/* Course item */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* Image */}
                                                                        <div className="w-60px">
                                                                            <img src="assets/images/courses/4by3/08.jpg" className="rounded" alt />
                                                                        </div>
                                                                        {/* Title */}
                                                                        <h6 className="mb-0 ms-2 table-responsive-title">
                                                                            <a href="#">Building Scalable APIs with GraphQL</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* Selling item */}
                                                                <td>34</td>
                                                                {/* Amount item */}
                                                                <td>$1,25,478</td>
                                                                {/* Period item */}
                                                                <td>
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary">9 months</span>
                                                                </td>
                                                                {/* Action item */}
                                                                <td>
                                                                    <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                                                                    <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                                                                </td>
                                                            </tr>
                                                            {/* Table item */}
                                                            <tr>
                                                                {/* Course item */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* Image */}
                                                                        <div className="w-60px">
                                                                            <img src="assets/images/courses/4by3/10.jpg" className="rounded" alt />
                                                                        </div>
                                                                        {/* Title */}
                                                                        <h6 className="mb-0 ms-2 table-responsive-title">
                                                                            <a href="#">Bootstrap 5 From Scratch</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* Selling item */}
                                                                <td>45</td>
                                                                {/* Amount item */}
                                                                <td>$2,85,478</td>
                                                                {/* Period item */}
                                                                <td>
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary">6 months</span>
                                                                </td>
                                                                {/* Action item */}
                                                                <td>
                                                                    <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                                                                    <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                                                                </td>
                                                            </tr>
                                                            {/* Table item */}
                                                            <tr>
                                                                {/* Course item */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* Image */}
                                                                        <div className="w-60px">
                                                                            <img src="assets/images/courses/4by3/02.jpg" className="rounded" alt />
                                                                        </div>
                                                                        {/* Title */}
                                                                        <h6 className="mb-0 ms-2 table-responsive-title">
                                                                            <a href="#">Graphic Design Masterclass</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* Selling item */}
                                                                <td>21</td>
                                                                {/* Amount item */}
                                                                <td>$85,478</td>
                                                                {/* Period item */}
                                                                <td>
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary">4 months</span>
                                                                </td>
                                                                {/* Action item */}
                                                                <td>
                                                                    <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                                                                    <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                                                                </td>
                                                            </tr>
                                                            {/* Table item */}
                                                            <tr>
                                                                {/* Course item */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* Image */}
                                                                        <div className="w-60px">
                                                                            <img src="assets/images/courses/4by3/04.jpg" className="rounded" alt />
                                                                        </div>
                                                                        {/* Title */}
                                                                        <h6 className="mb-0 ms-2 table-responsive-title">
                                                                            <a href="#">Learn Invision</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* Selling item */}
                                                                <td>28</td>
                                                                {/* Amount item */}
                                                                <td>$98,478</td>
                                                                {/* Period item */}
                                                                <td>
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary">8 months</span>
                                                                </td>
                                                                {/* Action item */}
                                                                <td>
                                                                    <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                                                                    <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                                                                </td>
                                                            </tr>
                                                            {/* Table item */}
                                                            <tr>
                                                                {/* Course item */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {/* Image */}
                                                                        <div className="w-60px">
                                                                            <img src="assets/images/courses/4by3/06.jpg" className="rounded" alt />
                                                                        </div>
                                                                        {/* Title */}
                                                                        <h6 className="mb-0 ms-2 table-responsive-title">
                                                                            <a href="#">Angular – The Complete Guider</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* Selling item */}
                                                                <td>38</td>
                                                                {/* Amount item */}
                                                                <td>$1,02,478</td>
                                                                {/* Period item */}
                                                                <td>
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary">1 year</span>
                                                                </td>
                                                                {/* Action item */}
                                                                <td>
                                                                    <a href="#" className="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i className="far fa-fw fa-edit" /></a>
                                                                    <button className="btn btn-sm btn-danger-soft btn-round mb-0"><i className="fas fa-fw fa-times" /></button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                        {/* Table body END */}
                                                    </table>
                                                    {/* Table END */}
                                                </div>
                                                {/* Pagination */}
                                                <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
                                                    {/* Content */}
                                                    <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                                                    {/* Pagination */}
                                                    <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                                                        <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                                            <li className="page-item mb-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-left" /></a></li>
                                                            <li className="page-item mb-0"><a className="page-link" href="#">1</a></li>
                                                            <li className="page-item mb-0 active"><a className="page-link" href="#">2</a></li>
                                                            <li className="page-item mb-0"><a className="page-link" href="#">3</a></li>
                                                            <li className="page-item mb-0"><a className="page-link" href="#"><i className="fas fa-angle-right" /></a></li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                            </div>
                                            {/* Card body START */}
                                        </div>
                                    </div>
                                </div>
                                {/* Course List table END */}
                            </div>
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

export default index