import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import AddTeacher from "../userCrud/addTeacher";
import UpdateTeacher from "../userCrud/updateTeacher";
import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";

function TeachersDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState({});

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleToggleMore = (teacherId) => {
    setTeacherDetails((prevState) => ({
      ...prevState,
      [teacherId]: !prevState[teacherId],
    }));
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false); // Close the update form when toggling the add form
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const handleToggleFormUpdate = (teacher) => {
    // If the update form is already shown, only change the teacher
    if (showFormUpdate) {
      setTeacher(teacher);
    } else {
      setTeacher(teacher);
      setShowFormUpdate(true);
      setShowForm(false); // Close the add form when toggling the update form
    }
  };

  const handleBlockTeacher = async (teacherId) => {
    try {
      // Make API call to block teacher
      const response = await blockUser(teacherId);

      if (response.status === 200) {
        console.log("Teacher blocked successfully!");
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error("Error blocking teacher:", response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error("Error blocking teacher:", error);
      // Handle error here, e.g., show error message to the user
    }
  };

  const handleUnblockTeacher = async (teacherId) => {
    try {
      // Make API call to unblock teacher
      const response = await unblockUser(teacherId);

      if (response.status === 200) {
        console.log("Teacher unblocked successfully!");
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error("Error unblocking teacher:", response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error("Error unblocking teacher:", error);
      // Handle error here, e.g., show error message to the user
    }
  };

  const fetchData = async () => {
    try {
      const response = await getUsers("teacher");
      setTeachers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Error fetching teachers. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle teacher removal
  const handleRemoveTeacher = async (teacherId) => {
    try {
      // Call the removeTeacher function from your service
      await removeUser(teacherId);
      fetchData();
      close();
    } catch (error) {
      console.error("Error removing teacher:", error);
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
                  <h1 className="h2 mb-2 mb-sm-0">Teachers list</h1>
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
                        Add New Teacher
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
                        {teachers.map((teacher) => (
                          <div key={teacher._id} className="col-md-6 col-xxl-4">
                            <div className="card bg-transparent border h-100">
                              <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                <div className="d-sm-flex align-items-center">
                                  <div className="avatar avatar-md flex-shrink-0">
                                    <img
                                      className="avatar-img rounded-circle"
                                      src={
                                        teacher.picturePath ||
                                        "assets/images/element/02.jpg"
                                      }
                                      alt="avatar"
                                    />
                                  </div>
                                  <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
                                    <h6 className="mb-0">
                                      {teacher.firstName} {teacher.lastName}
                                      {teacher.verified ? (
                                        <i className="bi bi-check-circle-fill text-success ms-2" />
                                      ) : (
                                        <i className="bi bi-exclamation-circle-fill text-warning ms-2" />
                                      )}
                                    </h6>
                                    <span className="text-body small">
                                      {teacher.email}
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
                                          handleToggleFormUpdate(teacher)
                                        }
                                      >
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
                                          handleRemoveTeacher(teacher._id)
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
                                    {teacher.dateOfBirth
                                      ? new Date(
                                          teacher.dateOfBirth
                                        ).toLocaleDateString()
                                      : "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-geo-alt me-2 text-primary" />
                                    <strong>Address:</strong> {teacher.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-1">
                                    <i className="bi bi-gender-male me-2 text-primary" />
                                    <strong>Gender:</strong>{" "}
                                    {teacher.gender || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary" />
                                    <strong>Phone Number:</strong>{" "}
                                    {teacher.phoneNumber1 || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    {teacher.blocked ? (
                                      <i className="bi bi-lock me-2 text-primary" />
                                    ) : (
                                      <i className="bi bi-check2-circle me-2 text-primary" />
                                    )}
                                    <strong>State:</strong>{" "}
                                    {teacher.blocked ? (
                                      <span className="state-badge blocked">
                                        Blocked
                                      </span>
                                    ) : (
                                      <span className="state-badge">
                                        Active
                                      </span>
                                    )}
                                  </p>
                                  <div className="teacher-more">
            <a
              className="p-0 mb-0 mt-2 btn-more d-flex align-items-center"
              onClick={() => handleToggleMore(teacher._id)}
            >
              {teacherDetails[teacher._id] ? (
                <>
                  See less{" "}
                  <i className="fas fa-angle-up ms-2" />
                </>
              ) : (
                <>
                  See{" "}
                  <span className="see-more ms-1">more</span>
                  <i className="fas fa-angle-down ms-2" />
                </>
              )}
            </a>
            {teacherDetails[teacher._id] && (
              <div className="m-1">
                {/* Display additional information for the teacher */}
                {/* Courses Taught */}
                <p className="mb-1">
                                          <i className="bi bi-journal-text me-2 text-primary" />{" "}
                                          {/* Icon for Courses Taught */}
                                          <strong>Courses Taught:</strong>{" "}
                                          {/* Heading for Courses Taught */}
                                          {/* Display coursesTaught */}
                                          {teacher.teacherInfo.coursesTaught
                                            .length > 0
                                            ? teacher.teacherInfo.coursesTaught.map(
                                                (course) => (
                                                  <span key={course._id}>
                                                    {course.title},{" "}
                                                  </span>
                                                )
                                              )
                                            : "None"}
                                        </p>
                                        {/* Classes Teaching */}
                                        <p className="mb-1">
                                          <i className="bi bi-people me-2 text-primary" />{" "}
                                          {/* Icon for Classes Teaching */}
                                          <strong>
                                            Classes Teaching:
                                          </strong>{" "}
                                          {/* Heading for Classes Teaching */}
                                          {/* Display classesTeaching */}
                                          {teacher.teacherInfo.classesTeaching
                                            .length > 0
                                            ? teacher.teacherInfo.classesTeaching.map(
                                                (classItem) => (
                                                  <span key={classItem._id}>
                                                    {classItem.className},{" "}
                                                  </span>
                                                )
                                              )
                                            : "None"}
                                        </p>
              </div>
            )}
          </div>
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
                                      teacher.createdAt
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
                                    {teacher.blocked ? (
                                      <button
                                        className="btn btn-link text-body p-0 mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Unblock"
                                        aria-label="Unblock"
                                        onClick={() =>
                                          handleUnblockTeacher(teacher._id)
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
                                        title="Block"
                                        aria-label="Block"
                                        onClick={() =>
                                          handleBlockTeacher(teacher._id)
                                        }
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

          {showForm && <AddTeacher onClose={close} fetchData={fetchData} />}

          {showFormUpdate && (
            <UpdateTeacher
              teacher={teacher}
              onClose={close}
              fetchData={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default TeachersDashboard;
