import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

function Index() {
  const [shop, setShop] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShopss, setFilteredShopss] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const MySwal = withReactContent(Swal);
  let [color, setColor] = useState("#399ebf");

  useEffect(() => {
    const fetchData = async () => {
      setOpen(true);
      try {
        const response = await axiosPrivate.get("/shops/get");
        if (response.status === 200) {
          setShop(response.data);
          setOpen(false);
        } else {
          const errorMessage = response.statusText;
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        // Handle error
      }
    };

    fetchData();
  }, [axiosPrivate]);

  useEffect(() => {
    setFilteredShopss(
      shop.filter(
        (shops) =>
          shops.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (sortOption === "" ||
            shops.status === sortOption ||
            shops.etat === sortOption)
      )
    );
  }, [shop, searchQuery, sortOption]);

  const sortedShop = filteredShopss.sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.name.localeCompare(b.name);
      case "Z-A":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  const handleDelete = async (id) => {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this shop!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivate.delete(`/shops/${id}`);
          setShop((prevShops) => prevShops.filter((shop) => shop._id !== id));
          Swal.fire("Deleted!", "Shop has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting shop:", error);
          Swal.fire("Failed!", "Failed to delete the shop.", "error");
        }
      }
    });
  };

  const handleSold = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this instrument as sold?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark it!",
    }).then(async (result) => {
      
      if (result.isConfirmed) {
        try {
          const response = await axiosPrivate.put(`/shops/${id}`, { etat: "sold" });
          if(response.status === 200){

            setShop((prevShops) =>
              prevShops.map((shop) =>
                shop._id === id ? { ...shop, etat: "sold" } : shop
              )
            );
            Swal.fire("Marked as Sold!", "The instrument has been marked as sold.", "success");
          }
        } catch (error) {
          console.error("Error marking instrument as sold:", error);
          Swal.fire("Failed!", "Failed to mark the instrument as sold.", "error");
        }
      }
    });
  };
  

  const handleUnsold = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this instrument as unsold?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unmark it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPrivate.put(`/shops/${id}`, { etat: "unsold" });
          if(response.status === 200) {
            setShop((prevShops) =>
              prevShops.map((shop) =>
                shop._id === id ? { ...shop, etat: "unsold" } : shop
              )
            );
            Swal.fire("Marked as Unsold!", "The instrument has been marked as unsold.", "success");
          
          }
          } catch (error) {
          console.error("Error marking instrument as unsold:", error);
          Swal.fire("Failed!", "Failed to mark the instrument as unsold.", "error");
        }
      }
    });
  };
  


  const indexOfLastShops = currentPage * itemsPerPage;
  const indexOfFirstShops = indexOfLastShops - itemsPerPage;
  const currentShopss = sortedShop.slice(indexOfFirstShops, indexOfLastShops);

  const totalShopss = sortedShop.length;
  const totalPages = Math.ceil(totalShopss / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />
          {open ? (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div className="page-content-wrapper border">
              <ToastContainer />
              {/* Title */}
              <div className="row mb-3">
                <div className="col-12 d-sm-flex justify-content-between align-items-center">
                  <h1 className="h3 mb-2 mb-sm-0">Instruments</h1>
                </div>
              </div>

              {/* Render text if courses array is empty */}
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
                      {/* Short by filter */}
                      <form>
                        {/* Sorting dropdown */}
                        <select
                          className="form-select  border-0 z-index-9"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="">Sort by</option>
                          <option value="accepted">Accepted</option>
                          <option value="pending">Pending</option>
                          <option value="refused">Rejected</option>
                          <option value="sold">Sold</option>
                          <option value="unsold">Unsold</option>

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
                  {/* Course table START */}
                  <div className="table-responsive border-0 rounded-3">
                    {/* Table START */}
                    <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                      {/* Table head */}
                      <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            Instrument Name
                          </th>
                          <th scope="col" className="border-0">
                            Brand
                          </th>
                          <th scope="col" className="border-0">
                            Price
                          </th>
                          <th scope="col" className="border-0">
                            Status
                          </th>
                          <th scope="col" className="border-0">
                            etat
                          </th>
                          <th scope="col" className="border-0 rounded-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {/* Table body START */}
                      <tbody style={{ whiteSpace: "nowrap" }}>
                        {/* Table row */}
                        {shop && shop.length > 0 ? (
                          sortedShop.map((shop) => (
                            <tr key={shop._id}>
                              <td>{shop.name}</td>
                              <td>{shop.marque}</td>
                              <td>{shop.price}</td>
                              <td>
                                {shop.status === "pending" && (
                                  <span className="badge bg-warning bg-opacity-15 text-warning">
                                    Pending
                                  </span>
                                )}
                                {shop.status === "accepted" && (
                                  <span className="badge bg-success bg-opacity-15 text-success">
                                    Accepted
                                  </span>
                                )}
                                {shop.status === "refused" && (
                                  <span className="badge bg-danger bg-opacity-15 text-danger">
                                    Refused
                                  </span>
                                )}
                              </td>
                              <td>
                                {shop.etat === "unsold" && (
                                  <span className="badge bg-info bg-opacity-15 text-info">
                                    Unsold
                                  </span>
                                )}
                                {shop.etat === "sold" && (
                                  <span className="badge bg-danger bg-opacity-15 text-danger">
                                    Sold
                                  </span>
                                )}
                              </td>
                              <td>
                                <Link
                                  to={`/BackDetailsShop/${shop._id}`}
                                  className="btn btn-info-soft btn-round mb-1 me-1 mb-md-0"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>

                                {shop.etat === "unsold" && (
                                  <button
                                    className="btn btn-success-soft btn-round  me-1 mb-1 mb-md-0" // Use outline-success for a green-themed button
                                    onClick={() => handleSold(shop._id)}
                                    title="Mark as Sold" // Tooltip for clarity
                                  >
                                    <FontAwesomeIcon icon={faCheckCircle} />{" "}
                                    {/* Green check icon for visual indication */}
                                  </button>
                                )}
                                {shop.etat === "sold" && (
                                  <button
                                    className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0" // Use outline-danger for a red-themed button
                                    onClick={() => handleUnsold(shop._id)}
                                    title="Mark as Unsold" // Tooltip for clarity
                                  >
                                    <FontAwesomeIcon icon={faTimesCircle} />{" "}
                                    {/* Red times icon for visual indication */}
                                  </button>
                                )}
                                <button
                                  className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title=""
                                  data-bs-original-title="Delete"
                                  onClick={() => handleDelete(shop._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5"> No data available </td>
                          </tr>
                        )}
                      </tbody>
                      {/* Table body END */}
                    </table>
                    {/* Table END */}
                  </div>
                  {/* Course table END */}
                </div>
                {/* Card body END */}
                {/* Card ffooter START */}
                <div className="card-footer bg-transparent pt-0">
                  {/* Pagination START */}
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstShops + 1} to{" "}
                      {Math.min(indexOfLastShops, filteredShopss.length)} of{" "}
                      {filteredShopss.length} entries
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
                              filteredShopss.length / itemsPerPage
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
                            Math.ceil(filteredShopss.length / itemsPerPage)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredShopss.length / itemsPerPage)
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
              {/* Card END */}
            </div>
          )}
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* ************** MAIN CONTENT END ************** */}
    </div>
  );
}

export default Index;
