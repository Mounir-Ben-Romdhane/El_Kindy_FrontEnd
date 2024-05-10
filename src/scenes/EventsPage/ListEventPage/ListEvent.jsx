import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "react-confirm-alert/src/react-confirm-alert.css";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import NoData from "components/NoData";

const MySwal = withReactContent(Swal);

function EventIndex() {
  const [events, setEvents] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const axiosPrivate = useAxiosPrivate();
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setOpen(true);

      try {
        const response = await axiosPrivate.get("/event/events");
        setEvents(response.data);
        setOpen(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setOpen(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
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
          await axiosPrivate.delete(`/event/events/${eventId}`);
          setEvents((prev) => prev.filter((event) => event._id !== eventId));
          MySwal.fire("Deleted!", "The event has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting event:", error);
          MySwal.fire("Error!", "The event was not deleted.", "error");
        }
      }
    });
  };

  const filteredAndSortedEvents = events
    .filter((event) => {
      // Convert dates to locale string for better comparison.
      const startDateStr = new Date(event.dateDebut).toLocaleDateString();
      const endDateStr = new Date(event.dateFin).toLocaleDateString();

      return (
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startDateStr.includes(searchQuery) ||
        endDateStr.includes(searchQuery)
      );
    })
    .sort((a, b) =>
      sortOption === "Newest"
        ? new Date(b.dateDebut) - new Date(a.dateDebut)
        : new Date(a.dateDebut) - new Date(b.dateDebut)
    );

  const totalItems = filteredAndSortedEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedEvents.slice(
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
                  <h1 className="h3 mb-2 mb-sm-0">Events</h1>
                  <Link to="/addEvent" className="btn btn-sm btn-primary">
                    Add an Event
                  </Link>
                </div>
              </div>
              {events.length === 0 ? (
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
                      <select
                        className="form-select border-0 z-index-9"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
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
                            Event Title
                          </th>
                          <th scope="col" className="border-0">
                            Event description
                          </th>
                          <th scope="col" className="border-0">
                            Event Image
                          </th>
                          <th scope="col" className="border-0">
                            Place
                          </th>
                          <th scope="col" className="border-0">
                            Start Date
                          </th>
                          <th scope="col" className="border-0">
                            End Date
                          </th>
                          <th scope="col" className="border-0 rounded-end">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((event) => (
                          <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>
                              {" "}
                              {event.description
                                .substring(0, 100)
                                .match(/.{1,40}/g)
                                .map((chunk, index, array) => (
                                  <React.Fragment key={index}>
                                    {chunk}
                                    {index === array.length - 1 &&
                                    event.description.length > 50
                                      ? "..."
                                      : ""}
                                    <br />
                                  </React.Fragment>
                                ))}{" "}
                            </td>{" "}
                            <td>
                              {event.picturePath ? (
                                <img
                                  src={`https://el-kindy-project-backend.onrender.com/assets/${event.picturePath}`}
                                  alt="event"
                                  style={{ width: "130px", height: "110px",borderRadius: "15%" }}
                                />
                              ) : (
                                <span>No Image</span>
                              )}
                            </td>
                            <td>{event.place}</td>
                            <td>
                              {new Date(event.dateDebut).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(event.dateFin).toLocaleDateString()}
                            </td>
                            <td>
                              <Link
                                to={`/editEvent/${event._id}`}
                                className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
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
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(
                        indexOfLastItem,
                        filteredAndSortedEvents.length
                      )}{" "}
                      of {filteredAndSortedEvents.length} entries
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
                            length: totalPages,
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
                            currentPage === totalPages && "disabled"
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
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

export default EventIndex;
