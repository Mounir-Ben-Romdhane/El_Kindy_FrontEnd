import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "react-confirm-alert/src/react-confirm-alert.css";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import NoData from "components/NoData";

const MySwal = withReactContent(Swal);

function Index() {
  const axiosPrivate = useAxiosPrivate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCourses = async () => {
      setOpen(true);

      try {
        const response = await axiosPrivate.get("/course/all");
        setCourses(response.data.data);
        setOpen(false);

      } catch (error) {
        console.error("Error fetching courses:", error);
        setOpen(false);
      }
    };

    fetchCourses();
  }, [axiosPrivate]);

  const handleDelete = async (id) => {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivate.delete(`/course/delete/${id}`);
          setCourses(courses.filter((course) => course._id !== id));
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete course:", error);
          Swal.fire("Failed!", "Failed to delete the course.", "error");
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    [
      course.title,
      course.description,
      course.courseLevel,
      course.courseCategory.name,
    ].some((text) => text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCourses = filteredCourses.sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "Oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const totalCourses = sortedCourses.length;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />
          {open ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div className="page-content-wrapper border">
              {/* Backdrop with GridLoader */}

                  <Backdrop
                      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                      open={open2}
                  >
                      <GridLoader color={color} loading={loading} size={20} />
                  </Backdrop>
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Courses</h1>
                <Link to="/addCourse" className="btn btn-sm btn-primary">
                  Create a Course
                </Link>
              </div>
            </div>
            {courses.length === 0 ? (
              <NoData />
            ) : (
              <div className="card bg-transparent border">
                <div className="card-header bg-light border-bottom">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-body"
                          type="search"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {searchQuery === "" && (
                              <button
                                className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                                type="submit"
                              >
                                <i className="fas fa-search fs-6" />
                              </button>
                            )}
                      </form>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select border-0 z-index-9"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">Sort by</option>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive border-0 rounded-3">
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
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
                      <tbody>
                        {currentCourses.map((course) => (
                          <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>
                                  {" "}
                                  {course.description
                                    .substring(0, 100)
                                    .match(/.{1,40}/g)
                                    .map((chunk, index, array) => (
                                      <React.Fragment key={index}>
                                        {chunk}
                                        {index === array.length - 1 &&
                                        course.description.length > 50
                                          ? "..."
                                          : ""}
                                        <br />
                                      </React.Fragment>
                                    ))}{" "}
                                </td>{" "}
                            <td>
                              {course.picturePath ? (
                                <img
                                  src={`https://el-kindy-project-backend.onrender.com/assets/${course.picturePath}`}
                                  alt="Course"
                                  style={{ width: "130px", height: "110px",borderRadius: "15%",
                                }}
                                />
                              ) : (
                                <span>No Image</span>
                              )}
                            </td>
                            <td>{course.courseLevel}</td>
                            <td>{course.courseCategory.name}</td>
                            <td>
                              <Link
                                to={`/edit-course/${course._id}`}
                                className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-transparent pt-0 px-4">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstCourse + 1} to{" "}
                      {Math.min(indexOfLastCourse, filteredCourses.length)} of{" "}
                      {filteredCourses.length} entries
                    </p>
                    <nav
                      className="d-flex justify-content-center mb-0"
                      aria-label="navigation"
                    >
                      <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                        <li
                          className={`page-item ${
                            currentPage === 1 && "disabled"
                          }`}
                        >
                          {" "}
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-angle-left" />
                          </button>
                        </li>
                        {Array.from(
                          {
                            length: Math.ceil(
                              filteredCourses.length / itemsPerPage
                            ),
                          },
                          (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                index + 1 === currentPage ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li
                          className={`page-item ${
                            currentPage ===
                            Math.ceil(filteredCourses.length / itemsPerPage)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredCourses.length / itemsPerPage)
                            }
                          >
                            <i className="fas fa-angle-right" />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
          </div>
      </main>
    </div>
  );
}

export default Index;