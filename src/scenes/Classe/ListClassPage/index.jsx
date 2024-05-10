import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importez les styles CSS
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import Swal from 'sweetalert2'; // Importez SweetAlert2
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import NoData from "components/NoData";
import useAxiosPrivate from "hooks/useAxiosPrivate";
const MySwal = withReactContent(Swal);

function Index() {
  const [classes, setClasses] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [itemsPerPage] = useState(8);
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // Fonction pour récupérer les catégories
     
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setOpen(true);
    try {
      const response = await axiosPrivate.get("/salle");
      setClasses(response.data);
      setTotalEntries(response.data.length); // Update the totalEntries state
      setOpen(false);
      console.log("Total Entries:", response.data.length);

    } catch (error) {
      setOpen(false);
      console.error("Error fetching classes:", error);
    }
  };

 

  const handleDeleteClasses = (classeId) => {
    MySwal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClasses(classeId);
      }
    });
  };

  const deleteClasses = async (classeId) => {
    try {
      await axiosPrivate.delete(`/salle/${classeId}`);
      fetchClasses(); // Re-fetch categories to update the list after deletion
      MySwal.fire(
        'Supprimé!',
        'La salle a été supprimée.',
        'success'
      )
    } catch (error) {
      console.error("Error deleting class:", error);
      MySwal.fire(
        'Erreur!',
        "La salle n'a pas été supprimée.",
        'error'
      )
    }
  };
 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClasses = classes.filter((classe) => {
    return [
      classe.name.toLowerCase(),
      classe.status.toLowerCase(),
      classe.capacity.toString().toLowerCase(), // Convert capacity to string and include it in search
    ].some((text) => text.includes(searchQuery.toLowerCase()));
  });
  

const sortedClasses = filteredClasses.sort((a, b) => {
  if (sortOption === "Newest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  } else if (sortOption === "Oldest") {
    return new Date(a.createdAt) - new Date(b.createdAt);
  } else if (sortOption === "A-Z") {
    return a.name.localeCompare(b.name);
  } else if (sortOption === "Z-A") {
    return b.name.localeCompare(a.name);
  }
  return 0;
});
  

  // Get the current page of classes to display
  const indexOfLastClass = currentPage * itemsPerPage;
  const indexOfFirstClass = indexOfLastClass - itemsPerPage;
  const currentClasses = sortedClasses.slice(indexOfFirstClass, indexOfLastClass);

  const totalClasses = sortedClasses.length;
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
          ) :
          <div className="page-content-wrapper border">
            {/* Title */}
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">class</h1>
                <Link to="/add-classe" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Add class</Link>

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
                  <div className="col-md-8">
                    <form className="rounded position-relative">
                      <input
                        className="form-control bg-body"
                        type="search"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    <form>
                      <select
                        className="form-select  border-0 z-index-9"
                        aria-label=".form-select-sm"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">Sort by</option>
                        <option value="A-Z">Ascendant</option>
                        <option value="Z-A">Descendant</option>
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
                        <th scope="col" className="border-0 rounded-start">Name</th>
                        <th scope="col" className="border-0">Capacity</th>
                        <th scope="col" className="border-0">Status</th> {/* Nouvelle colonne pour l'image */}
                        <th scope="col" className="border-0 rounded-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentClasses.map((classe) => (
                        <tr key={classe._id}>
                          <td>{classe.name}</td>
                          <td>{classe.capacity}</td>
                          <td>{classe.status}</td>
                          <td>
                            <Link
                              to={`/edit-classe/${classe._id}`}
                              className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              onClick={() => handleDeleteClasses(classe._id)}
                              className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
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
                {/* Course table END */}
              </div>
              {/* Card body END */}
              {/* Card footer START */}

              <div className="card-footer bg-transparent pt-0 px-4">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstClass + 1} to{" "}
                      {Math.min(indexOfLastClass, filteredClasses.length)} of{" "}
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
                </div>
              {/* Card footer END */}


            </div>
              )}
          </div>
          }
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;