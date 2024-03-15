import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SideBar from "components/SideBar"; // Adjust import paths as needed
import TopBarBack from "components/TopBarBack"; // Adjust import paths as needed

const MySwal = withReactContent(Swal);

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

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("https://el-kindy-project-backend.onrender.com/events/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      await axios.patch(`https://el-kindy-project-backend.onrender.com/events/reservations/${reservationId}`, { status });
      MySwal.fire('Updated!', `The reservation has been ${status}.`, 'success');
      fetchReservations(); 
    } catch (error) {
      console.error(`Error updating reservation status to ${status}:`, error);
      MySwal.fire('Error!', `The reservation status could not be updated to ${status}.`, 'error');
    }
  };

  const handleSearch = debounce((term) => {
    setSearchTerm(term.toLowerCase());
  }, 300);

  const filteredReservations = reservations.filter(
    (reservation) =>
    reservation.eventId.title.toLowerCase().includes(searchTerm) ||
      reservation.userName.toLowerCase().includes(searchTerm) ||
      reservation.userEmail.toLowerCase().includes(searchTerm) ||
      reservation.phoneNumber.toString().includes(searchTerm)
  );

  return (
    <div>
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />
          <div className="page-content-wrapper border">
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">List Reservations</h1>
                <Link to="/listEventUser" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Add a Reservation</Link>
              </div>
            </div>

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
                      <option value="asc">Ascendant</option>
                      <option value="desc">Descendant</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive border-0 rounded-3">
                  <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0">Event Title</th>
                        <th scope="col" className="border-0">User Name</th>
                        <th scope="col" className="border-0">User Email</th>
                        <th scope="col" className="border-0">Phone Number</th>
                        <th scope="col" className="border-0">Status</th>
                        <th scope="col" className="border-0 rounded-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation, index) => (
                        <tr key={index}>
                          <td>{reservation.eventId ? reservation.eventId.title : 'Event not found or deleted'}</td>
                          <td>{reservation.userName}</td>
                          <td>{reservation.userEmail}</td>
                          <td>{reservation.phoneNumber}</td>
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
                              <Link
                                onClick={() => updateReservationStatus(reservation._id, 'accepted')} 
                                className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                              >
                                <i className="bi bi-check fs-4"></i> {/* Accept icon */}
                              </Link>
                              <button
                                onClick={() => updateReservationStatus(reservation._id, 'refused')} 
                                className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0">
                                  <i className="bi bi-x fs-4"></i> {/* Refuse icon */}
                              </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
