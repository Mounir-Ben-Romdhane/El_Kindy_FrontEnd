import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";

import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";
import AddStudent from "../userCrud/addStudent";
import UpdateStudent from "../userCrud/updateStudent";

function StudentsDashboard() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});

  const handleToggleMore = (studentId) => {
    setStudentDetails((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId],
    }));
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false); // Close the update form when toggling the add form
  };

  const handleToggleFormUpdate = (student) => {
    // If the update form is already shown, only change the student
    if (showFormUpdate) {
      setStudent(student);
    } else {
      setStudent(student);
      setShowFormUpdate(true);
      setShowForm(false); // Close the add form when toggling the update form
    }
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const handleBlockStudent = async (studentId) => {
    try {
      // Make API call to block student
      const response = await blockUser(studentId);

      if (response.status === 200) {
        console.log("Student blocked successfully!");
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error("Error blocking student:", response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error("Error blocking student:", error);
      // Handle error here, e.g., show error message to the user
    }
  };

  const handleUnblockStudent = async (studentId) => {
    try {
      // Make API call to unblock student
      const response = await unblockUser(studentId);

      if (response.status === 200) {
        console.log("Student unblocked successfully!");
        // Perform any additional actions if needed
        fetchData();
      } else {
        console.error("Error unblocking student:", response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error("Error unblocking student:", error);
      // Handle error here, e.g., show error message to the user
    }
  };

  const fetchData = async () => {
    try {
      const response = await getUsers("student");
      setStudents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle student removal
  const handleRemoveStudent = async (studentId) => {
    try {
      // Call the removeStudent function from your service
      await removeUser(studentId);
      fetchData();
      close();
    } catch (error) {
      console.error("Error removing student:", error);
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
                  <h1 className="h2 mb-2 mb-sm-0">Students list</h1>
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
                        Add New Student
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
                        {students.map((student) => (
                          <div key={student._id} className="col-md-6 col-xxl-4">
                            <div className="card bg-transparent border h-100">
                              <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                <div className="d-sm-flex align-items-center">
                                  <div className="avatar avatar-md flex-shrink-0">
                                    <img
                                      className="avatar-img rounded-circle"
                                      src={
                                        student.picturePath ||
                                        "assets/images/element/02.jpg"
                                      }
                                      alt="avatar"
                                    />
                                  </div>
                                  <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
                                    <h6 className="mb-0">
                                      {student.firstName} {student.lastName}
                                      {student.verified ? (
                                        <i className="bi bi-check-circle-fill text-success ms-2" />
                                      ) : (
                                        <i className="bi bi-exclamation-circle-fill text-warning ms-2" />
                                      )}
                                    </h6>
                                    <span className="text-body small">
                                      {student.email}
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
                                          handleToggleFormUpdate(student)
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
                                          handleRemoveStudent(student._id)
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
                                    {student.dateOfBirth
                                      ? new Date(
                                          student.dateOfBirth
                                        ).toLocaleDateString()
                                      : "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-geo-alt me-2 text-primary" />
                                    <strong>Address:</strong> {student.address}
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-1">
                                    <i className="bi bi-gender-male me-2 text-primary" />
                                    <strong>Gender:</strong>{" "}
                                    {student.gender || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary" />
                                    <strong>Phone Number:</strong>{" "}
                                    {student.phoneNumber1 || "Not available"}
                                  </p>
                                  <p className="mb-1">
                                    {student.blocked ? (
                                      <i className="bi bi-lock me-2 text-primary" />
                                    ) : (
                                      <i className="bi bi-check2-circle me-2 text-primary" />
                                    )}
                                    <strong>State:</strong>{" "}
                                    {student.blocked ? (
                                      <span className="state-badge blocked">
                                        Blocked
                                      </span>
                                    ) : (
                                      <span className="state-badge">
                                        Active
                                      </span>
                                    )}
                                  </p>

                                  {/* "See more" link */}
                                  <a
                                    className="p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                                    onClick={() =>
                                      handleToggleMore(student._id)
                                    }
                                  >
                                    {studentDetails[student._id] ? (
                                      <>
                                        See less{" "}
                                        <i className="fas fa-angle-up ms-2" />
                                      </>
                                    ) : (
                                      <>
                                        See{" "}
                                        <span className="see-more ms-1">
                                          more
                                        </span>
                                        <i className="fas fa-angle-down ms-2" />
                                      </>
                                    )}
                                  </a>
                                  {/* Additional information */}
                                  {studentDetails[student._id] && (
                                    <div className="m-1">
                                      {/* Classes */}
                                      <p className="mb-1">
                                        <i className="bi bi-people me-2 text-primary" />
                                        <strong>Classes:</strong>{" "}
                                        {student.studentInfo.classLevel
                                          ?.className ?? "Not available yet"}
                                      </p>
                                      {/* Courses Enrolled */}
                                      <p className="mb-1">
                                        <i className="bi bi-journal-text me-2 text-primary" />
                                        <strong>Courses Enrolled:</strong>{" "}
                                        {student.studentInfo.coursesEnrolled
                                          ?.length > 0
                                          ? student.studentInfo.coursesEnrolled.map(
                                              (course) => (
                                                <span key={course._id}>
                                                  {course.title},{" "}
                                                </span>
                                              )
                                            )
                                          : "None Courses"}
                                      </p>
                                      {/* Parent Information */}
                                      <p className="mb-1">
                                        <i className="bi bi-person me-2 text-primary" />
                                        <strong>Parent Name:</strong>{" "}
                                        {student.studentInfo.parentName
                                          ? student.studentInfo.parentName
                                          : "Not available"}
                                      </p>
                                      <p className="mb-1">
                                        <i className="bi bi-envelope me-2 text-primary" />
                                        <strong>Parent Email:</strong>{" "}
                                        {student.studentInfo.parentEmail
                                          ? student.studentInfo.parentEmail
                                          : "Not available"}
                                      </p>
                                      <p className="mb-1">
                                        <i className="bi bi-phone me-2 text-primary" />
                                        <strong>Parent Phone:</strong>{" "}
                                        {student.studentInfo.parentPhone
                                          ? student.studentInfo.parentPhone
                                          : "Not available"}
                                      </p>

                                      {/* Other additional information can go here */}
                                    </div>
                                  )}
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
                                      student.createdAt
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
                                    {student.blocked ? (
                                      <button
                                        className="btn btn-link text-body p-0 mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Unblock"
                                        aria-label="Unblock"
                                        onClick={() =>
                                          handleUnblockStudent(student._id)
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
                                          handleBlockStudent(student._id)
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

          {showForm && <AddStudent onClose={close} fetchData={fetchData} />}

          {showFormUpdate && (
            <UpdateStudent
              student={student}
              onClose={close}
              fetchData={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentsDashboard;
