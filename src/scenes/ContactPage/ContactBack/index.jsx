import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import "react-confirm-alert/src/react-confirm-alert.css"; // Importez les styles CSS
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import Swal from "sweetalert2"; // Importez SweetAlert2
import { Backdrop } from "@mui/material";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { GridLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
const MySwal = withReactContent(Swal);
function Index() {
  const [contacts, setContacts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");


  // pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page

  const { t, i18n } = useTranslation();

  const fetchContacts = async () => {
    setOpen(true);
    try {
      const response = await axiosPrivate.get(
        "https://el-kindy-project-backend.onrender.com/contact/get"
      );
      setContacts(response.data);
      setOpen(false);
    } catch (error) {
      setOpen(false);
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteContacts = (contactId) => {
    MySwal.fire({
      title: t("confirm.remove_title"),
      text: t("confirm.remove_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm.yes_remove"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContacts(contactId);
      }
    });
  };

  const deleteContacts = async (contactId) => {
    try {
      await axiosPrivate.delete(`https://el-kindy-project-backend.onrender.com/contact/${contactId}`);
      fetchContacts(); // Re-fetch categories to update the list after deletion
      MySwal.fire(t("confirm.removed"), t("confirm.remove_success"), "success");
    } catch (error) {
      console.error("Error deleting contact:", error);
      MySwal.fire(t("confirm.error"), t("confirm.remove_failure"), "error");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered and paginated contacts
  const filteredContacts = contacts.filter((contact) =>
    [
      contact.fullName.toLowerCase(),
      contact.email.toLowerCase(),
      contact.message.toLowerCase(),
    ].some((text) => text.includes(searchQuery.toLowerCase()))
  );

  const sortedContact = filteredContacts.sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "Oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = sortedContact.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  // Handle functions
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
            <div className="">
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
                {/* Title */}

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
                            onChange={handleSearchChange}
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
                        <option value="">Sort by</option>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                      </select>
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
                            <th scope="col" className="border-0 rounded-start">
                              Name
                            </th>
                            <th scope="col" className="border-0">
                              Email
                            </th>
                            <th scope="col" className="border-0">
                              Message
                            </th>{" "}
                            {/* Nouvelle colonne pour l'image */}
                            <th scope="col" className="border-0 rounded-end">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentContacts.map((clas, index) => (
                            <tr key={index}>
                              <td>{clas.fullName}</td>
                              <td>{clas.email}</td>
                              <td>{clas.message}</td>
                              <td>
                                <button
                                  onClick={() => handleDeleteContacts(clas._id)}
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
                  <div className="card-footer bg-transparent pt-0">
                    {/* Pagination START */}
                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                      {/* Content */}
                      <p className="mb-0 text-center text-sm-start">
                      Showing {indexOfFirstContact + 1} to{" "}
                      {Math.min(indexOfLastContact, filteredContacts.length)} of{" "}
                      {filteredContacts.length} entries
                    </p>
                      {/* Pagination */}
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
                                filteredContacts.length / itemsPerPage
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
                              Math.ceil(filteredContacts.length / itemsPerPage)
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
                                  filteredContacts.length / itemsPerPage
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
                {/* Card END */}
              </div>
              {/* Page main content END */}
            </div>
          )}
        </div>

        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;
