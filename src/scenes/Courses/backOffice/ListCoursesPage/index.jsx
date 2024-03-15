import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAccessToken, setLogout } from "../../../../state";
import refreshToken from "scenes/Authentification/TokenService/tokenService";
import axios from "axios";
//refreshToken
import useAxiosPrivate from "hooks/useAxiosPrivate";

function Index() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const [courses, setCourses] = useState([]);
  
  //refresh token
  const axiosPrivate = useAxiosPrivate();

  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    entriesPerPage: 8,
  });

  useEffect(() => {

  

    const controller = new AbortController();

        const getCourses = async () => {
            try {
                const response = await axiosPrivate.get('/course/all', {
                    signal: controller.signal
                });
                console.log(response.data);
                setCourses(response.data.data);
            } catch (err) {
                console.error(err);
                //navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCourses();

        return () => {
            controller.abort();
        }
  }, [accessToken, dispatch]);

  const handleDelete = async (id) => {
    try {
      /*await fetch(`http://localhost:3001/course/delete/${id}`, {
        method: "DELETE",
      });*/
      await axiosPrivate.delete(`/course/delete/${id}`);

      toast.success("Course deleted successfully !!", {
        autoClose: 1500,
        style: {
          color: "green", // Text color
        },
      });
      // Filter out the deleted stage from the state
      setCourses((prevStages) =>
        prevStages.filter((course) => course._id !== id)
      ); // Assuming `_id` is the unique identifier
    } catch (error) {
      console.error("Error deleting stage:", error);
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    e.preventDefault();
    console.log("searchQuery :", e.target.value);
    setSearchQuery(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset pagination to first page when search query changes
  };

  const indexOfLastEntry = pagination.currentPage * pagination.entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - pagination.entriesPerPage;
  const currentEntries = filteredCourses.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <SideBar />
        {/* Page content START */}
        <div className="page-content">
          <TopBarBack />

          {/* Page main content START */}
          <div className="page-content-wrapper border">
            <ToastContainer />
            {/* Title */}
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Courses</h1>
                <Link to="/addCourse" className="btn btn-sm btn-primary mb-0">
                  Create a Course
                </Link>
              </div>
            </div>

            {/* Render text if courses array is empty */}
            {courses.length === 0 && <h2>No courses available.</h2>}

            {/* Card START */}
            {courses.length != 0 && (
              <div className="card bg-transparent border">
                {/* Card header START */}
                <div className="card-header bg-light border-bottom">
                  {/* Search and select START */}
                  <div className="row g-3 align-items-center justify-content-between">
                    {/* Search bar */}
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-body"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          onChange={handleSearchChange}
                        />
                      </form>
                    </div>
                    {/* Select option */}
                    <div className="col-md-3">
                      {/* Short by filter */}
                      <form>
                        <select
                          className="form-select  border-0 z-index-9"
                          aria-label=".form-select-sm"
                        >
                          <option value>Sort by</option>
                          <option>Newest</option>
                          <option>Oldest</option>
                          <option>Accepted</option>
                          <option>Rejected</option>
                        </select>
                      </form>
                    </div>
                  </div>
                  {/* Search and select END */}
                </div>
                {/* Card header END */}
                {/* Card body START */}
                <div className="card-body">
                  {/* Course table START */}
                  <div className="table-responsive border-0 rounded-3">
                    {/* Table START */}
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                      {/* Table head */}
                      <thead>
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            Title
                          </th>
                          <th scope="col" className="border-0">
                            Description
                          </th>
                          <th scope="col" className="border-0">
                            Image
                          </th>
                          <th scope="col" className="border-0">
                            Level
                          </th>
                          <th scope="col" className="border-0">
                            Category
                          </th>
                          
                          <th scope="col" className="border-0">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {/* Table body START */}
                      <tbody>
                        {/* Table row */}
                        {filteredCourses.map((course) => (
                          <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td>
                              {/* Affichage de l'image */}
                              {course.picturePath ? (
                                <img
                                  src={`http://localhost:3001/assets/${course.picturePath}`}
                                  alt="Course"
                                  style={{
                                    width: "100px",
                                    height: "auto",
                                    borderRadius: "10%",
                                  }} // Adjust size as needed
                                />
                              ) : (
                                <span>No Image</span>
                              )}
                            </td>
                            
                            <td>
                              {course.courseLevel === "Beginner" && (
                                <span className="badge bg-primary text-white">
                                  Beginner
                                </span>
                              )}
                              {course.courseLevel === "Intermediate" && (
                                <span className="badge bg-purple text-white">
                                  Intermediate
                                </span>
                              )}
                              {course.courseLevel === "All level" && (
                                <span className="badge bg-orange text-white">
                                  All level
                                </span>
                              )}
                              {course.courseLevel === "Advance" && (
                                <span className="badge bg-warning text-white">
                                  Advance
                                </span>
                              )}
                            </td>
                            <td>{course.courseCategory.name}</td>
                            <td>
                              <Link
                                to={`/edit-course/${course._id}`}
                                className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                              >
                                <i class="bi bi-pencil-square"></i>
                              </Link>
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0">
                                  <i class="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Table body END */}
                    </table>
                    {/* Table END */}
                  </div>
                  {/* Course table END */}
                </div>
                {/* Card body END */}
                {/* Card ffooter START */}
                <div className="card-footer bg-transparent pt-0">
                  {/* Pagination START */}
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    {/* Content */}
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstEntry + 1} to{" "}
                      {Math.min(indexOfLastEntry, filteredCourses.length)} of{" "}
                      {filteredCourses.length} entries
                    </p>
                    {/* Pagination */}
                    <nav
                      className="d-flex justify-content-center mb-0"
                      aria-label="navigation"
                    >
                      <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                        <li className="page-item mb-0">
                          <a className="page-link" href="#" tabIndex={-1}>
                            <i className="fas fa-angle-left" />
                          </a>
                        </li>
                        <li className="page-item mb-0">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item mb-0 active">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item mb-0">
                          <a className="page-link" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item mb-0">
                          <a className="page-link" href="#">
                            <i className="fas fa-angle-right" />
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  {/* Pagination END */}
                </div>
                {/* Card footer END */}
              </div>
            )}
            {/* Card END */}
          </div>
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;
