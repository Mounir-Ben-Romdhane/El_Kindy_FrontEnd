import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import NoData from "components/NoData";

const MySwal = withReactContent(Swal);


function Index() {
  const axiosPrivate = useAxiosPrivate();
  const [stages, setStages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOpen(true);
    const fetchStages = async () => {
      try {
        const response = await axiosPrivate.get("/stage");
        setStages(response.data.stages);
        //console.log("response", response.data.stages);
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("Error fetching stages:", error);
      }
    };

    fetchStages();
  }, [axiosPrivate]);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          await axiosPrivate.delete(`/stage/${id}`);
          MySwal.fire("Deleted!", "The stage has been deleted.", "success");
          setStages((prevStages) => prevStages.filter((stage) => stage._id !== id));
        } catch (error) {
          console.error("Error deleting stage:", error);
          MySwal.fire("Error!", "The stage was not deleted.", "error");
        }
      }
    });
  };
  

  const filteredAndSortedStages = stages
    .filter(
      (stage) => {

        // Convert dates to locale string for better comparison.
        const startDateStr = new Date(stage.startDate).toISOString().split('T')[0];
        const endDateStr = new Date(stage.finishDate).toISOString().split('T')[0];
      return (
        !searchQuery ||
        stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stage.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startDateStr.includes(searchQuery) ||
        endDateStr.includes(searchQuery) ||
        (stage.price &&
          stage.price
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
         
     );
     })
    .sort((a, b) => {
      if (sortOption === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Assuming `createdAt` is the field storing the creation date
      } else if (sortOption === "Oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const totalItems = filteredAndSortedStages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedStages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>           
               <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Internships</h1>
                <Link to="/addStage" className="btn btn-sm btn-primary mb-0">
                  Create an Internship
                </Link>
              </div>
            </div>
            {stages.length === 0 ? (
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
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    <form>
                      <select
                        className="form-select border-0 z-index-9"
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">Sort by</option>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        {/* Add other sorting options */}
                      </select>
                    </form>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive border-0 rounded-3">
                  <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0 rounded-start">
                          Internship Title
                        </th>
                        
                        <th scope="col" className="border-0">
                          description
                        </th>
                        <th scope="col" className="border-0">
                          Picture
                        </th>
                        <th scope="col" className="border-0">
                          Places
                        </th>
                        <th scope="col" className="border-0">
                          Price
                        </th>
                        
                        <th scope="col" className="border-0">
                          startDate
                        </th>
                        <th scope="col" className="border-0">
                          finishDate
                        </th>
                        
                        <th scope="col" className="border-0 rounded-end">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((stage, index) => (
                        <tr key={index}>
                          <td>
                            {stage.stageId && (
                              <div>
                                <p>{stage.stageId.title}</p>
                              </div>
                            )}{" "}
                            <td>{stage.title}</td>
                          </td>
                          <td>
                            {stage.description
                              .substring(0, 50)
                              .match(/.{1,30}/g)
                              .map((chunk, index, array) => (
                                <React.Fragment key={index}>
                                  {chunk}
                                  {index === array.length - 1 &&
                                  stage.description.length > 50
                                    ? "..."
                                    : ""}
                                  <br />
                                </React.Fragment>
                              ))}
                          </td>
                          <td>
                            {stage.picturePath ? (
                              <img
                                src={`https://el-kindy-project-backend.onrender.com/assets/${stage.picturePath}`}
                                alt="Stage"
                                style={{
                                  width: "130px",
                                  height: "110px",
                                  borderRadius: "15%",
                                }} // Adjust size and border radius as needed
                              />
                            ) : (
                              <span>No Image</span>
                            )}
                          </td>
                          
                          <td>{stage.place}</td>
                          <td>{stage.price ? `${stage.price} TND` : "Free"}</td>
                          
                          <td>{stage.startDate}</td>
                          <td>{stage.finishDate}</td>


                          <td>
                            <Link
                              to={`/EditStage/${stage._id}`}
                              className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                            >
                              <i className="bi bi-pencil-square" />
                            </Link>
                            <button
                              onClick={() => handleDelete(stage._id)}
                              className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                            >
                              <i className="bi bi-trash" />
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
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredAndSortedStages.length)}{" "}
                    of {filteredAndSortedStages.length} entries
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
                            filteredAndSortedStages.length / itemsPerPage
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
                          Math.ceil(
                            filteredAndSortedStages.length / itemsPerPage
                          )
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={
                            currentPage ===
                            Math.ceil(
                              filteredAndSortedStages.length / itemsPerPage
                            )
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