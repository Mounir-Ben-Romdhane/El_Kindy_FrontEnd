import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "react-confirm-alert/src/react-confirm-alert.css";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import useAxiosPrivate from "hooks/useAxiosPrivate";

import { GridLoader } from "react-spinners";
import Backdrop from "@mui/material/Backdrop";
import NoData from "components/NoData";

const MySwal = withReactContent(Swal);

function Index() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page
  const axiosPrivate = useAxiosPrivate();
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const fetchCategories = async () => {
    setOpen(true);

    try {
      const response = await axiosPrivate.get("/api/categories");
      setCategories(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    MySwal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivate.delete(`/api/categories/${categoryId}`);
          setCategories((prev) =>
            prev.filter((category) => category._id !== categoryId)
          );
          MySwal.fire("Supprimé!", "La catégorie a été supprimée.", "success");
        } catch (error) {
          console.error("Error deleting category:", error);
          MySwal.fire(
            "Erreur!",
            "La catégorie n'a pas été supprimée.",
            "error"
          );
        }
      }
    });
  };

  const filteredAndSortedCategories = categories
    .filter(
      (category) =>
        !searchQuery ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOption === "Newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalItems = filteredAndSortedCategories.length;
  const totalPages = Math.ceil(totalItems / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredAndSortedCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* ************** MAIN CONTENT START ************** */}
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
            <>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>

              {/* Page main content START */}

              <div className="page-content-wrapper border">
                <div className="row mb-3">
                  <div className="col-12 d-sm-flex justify-content-between align-items-center">
                    <h1 className="h3 mb-2 mb-sm-0">Categories</h1>
                    <Link to="/add-category" className="btn btn-sm btn-primary">
                      Ajouter une catégorie
                    </Link>
                  </div>
                </div>
                {/* Render image and text if inscriptions array is empty */}
                {categories.length === 0 && <NoData />}
                {categories.length !== 0 && (
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
                              <th
                                scope="col"
                                className="border-0 rounded-start"
                              >
                                Category Name
                              </th>
                              <th scope="col" className="border-0">
                                Description
                              </th>
                              <th scope="col" className="border-0">
                                Image
                              </th>
                              <th scope="col" className="border-0 rounded-end">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map((category) => (
                              <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>
                                  {" "}
                                  {category.description
                                    .substring(0, 50)
                                    .match(/.{1,30}/g)
                                    .map((chunk, index, array) => (
                                      <React.Fragment key={index}>
                                        {chunk}
                                        {index === array.length - 1 &&
                                        category.description.length > 50
                                          ? "..."
                                          : ""}
                                        <br />
                                      </React.Fragment>
                                    ))}{" "}
                                </td>{" "}
                                <td>
                                  {category.picturePath ? (
                                    <img
                                      src={`https://el-kindy-project-backend.onrender.com/assets/${category.picturePath}`}
                                      alt="Category"
                                      style={{
                                        width: "130px",
                                        height: "110px",
                                        borderRadius: "15%",
                                      }}
                                    />
                                  ) : (
                                    <span>No Image</span>
                                  )}
                                </td>
                                <td>
                                  <Link
                                    to={`/edit-category/${category._id}`}
                                    className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0"
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </Link>
                                  <button
                                    onClick={() =>
                                      handleDeleteCategory(category._id)
                                    }
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
                            filteredAndSortedCategories.length
                          )}{" "}
                          of {filteredAndSortedCategories.length} entries
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
                                  filteredAndSortedCategories.length /
                                    entriesPerPage
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
                                  filteredAndSortedCategories.length /
                                    entriesPerPage
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
                                    filteredAndSortedCategories.length /
                                      entriesPerPage
                                  )
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

              {/* Page main content END */}
            </>
          )}
          {/* Page content END */}
        </div>
      </main>
    </div>
  );
}

export default Index;
