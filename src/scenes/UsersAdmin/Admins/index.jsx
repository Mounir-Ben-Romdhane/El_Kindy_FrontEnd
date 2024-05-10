import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";
import AddUser from "../userCrud/addUser";
import UpdateUser from "../userCrud/updateUser";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import UploadImageForm from "../../Azureimage/UploadImageForm";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useTranslation } from "react-i18next";
import withReactContent from "sweetalert2-react-content";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
const MySwal = withReactContent(Swal);

function AdminsDashboard() {
  const iconStyle = {
    marginRight: "10px",
  };

  const [admins, setAdmins] = useState([]);
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(6);
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const axiosPrivate = useAxiosPrivate();


  const accessToken = useSelector((state) => state.accessToken);

  const userToken = accessToken ? jwtDecode(accessToken) : "";



  const { t, i18n } = useTranslation();

  const handleToggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false); // Close the update form when toggling the add form
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const getAvatarSrc = (admin) => {
    if ( admin.picturePath !== "" && admin.authSource === "local") {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${admin.picturePath}`;
    } else if (admin && admin.picturePath === "" && admin.gender !== "") {
      // If user has no custom picture but has a gender
      return admin.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return admin.picturePath;
    }
  };

  const handleToggleFormUpdate = (admin) => {
    // If the update form is already shown, only change the teacher
    if (showFormUpdate) {
      setAdmin(admin);
    } else {
      setAdmin(admin);
      setShowFormUpdate(true);
      setShowForm(false); // Close the add form when toggling the update form
    }
  };

  const handleBlockUser = async (userId) => {
    MySwal.fire({
      title: t("confirm.block_title"),
      text: t("confirm.block_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm.yes_block"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpen2(true);
        try {
          const response = await blockUser(userId, axiosPrivate);
          if (response.status === 200) {
            setOpen2(false);

            MySwal.fire(
              t("confirm.blocked"),
              t("confirm.block_success"),
              "success"
            );
            fetchData(); // Reload data
          } else {
            setOpen2(false);
            throw new Error(response.data);
          }
        } catch (error) {
          setOpen2(false);
          console.error("Error blocking user:", error);
          MySwal.fire(t("confirm.error"), t("confirm.block_failure"), "error");
        }
      }
    });
  };

  const handleUnblockUser = async (userId) => {
    MySwal.fire({
      title: t("confirm.unblock_title"),
      text: t("confirm.unblock_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm.yes_unblock"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpen2(true);

        try {
          const response = await unblockUser(userId, axiosPrivate);
          if (response.status === 200) {
            setOpen2(false);
            MySwal.fire(
              t("confirm.unblocked"),
              t("confirm.unblock_success"),
              "success"
            );
            fetchData(); // Reload data
          } else {
            setOpen2(false);
            throw new Error(response.data);
          }
        } catch (error) {
          setOpen2(false);
          console.error("Error unblocking user:", error);
          MySwal.fire(
            t("confirm.error"),
            t("confirm.unblock_failure"),
            "error"
          );
        }
      }
    });
  };

  const fetchData = async () => {
    setOpen(true);

    try {
      const response = await getUsers("admin", axiosPrivate);
      // Filter out the current user from the list of admins
    const adminsExceptCurrentUser = response.data.data.filter(admin => admin._id !== userToken.id);

      // Set the admins state to the filtered list
      setAdmins(adminsExceptCurrentUser);
      //setAdmins(response.data.data);
      if (response.status === 200) {
        setOpen(false);
      } 
    } catch (error) {
      setError("Error fetching admins. Please try again later.");
      setLoading(false);
      setOpen(false);

      // Multilingual toast message
      toast.error(
        t("admins_dashboard.get_data_failed"), // Translation key for failed data retrieval
        {
          autoClose: 1500,
          style: { color: "red" },
        }
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle user removal
  const handleRemoveUser = async (userId) => {
    MySwal.fire({
      title: t("confirm.remove_title"),
      text: t("confirm.remove_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm.yes_remove"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpen2(true);
        try {
          const response = await removeUser(userId, axiosPrivate);
          if (response.status === 200) {
            setOpen2(false);
            MySwal.fire(
              t("confirm.removed"),
              t("confirm.remove_success"),
              "success"
            );
            fetchData(); // Reload data
          } else {
            setOpen2(false);
            throw new Error(response.data);
          }
        } catch (error) {
          setOpen2(false);
          console.error("Error removing user:", error);
          MySwal.fire(t("confirm.error"), t("confirm.remove_failure"), "error");
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) => {
    // Convert each field value to lowercase for case-insensitive search
    const lowerSearchQuery = searchQuery.toLowerCase();

    // Check if any field value contains the search query
    return Object.entries(admin).some(([key, value]) => {
      if (key === "dateOfBirth") {
        // If the field is the date of birth, format the date and check if it matches the search query
        const formattedDateOfBirth = value
          ? new Date(value).toLocaleDateString().toLowerCase()
          : "";
        return formattedDateOfBirth.includes(lowerSearchQuery);
      } else if (key === "blocked") {
        // If the field is the state (blocked or active), check if it matches the search query
        const stateString = value ? "blocked" : "active";
        return stateString.includes(lowerSearchQuery);
      } else {
        // For other fields, check if the value contains the search query
        return value
          ? value.toString().toLowerCase().includes(lowerSearchQuery)
          : false;
      }
    });
  });

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //export admins
  const djangoapi = "https://elkindy-django-1.onrender.com/insertdata/";
  const addAdmins = async () => {
    setOpen2(true);
    try {
      const response = await fetch(djangoapi); // Assuming your backend API is available at this endpoint

      if (response.status === 200) {
        toast.success(t("admins_dashboard.add_admin_success"), {
          autoClose: 1500,
          style: { color: "green" },
        });
        fetchData();
        setOpen2(false);
      } 
    } catch (error) {
      toast.error(t("admins_dashboard.add_admin_failure"), {
        autoClose: 1500,
        style: { color: "red" },
      });     
       setOpen2(false);
    }
  };

  const handleOpenSheets = () => {
    // URL of your Google Sheets document
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/1QoHnm1uRLN8VOrxTrkINykgG5xdCKRmPKthb3LBF5wI/edit#gid=0";

    // Open the Google Sheets document in a new tab
    window.open(googleSheetsUrl, "_blank");
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
            <h2>{error}</h2>
          ) : (
            <div className="page-content-wrapper border">
              {/* Backdrop with GridLoader */}
             
              <ToastContainer />

              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>

              <div className="row">
                <div className="col-12">
                  <h1 className="h2 mb-2 mb-sm-0">
                    {t("admins_dashboard.title")}
                  </h1>
                </div>
              </div>
              <div className="card bg-transparent">
                <div className="card-header bg-transparent border-bottom px-0">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-5">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-transparent"
                          type="search"
                          placeholder={t("admins_dashboard.search_placeholder")}
                          aria-label="Search"
                          value={searchQuery}
                          onChange={handleSearchChange}
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
                    <div className="col-md-7 d-flex justify-content-end align-items-center">
                      <button
                        className="btn btn-info btn-sm m-2 d-flex align-items-center text-wrap text-break"
                        onClick={addAdmins}
                        style={{
                          fontSize: "0.7rem", // Smaller font size
                          padding: "0.45rem 0.6rem", // Smaller padding
                        }}
                      >
                        <i
                          className="fas fa-file-import"
                          style={{ width: "1em", marginRight: "5px" }}
                        ></i>{" "}
                        <span className="d-none d-md-inline ms-1">
                          {t("admins_dashboard.import_admins")}
                        </span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm m-2 d-flex align-items-center text-wrap text-break"
                        variant="contained"
                        style={{
                          fontSize: "0.7rem", // Smaller font size
                          padding: "0.45rem 0.6rem", // Smaller padding
                        }}
                        color="primary"
                        onClick={handleToggleUploadPopup}
                      >
                        <i
                          className="fas fa-file-upload"
                          style={{ width: "1em", marginRight: "5px" }}
                        ></i>{" "}
                        <span className="d-none d-md-inline ms-1">
                          {t("admins_dashboard.upload_image")}
                        </span>
                      </button>

                      <button
                        className="btn btn-success btn-sm m-2 d-flex align-items-center text-wrap text-break"
                        onClick={handleOpenSheets}
                        style={{
                          fontSize: "0.7rem", // Smaller font size
                          padding: "0.45rem 0.6rem", // Smaller padding
                        }}
                      >
                        <i
                          className="fas fa-file-alt"
                          style={{ width: "1em", marginRight: "7px" }}
                        ></i>
                        <span className="d-none d-md-inline ms-1">
                          {t("admins_dashboard.open_google_sheets")}
                        </span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm m-2 d-flex align-items-center text-wrap text-break"
                        onClick={handleToggleForm}
                        style={{
                          fontSize: "0.7rem", // Smaller font size
                          padding: "0.45rem 0.6rem", // Smaller padding
                        }}
                      >
                        <i
                          className="fas fa-user"
                          style={{ width: "1em", marginRight: "7px" }}
                        ></i>
                        <span className="d-none d-md-inline ms-1">
                          {t("admins_dashboard.add_new_admin")}
                        </span>
                      </button>
                    </div>

                    <Dialog
                      open={showUploadPopup}
                      onClose={handleToggleUploadPopup}
                      aria-labelledby="form-dialog-title"
                      fullWidth={true}
                      maxWidth="sm"
                    >
                      <DialogTitle id="form-dialog-title">
                        Optical Character Recognition
                      </DialogTitle>
                      <DialogContent>
                        <UploadImageForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <div className="card-body px-0">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-preview-tab-1"
                  >
                    <div className="row g-4">
                      {currentAdmins.map((admin) => (
                        <div key={admin._id} className="col-md-6 col-xxl-4">
                          <div className="card bg-transparent border h-100">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                              <div className="d-sm-flex align-items-center">
                                <div className="avatar avatar-md flex-shrink-0">
                                  <img
                                    className="avatar-img rounded-circle"
                                    src={getAvatarSrc(admin)}
                                    alt="avatar"
                                  />
                                </div>
                                <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
                                  <h6 className="mb-0">
                                    {admin.firstName} {admin.lastName}
                                    {admin.verified ? (
                                      <i className="bi bi-check-circle-fill text-success ms-2" />
                                    ) : (
                                      <i className="bi bi-exclamation-circle-fill text-warning ms-2" />
                                    )}
                                  </h6>
                                  <span className="text-body small">
                                    {admin.email}
                                  </span>
                                </div>
                              </div>
                              <div className="dropdown text-end">
                                <a
                                  href="#"
                                  className="btn btn-sm btn-light btn-round small mb-0"
                                  role="button"
                                  id="dropdownShare2"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="bi bi-three-dots fa-fw" />
                                </a>
                                <ul
                                  className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded"
                                  aria-labelledby="dropdownShare2"
                                >
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleToggleFormUpdate(admin)
                                      }
                                    >
                                      <span className="text-primary">
                                        <i className="bi bi-pencil-square fa-fw me-2" />
                                        {t("admins_dashboard.edit")}
                                      </span>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleRemoveUser(admin._id)
                                      }
                                    >
                                      <span className="text-danger">
                                        <i className="bi bi-trash fa-fw me-2" />
                                        {t("admins_dashboard.remove")}
                                      </span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="card-body">
                              <div>
                                <p className="mb-1">
                                  <i className="bi bi-calendar-check me-2 text-primary" />
                                  <strong>
                                    {t("admins_dashboard.date_of_birth")}
                                  </strong>{" "}
                                  {admin.dateOfBirth
                                    ? new Date(
                                        admin.dateOfBirth
                                      ).toLocaleDateString()
                                    : "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-geo-alt me-2 text-primary" />
                                  <strong>
                                    {t("admins_dashboard.address")}
                                  </strong>{" "}
                                  {admin.address}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1">
                                  <i className="bi bi-gender-male me-2 text-primary" />
                                  <strong>
                                    {t("admins_dashboard.gender")}
                                  </strong>{" "}
                                  {admin.gender || "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-telephone me-2 text-primary" />
                                  <strong>
                                    {t("admins_dashboard.phone_number")}
                                  </strong>{" "}
                                  {admin.phoneNumber1 || "Not available"}
                                </p>
                                <p className="mb-1">
                                  {admin.blocked ? (
                                    <i className="bi bi-lock me-2 text-primary" />
                                  ) : (
                                    <i className="bi bi-check2-circle me-2 text-primary" />
                                  )}
                                  <strong>{t("admins_dashboard.state")}</strong>{" "}
                                  {admin.blocked ? (
                                    <span className="state-badge blocked">
                                      {t("admins_dashboard.blocked")}
                                    </span>
                                  ) : (
                                    <span className="state-badge">
                                      {t("admins_dashboard.active")}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {/* Card footer */}
                            <div className="card-footer bg-transparent border-top">
                              <div className="d-sm-flex justify-content-between align-items-center">
                                <h6 className="mb-2 mb-sm-0">
                                  <i className="bi bi-calendar fa-fw text-orange me-2" />
                                  <span className="text-body">
                                    {t("admins_dashboard.join_at")}
                                  </span>{" "}
                                  {new Date(
                                    admin.createdAt
                                  ).toLocaleDateString()}
                                </h6>
                                <div className="text-end text-primary-hover">
                                  <a
                                    href="#"
                                    className="btn btn-link text-body p-0 mb-0 me-2"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title={t("admins_dashboard.message")}
                                    aria-label="Message"
                                  >
                                    <span className="text-primary">
                                      <i className="bi bi-envelope-fill me-1" />
                                    </span>
                                  </a>
                                  {admin.blocked ? (
                                    <button
                                      className="btn btn-link text-body p-0 mb-0"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title={t("admins_dashboard.unblock")}
                                      aria-label="Unblock"
                                      onClick={() =>
                                        handleUnblockUser(admin._id)
                                      }
                                    >
                                      <span className="text-danger">
                                        <i className="bi bi-lock-fill me-1" />
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-link text-body p-0 mb-0"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title={t("admins_dashboard.block")}
                                      aria-label="Block"
                                      onClick={() => handleBlockUser(admin._id)}
                                    >
                                      <span className="text-danger">
                                        <i className="bi bi-unlock-fill me-1" />
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card footer START */}
              <div className="card-footer bg-transparent pt-0 px-0 mt-4">
                {/* Pagination START */}
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                  {/* Content */}
                  <p className="mb-0 text-center text-sm-start">
                    {t("teachers_dashboard.showing")} {indexOfFirstEntry + 1}{" "}
                    {t("teachers_dashboard.to")}{" "}
                    {Math.min(indexOfLastEntry, filteredAdmins.length)}{" "}
                    {t("teachers_dashboard.of")} {filteredAdmins.length}{" "}
                    {t("teachers_dashboard.entries")}
                  </p>
                  {/* Pagination */}
                  <nav
                    className="d-flex justify-content-center mb-0"
                    aria-label="navigation"
                  >
                    <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 && "disabled"
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#"
                          onClick={() => paginate(currentPage - 1)}
                          tabIndex={-1}
                        >
                          <i className="fas fa-angle-left" />
                        </a>
                      </li>
                      {Array.from(
                        {
                          length: Math.ceil(
                            filteredAdmins.length / entriesPerPage
                          ),
                        },
                        (_, i) => (
                          <li
                            key={i}
                            className={`page-item ${
                              currentPage === i + 1 && "active"
                            }`}
                          >
                            <a
                              className="page-link"
                              href="#"
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </a>
                          </li>
                        )
                      )}
                      <li
                        className={`page-item ${
                          currentPage ===
                            Math.ceil(filteredAdmins.length / entriesPerPage) &&
                          "disabled"
                        }`}
                      >
                        <a
                          className="page-link"
                          href="#"
                          onClick={() => paginate(currentPage + 1)}
                        >
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
          )}

          {showForm && <AddUser onClose={close} fetchData={fetchData} />}

          {showFormUpdate && (
            <UpdateUser user={admin} onClose={close} fetchData={fetchData} />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminsDashboard;
