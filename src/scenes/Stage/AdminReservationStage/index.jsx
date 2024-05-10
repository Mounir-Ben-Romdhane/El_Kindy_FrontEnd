import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SideBar from "components/SideBar"; // Adjust import paths as needed
import TopBarBack from "components/TopBarBack"; // Adjust import paths as needed
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import NoData from "components/NoData";

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Index() {
  const [reservations, setReservations] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const MySwal = withReactContent(Swal);
  const axiosPrivate = useAxiosPrivate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(8);
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState([]);
  
  useEffect(() => {
    fetchReservations();
    fetchStages();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axiosPrivate.get("/reservationstage/reservations?populate=stageId");
      setReservations(response.data);
      setTotalEntries(response.data.length); // Update the totalEntries state
      console.log("lmkjhgf", response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchStages = async () => {
    setOpen(true);

    try {
      const response = await axiosPrivate.get('/stage');
      

      setStages(response.data.stages);
      setTotalEntries(response.data.total);
      setOpen(false);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const confirmUpdate = (reservationId, status) => {
    MySwal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to set this reservation as ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateReservationStatus(reservationId, status);
      }
    });
  };

  const updateReservationStatus = async (reservationId, status) => {
    setOpen2(true);
    try {
      await axiosPrivate.put(`/reservationstage/updateReservationStatus/${reservationId}`, {
        status,
      });
      setOpen2(false);
      MySwal.fire("Updated!",` The reservation has been ${status}.`, "success");
      fetchReservations();
    } catch (error) {
      console.error(`Error updating reservation status to ${status}:`, error);
      setOpen2(false);
      MySwal.fire(
        "Error!",
        `The reservation status could not be updated to ${status}. Please try again later.`,
        "error"
      );
    }
  };

  const handleSearch = debounce((term) => {
    setSearchTerm(term.toLowerCase());
  }, 300);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.stageId?.title.toLowerCase().includes(searchTerm) ||
      reservation.userName.toLowerCase().includes(searchTerm) ||
      reservation.userEmail.toLowerCase().includes(searchTerm) ||
      reservation.phoneNumber.toString().includes(searchTerm) ||
      reservation.message.toLowerCase().includes(searchTerm)
  );

  const sortedReservations = filteredReservations.sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "Oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = sortedReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalReservations = sortedReservations.length;
  const totalPages = Math.ceil(totalReservations / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this reservation!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivate.delete(`/reservationstage/deleteReservation/${id}`);
          setReservations(reservations.filter((reservation) => reservation._id !== id));
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete reservation:", error);
          Swal.fire("Failed!", "Failed to delete the reservation.", "error");
        }
      }
    });
  };

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
                  <h1 className="h3 mb-2 mb-sm-0">List Internship Reservations</h1>
                </div>
              </div>
              {reservations.length === 0 ? (
                <NoData />
              ) : (
              <div className="card bg-transparent border">
                <div className="card-header bg-light border-bottom">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-8">
                      <form className="rounded position-relative" onSubmit={(e) => e.preventDefault()}>
                        <input
                          className="form-control bg-body"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button
                          className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="button" // Changed to type="button" to prevent form submission
                        >
                          <i className="fas fa-search fs-6" />
                        </button>
                      </form>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select border-0 z-index-9"
                        aria-label=".form-select-sm"
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
                          <th scope="col" className="border-0">Stage Title</th>
                          <th scope="col" className="border-0">User Name</th>
                          <th scope="col" className="border-0">User Email</th>
                          <th scope="col" className="border-0">Phone Number</th>
                          <th scope="col" className="border-0">Message</th>
                          <th scope="col" className="border-0">Status</th>
                          <th scope="col" className="border-0 rounded-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReservations
                          .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                          .map((reservation, index) => (
                            <tr key={index}>
                              {/* Display stage details */}
                              <td>
                                {reservation.stageId && (
                                  <div>
                                    <p>{reservation.stageId.title}</p>
                                  </div>
                                )}
                              </td>

                              <td>{reservation.userName}</td>
                              <td>{reservation.userEmail}</td>
                              <td>{reservation.phoneNumber}</td>
                              <td>{reservation.message}</td>
                              <td>
                                {reservation.status === "pending" && (
                                  <span className="badge bg-warning bg-opacity-15 text-warning">
                                    Pending
                                  </span>
                                )}
                                {reservation.status === "accepted" && (
                                  <span className="badge bg-success bg-opacity-15 text-success">
                                    Accepted
                                  </span>
                                )}
                                {reservation.status === "refused" && (
                                  <span className="badge bg-danger bg-opacity-15 text-danger">
                                    Refused
                                  </span>
                                )}
                              </td>
                              <td>
                                {/* Conditional rendering of accept/refuse buttons */}
                                {reservation.status !== "accepted" && (
                                  <button
                                    onClick={() => confirmUpdate(reservation._id, "accepted")}
                                    className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                                  >
                                    <i className="bi bi-check fs-4"></i> {/* Accept icon */}
                                  </button>
                                )}
                                {reservation.status !== "refused" && (
                                  <button
                                    onClick={() => confirmUpdate(reservation._id, "refused")}
                                    className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                                  >
                                    <i className="bi bi-x fs-4"></i> {/* Refuse icon */}
                                  </button>
                                )}
                                {/* Delete button */}
                                <button
                                  onClick={() => handleDelete(reservation._id)}
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
                {/* Card ffooter START */}
                <div className="card-footer bg-transparent pt-0 px-4">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstReservation + 1} to{" "}
                      {Math.min(indexOfLastReservation, filteredReservations.length)} of{" "}
                      {filteredReservations.length} entries
                    </p>
                    <nav
                      className="d-flex justify-content-center mb-0"
                      aria-label="navigation"
                    >
                      <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                        <li
                          className={`page-item ${currentPage === 1 && "disabled"
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
                              filteredReservations.length / itemsPerPage
                            ),
                          },
                          (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${index + 1 === currentPage ? "active" : ""
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
                          className={`page-item ${currentPage ===
                            Math.ceil(filteredReservations.length / itemsPerPage)
                            ? "disabled"
                            : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredReservations.length / itemsPerPage)
                            }
                          >
                            <i className="fas fa-angle-right" />
                          </button>

                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                {/* Card footer END */}
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