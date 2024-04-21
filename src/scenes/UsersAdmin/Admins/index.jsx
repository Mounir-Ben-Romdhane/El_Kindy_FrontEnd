import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blockUser, getUsers, removeUser, unblockUser } from "services/usersService/api";
import AddUser from "../userCrud/addUser";
import UpdateUser from "../userCrud/updateUser";

function AdminsDashboard() {
  const [admins, setAdmins] = useState([]);
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false); // Close the update form when toggling the add form
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  }
  
  

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
    try {
      // Make API call to block user
      const response = await blockUser(userId);
  
      if (response.status === 200) {
        console.log('User blocked successfully!');
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error('Error blocking user:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      // Handle error here, e.g., show error message to the user
    }
  };
  
  const handleUnblockUser = async (userId) => {
    try {
      // Make API call to unblock user
      const response = await unblockUser(userId);
  
      if (response.status === 200) {
        console.log('User unblocked successfully!');
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error('Error unblocking user:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      // Handle error here, e.g., show error message to the user
    }
  };
  

  const fetchData = async () => {
    try {
      const response = await getUsers("admin");
      setAdmins(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Error fetching admins. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle user removal
  const handleRemoveUser = async (userId) => {
    try {
      // Call the removeUser function from your service
      await removeUser(userId);
      fetchData();
      close();
    } catch (error) {
      console.error("Error removing user:", error);
      // Handle errors as needed
    }
  };

  return (
    <div>
      <main>
        <SideBar />
        <div className="page-content">
          <TopBarBack />
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div className="page-content-wrapper border">
              <div className="row">
                <div className="col-12">
                  <h1 className="h2 mb-2 mb-sm-0">Admins list</h1>
                </div>
              </div>
              <div className="card bg-transparent">
                <div className="card-header bg-transparent border-bottom px-0">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-transparent"
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
                    <div className="col-md-4 text-end">
                      <button
                        className="btn btn-primary"
                        onClick={handleToggleForm}
                      >
                        Add New Admin
                      </button>
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
                        {admins.map((admin) => (
                          <div key={admin._id} className="col-md-6 col-xxl-4">
                            <div className="card bg-transparent border h-100">
                              <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                <div className="d-sm-flex align-items-center">
                                  <div className="avatar avatar-md flex-shrink-0">
                                    <img
                                      className="avatar-img rounded-circle"
                                      src={
                                        admin.picturePath ||
                                        "assets/images/element/02.jpg"
                                      }
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
                                      <a className="dropdown-item" href="#" onClick={() => handleToggleFormUpdate(admin)}>
                                        <span className="text-primary">
                                          <i className="bi bi-pencil-square fa-fw me-2" />
                                          Edit
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
                                          Remove
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
                                    <strong>Date of Birth:</strong>{" "}
                                    {admin.dateOfBirth
                                      ? new Date(
                                          admin.dateOfBirth
                                        ).toLocaleDateString()
                                      : "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-geo-alt me-2 text-primary" />
                                    <strong>Address:</strong> {admin.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-1">
                                    <i className="bi bi-gender-male me-2 text-primary" />
                                    <strong>Gender:</strong>{" "}
                                    {admin.gender || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary" />
                                    <strong>Phone Number:</strong>{" "}
                                    {admin.phoneNumber1 || "Not available"}
                                    
                                  </p>
                                  <p className="mb-1">
                                    {admin.blocked ? (
                                      <i className="bi bi-lock me-2 text-primary" />
                                    ) : (
                                      <i className="bi bi-check2-circle me-2 text-primary" />
                                    )}
                                    <strong>State:</strong>{" "}
                                    {admin.blocked ? (
                                      <span className="state-badge blocked">Blocked</span>
                                    ) : (
                                      <span className="state-badge">Active</span>
                                    )}
                                  </p>


                                </div>
                              </div>
                              {/* Card footer */}
                              <div className="card-footer bg-transparent border-top">
                                <div className="d-sm-flex justify-content-between align-items-center">
                                        
                                  {/* Rating star */}
                                  <h6 className="mb-2 mb-sm-0">
                                    <i className="bi bi-calendar fa-fw text-orange me-2" />
                                    <span className="text-body">Join at:</span>{" "}
                                    {new Date(
                                      admin.createdAt
                                    ).toLocaleDateString()}
                                  </h6>
                                  {/* Buttons */}
                                  <div className="text-end text-primary-hover">
                                      {/* Message button */}
                                      <a
                                        href="#"
                                        className="btn btn-link text-body p-0 mb-0 me-2"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Message"
                                        aria-label="Message"
                                      >
                                        <span className="text-primary">
                                          <i className="bi bi-envelope-fill me-1" />
                                        </span>
                                      </a>
                                      {/* Block/Unblock button */}
                                      {admin.blocked ? (
                                        <button
                                          className="btn btn-link text-body p-0 mb-0"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Unblock"
                                          aria-label="Unblock"
                                          onClick={() => handleUnblockUser(admin._id)}
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
                                          title="Block"
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
              </div>

              {/* Card footer START */}
              <div className="card-footer bg-transparent pt-0 px-0 mt-4">
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
                    <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
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
          )}

          {showForm && <AddUser onClose={close} fetchData={fetchData} />}

          {showFormUpdate && <UpdateUser user={admin} onClose={close} fetchData={fetchData} />}

        </div>

        
      </main>
    </div>
  );
}

export default AdminsDashboard;
