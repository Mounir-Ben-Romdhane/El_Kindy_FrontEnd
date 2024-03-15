import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importez les styles CSS
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import Swal from 'sweetalert2'; // Importez SweetAlert2
import useAxiosPrivate from "hooks/useAxiosPrivate";
const MySwal = withReactContent(Swal);

function Index() {
  const [categories, setCategories] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  /*
  useEffect(() => {
    // Fonction pour récupérer les catégories
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://el-kindy-project-backend.onrender.com/api/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data) {
          setCategories(data); // Stocke les catégories dans l'état
          console.log("categories", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);*/
  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("https://el-kindy-project-backend.onrender.com/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const handleDeleteCategory = (categoryId) => {
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
        deleteCategory(categoryId);
      }
    });
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`https://el-kindy-project-backend.onrender.com/api/categories/${categoryId}`);
      fetchCategories(); // Re-fetch categories to update the list after deletion
      MySwal.fire(
        'Supprimé!',
        'La catégorie a été supprimée.',
        'success'
      )
    } catch (error) {
      console.error("Error deleting category:", error);
      MySwal.fire(
        'Erreur!',
        "La catégorie n'a pas été supprimée.",
        'error'
      )
    }
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
                <h1 className="h3 mb-2 mb-sm-0">Categories</h1>
                <Link to="/add-category" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Ajouter une catégorie</Link>

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
    <th scope="col" className="border-0 rounded-start">Category Name</th>
    <th scope="col" className="border-0">Description</th>
    <th scope="col" className="border-0">Image</th> {/* Nouvelle colonne pour l'image */}
    <th scope="col" className="border-0 rounded-end">Action</th>
  </tr>
</thead>
<tbody>
  {categories.map((category, index) => (
    <tr key={index}>
      <td>{category.name}</td>
      <td>{category.description}</td>
      <td>
        {/* Affichage de l'image */}
        {category.picturePath ? (
        <img
        src={`https://el-kindy-project-backend.onrender.com/assets/${category.picturePath}`}
        alt="Category"
        style={{ width: '100px', height: 'auto' }} // Adjust size as needed
      />
      
        ) : (
          <span>No Image</span>
        )}
      </td>
      <td>
        <Link to={`/edit-category/${category._id}`} className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0">
            <i class="bi bi-pencil-square"></i>
        </Link>
        <button onClick={() => handleDeleteCategory(category._id)} 
        className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"><i class="bi bi-trash"></i></button>
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












