import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importez les styles CSS
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import Swal from 'sweetalert2'; // Importez SweetAlert2
const MySwal = withReactContent(Swal);

function Index() {
  const [classes, setClasses] = useState([]);
  const [sortOption, setSortOption] = useState("");
  useEffect(() => {
    // Fonction pour récupérer les catégories
    const fetchClasses = async () => {
      try {
        const response = await fetch("https://el-kindy-project-backend.onrender.com/salle", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data) {
          setClasses(data); // Stocke les catégories dans l'état
          console.log("classes", data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);
  const fetchClasses = async () => {
    try {
      const response = await axios.get("https://el-kindy-project-backend.onrender.com/salle");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);


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
      await axios.delete(`https://el-kindy-project-backend.onrender.com/salle/${classeId}`);
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

  useEffect(() => {
    // Appeler la fonction de tri lorsque sortOption change
    handleSort();
  }, [sortOption]);

  // Fonction pour trier les classes
const handleSort = () => {
  const sortedClasses = [...classes];
  if (sortOption === "asc") {
    sortedClasses.sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0);
  } else if (sortOption === "desc") {
    sortedClasses.sort((a, b) => (a.name && b.name) ? b.name.localeCompare(a.name) : 0);
  }
  setClasses(sortedClasses);
};


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
            {/* Title */}
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">class</h1>
                <Link to="/add-classe" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Ajouter une salle</Link>

              </div>
            </div>

            {/* Card START */}
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
                      />
                      <button
                        className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                        type="submit"
                      >
                        <i className="fas fa-search fs-6 " />
                      </button>
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
            <option value="asc">Ascendant</option>
            <option value="desc">Descendant</option>
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
    <th scope="col" className="border-0">Capcité</th>
    <th scope="col" className="border-0">Status</th> {/* Nouvelle colonne pour l'image */}
    <th scope="col" className="border-0 rounded-end">Action</th>
  </tr>
</thead>
<tbody>
  {classes.map((clas, index) => (
    <tr key={index}>
      <td>{clas.name}</td>
      <td>{clas.capacity}</td>
      <td>{clas.status}</td>

      
      <td>
        <Link to={`/edit-classe/${clas._id}`} className="btn btn-sm btn-dark me-1 mb-1 mb-md-0">
          Edit
        </Link>
        <button onClick={() => handleDeleteClasses(clas._id)} className="btn btn-sm btn-danger me-1 mb-1 mb-md-0">Delete</button>
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
              <div className="card-footer bg-transparent pt-0">
                {/* Pagination START */}
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                  {/* Content */}
                  <p className="mb-0 text-center text-sm-start">
                    Showing 1 to 8 of 20 entries
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












