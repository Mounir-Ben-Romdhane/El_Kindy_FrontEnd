import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Assurez-vous d'importer Link depuis react-router-dom
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import NoData from "components/NoData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const mySwal = withReactContent(Swal);


function Index() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(""); // State to hold the sorting option
  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get("/classes/getAll");
      console.log("response", response.data);

      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    // Show confirmation dialog before deleting
    mySwal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this class!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivate.delete(`/classes/${id}`);
          setClasses((prevClasses) =>
            prevClasses.filter((classe) => classe._id !== id)
          );
          mySwal.fire("Deleted!", "Class has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting class:", error);
          mySwal.fire("Failed!", "Failed to delete the class.", "error");
        }
      }
    });
  };


  const filteredClasses = classes
    ? classes.filter((classe) => {
        // Check class properties and course titles within each class
        const coursesTitles = classe.courses.map((courseId) => {
          const course = courses.find((course) => course._id === courseId);
          return course ? course.title.toLowerCase() : "";
        });

        return [
          classe.className.toLowerCase(),
          String(classe.capacity),
          String(classe.order),
          ...coursesTitles, // Spread the titles into the searchable array
        ].some((text) =>
          text.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  // Sort courses based on the selected sorting option
  const sortedClass = filteredClasses.sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.className.localeCompare(b.className);
      case "Z-A":
        return b.className.localeCompare(a.className);
      // Ajoutez d'autres options de tri selon vos besoins
      default:
        return 0;
    }
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const indexOfLastClasse = currentPage * itemsPerPage;
  const indexOfFirstClasse = indexOfLastClasse - itemsPerPage;
  const currentClasses = sortedClass.slice(
    indexOfFirstClasse,
    indexOfLastClasse
  );

  const totalClasses = sortedClass.length;
  const totalPages = Math.ceil(totalClasses / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <SideBar />
        {/* Page content START */}
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
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
              <ToastContainer />
              {/* Title */}
              <div className="row mb-3">
                <div className="col-12 d-sm-flex justify-content-between align-items-center">
                  <h1 className="h3 mb-2 mb-sm-0">Classe</h1>
                  <Link
                    to="/AddAllClasse"
                    className="btn btn-sm btn-primary me-1 mb-1 mb-md-0"
                  >
                    Add class
                  </Link>
                </div>
              </div>

              {classes.length === 0 ? (
                <NoData />
              ) : (
                <div className="card bg-transparent border">
                  {/* Card header START */}
                  <div className="card-header bg-light border-bottom">
                    {/* Search and select START */}
                    <div className="row g-3 align-items-center justify-content-between">
                      {/* Search bar */}
                      <div className="col-xl-8">
                        <form className="rounded position-relative">
                          <input
                            className="form-control bg-body"
                            type="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                          {searchQuery === "" && ( // Check if the search query is empty
                            <button
                              className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                              onClick={(event) => event.preventDefault()}
                            >
                              <i className="fas fa-search fs-6 " />
                            </button>
                          )}
                        </form>
                      </div>
                      {/* Select option */}
                      <div className="col-md-3">
                        {/* Short by filter */}
                        <form>
                          {/* Sorting dropdown */}
                          <select
                            className="form-select  border-0 z-index-9"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                          >
                            <option value="">Sort by</option>
                            <option value="A-Z">Ascending</option>
                            <option value="Z-A">Descending</option>
                            {/* Add other sorting options here */}
                          </select>
                        </form>
                      </div>
                    </div>
                    {/* Search and select END */}
                  </div>
                  {/* Card header END */}
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Classe table START */}
                    <div className="table-responsive border-0 rounded-3">
                      {/* Table START */}
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        {/* Table head */}
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            <th scope="col" className="border-0 rounded-start">
                              Class Name
                            </th>
                            <th scope="col" className="border-0">
                              Courses
                            </th>
                            <th scope="col" className="border-0 ">
                              Capacity
                            </th>
                            <th scope="col" className="border-0">
                              Order
                            </th>

                            <th scope="col" className="border-0 rounded-end">
                              Action
                            </th>
                          </tr>
                        </thead>
                        {/* Table body START */}
                        <tbody style={{ whiteSpace: "nowrap" }}>
                          {currentClasses.map((classe) => (
                            <tr key={classe._id}>
                              <td>{classe.className}</td>
                              <td>
                                <ul>
                                  {classe.courses.map((courseId) => {
                                    const course = courses.find(
                                      (c) => c._id === courseId
                                    );
                                    return course ? (
                                      <li key={course._id}>{course.title}</li>
                                    ) : null;
                                  })}
                                </ul>
                              </td>

                              <td>{classe.capacity}</td>
                              <td>{classe.ordre}</td>
                              <td>
                                <Link
                                  to={`/EditAllClasse/${classe._id}`}
                                  className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </Link>
                                <button
                                  className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                                  onClick={() => handleDelete(classe._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* Table body END */}
                      </table>
                      {/* Table END */}
                    </div>
                    {/* Classe table END */}
                  </div>
                  {/* Card body END */}
                  {/* Card ffooter START */}
                  <div className="card-footer bg-transparent pt-0">
                    {/* Pagination START */}
                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                      <p className="mb-0 text-center text-sm-start">
                        Showing {indexOfFirstClasse + 1} to{" "}
                        {Math.min(indexOfLastClasse, filteredClasses.length)} of{" "}
                        {filteredClasses.length} entries
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
                                filteredClasses.length / itemsPerPage
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
                              Math.ceil(filteredClasses.length / itemsPerPage)
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => paginate(currentPage + 1)}
                              disabled={
                                currentPage ===
                                Math.ceil(filteredClasses.length / itemsPerPage)
                              }
                            >
                              <i className="fas fa-angle-right" />
                            </button>
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
          )}
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}
export default Index;
