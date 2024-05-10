import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";
import AddStudent from "../userCrud/addStudent";
import UpdateStudent from "../userCrud/updateStudent";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useTranslation } from "react-i18next";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import useAxiosPrivate from "hooks/useAxiosPrivate";
const MySwal = withReactContent(Swal);


function StudentsDashboard() {

  const iconStyle = {
    marginRight: "10px",
  };

  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const axiosPrivate = useAxiosPrivate();


  const { t, i18n } = useTranslation();


  const getAvatarSrc = (student) => {
    if ( student.picturePath !== "" && student.authSource === "local") {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${student.picturePath}`;
    } else if (student && student.picturePath === "" && student.gender !== "") {
      // If user has no custom picture but has a gender
      return student.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return student.picturePath;
    }
  };



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
          const response = await blockUser(studentId, axiosPrivate);
          if (response.status === 200) {
            MySwal.fire(
              t("confirm.blocked"),
              t("confirm.block_success"),
              "success"
            );
            fetchData();
            setOpen2(false);
          } else {
            throw new Error(response.data);
          }
        } catch (error) {
          console.error("Error blocking student:", error);
          MySwal.fire(
            t("confirm.error"),
            t("confirm.block_failure"),
            "error"
          );
          setOpen2(false);
        }
      }
    });
  };
  
  const handleUnblockStudent = async (studentId) => {
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
          const response = await unblockUser(studentId, axiosPrivate);
          if (response.status === 200) {
            MySwal.fire(
              t("confirm.unblocked"),
              t("confirm.unblock_success"),
              "success"
            );
            fetchData();
            setOpen2(false);
          } else {
            throw new Error(response.data);
          }
        } catch (error) {
          console.error("Error unblocking student:", error);
          MySwal.fire(
            t("confirm.error"),
            t("confirm.unblock_failure"),
            "error"
          );
          setOpen2(false);
        }
      }
    });
  };
  

  const fetchData = async () => {
    setOpen(true);

    try {
      const response = await getUsers("student", axiosPrivate);
      setStudents(response.data.data);
      if (response.status === 200) {
        setOpen(false);
      } else {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students. Please try again later.");
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

  const handleRemoveStudent = async (studentId) => {
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
          const response = await removeUser(studentId, axiosPrivate);
          if (response.status === 200) {
            MySwal.fire(
              t("confirm.removed"),
              t("confirm.remove_success"),
              "success"
            );
            fetchData();
            close();
            setOpen2(false);
          } else {
            throw new Error("Failed to remove student.");
          }
        } catch (error) {
          console.error("Error removing student:", error);
          MySwal.fire(
            t("confirm.error"),
            t("confirm.remove_failure"),
            "error"
          );
          setOpen2(false);
        }
      }
    });
  };
  

  // Search functionality
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when searching
  };

 

  const filteredStudents = students.filter((student) => {
    const lowerSearchQuery = searchTerm.toLowerCase();
  
    // Basic information check (similar to basic fields in TeachersDashboard)
    const matchesBasicInfo = (
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerSearchQuery) ||
      (student.email && student.email.toLowerCase().includes(lowerSearchQuery)) ||
      (student.address && student.address.toLowerCase().includes(lowerSearchQuery)) ||
      (student.phoneNumber1 && student.phoneNumber1.toLowerCase().includes(lowerSearchQuery)) ||
      (student.gender && student.gender.toLowerCase().includes(lowerSearchQuery)) ||
      (student.blocked && 'blocked'.includes(lowerSearchQuery)) ||
      (!student.blocked && 'active'.includes(lowerSearchQuery)) ||
      (student.dateOfBirth && new Date(student.dateOfBirth).toLocaleDateString().toLowerCase().includes(lowerSearchQuery))
    );
  
    // Nested objects and arrays
    const matchesClasses = student.studentInfo.classLevel && 
      student.studentInfo.classLevel.className.toLowerCase().includes(lowerSearchQuery);
  
    const matchesCoursesEnrolled = student.studentInfo.coursesEnrolled &&
      student.studentInfo.coursesEnrolled.some(course => course.title.toLowerCase().includes(lowerSearchQuery));
  
    const matchesParentDetails = (
      (student.studentInfo.parentName && student.studentInfo.parentName.toLowerCase().includes(lowerSearchQuery)) ||
      (student.studentInfo.parentEmail && student.studentInfo.parentEmail.toLowerCase().includes(lowerSearchQuery)) ||
      (student.studentInfo.parentPhone && student.studentInfo.parentPhone.toLowerCase().includes(lowerSearchQuery))
    );
  
    // Combine all match checks
    return matchesBasicInfo || matchesClasses || matchesCoursesEnrolled || matchesParentDetails;
  });
  

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //export admins
  const djangoapi = "https://elkindy-django-1.onrender.com/insertdata/students/";
  const addStudent = async () => {
    setOpen2(true);

    try {
      const response = await fetch(djangoapi); // Assuming your backend API is available at this endpoint
      if (response.status === 200) {
        toast.success(t("student_dashboard.add_students_success"), {
          autoClose: 1500,
          style: { color: "green" },
        });
        fetchData();
        setOpen2(false);

      } 
    } catch (error) {
      toast.error(t("student_dashboard.add_students_failure"), {
        autoClose: 1500,
        style: { color: "red" },
      });       setOpen2(false);

    }
  };

  const handleOpenSheets = () => {
    // URL of your Google Sheets document
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/1pRMgY4bmKN7Ruc3Dt9qjTiNSuEOF_0IGFtmKHoWJduc/edit#gid=0";

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
            <h2>Error: {error}</h2>
          ) : (
            <div className="page-content-wrapper border">
              {/* Backdrop with GridLoader */}
              <ToastContainer />

              <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open2}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
              <div className="row">
                <div className="col-12">
                  <h1 className="h2 mb-2 mb-sm-0">Students list</h1>
                </div>
              </div>
              <div className="card bg-transparent">
                <div className="card-header bg-transparent border-bottom px-0">
                  <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-6">
                      <form className="rounded position-relative">
                        <input
                          className="form-control bg-transparent"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        {searchTerm === "" && (
                          <button
                            className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                            onClick={(event) => event.preventDefault()}
                          >
                            <i className="fas fa-search fs-6 " />
                          </button>
                        )}
                      </form>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
  <button
    className="btn btn-info m-2 text-wrap text-break"
    onClick={addStudent}
    style={{
      fontSize: "0.7rem", // Smaller font size
      padding: "0.45rem 0.6rem", // Smaller padding
    }}
  >
    <i className="fas fa-file-import" style={{ width: "1em", marginRight: "5px" }}></i>
    <span className="d-none d-md-inline">
      Import Student
    </span>
  </button>

  <button
    className="btn btn-success m-2 text-wrap text-break"
    onClick={handleOpenSheets}
    style={{
      fontSize: "0.7rem", // Smaller font size
      padding: "0.45rem 0.6rem", // Smaller padding
    }}
  >
    <i className="fas fa-file-alt" style={{ width: "1em", marginRight: "7px" }}></i>
    <span className="d-none d-md-inline">
      Open Google Sheets
    </span>
  </button>

  <button
    className="btn btn-primary m-2 text-wrap text-break"
    onClick={handleToggleForm}
    style={{
      fontSize: "0.7rem", // Smaller font size
      padding: "0.45rem 0.6rem", // Smaller padding
    }}
  >
    <i className="fas fa-user" style={{ width: "1em", marginRight: "7px" }}></i>
    <span className="d-none d-md-inline">
      Add New Student
    </span>
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
                        {currentStudents.map((student) => (
                          <div
                            key={student._id}
                            className="col-md-6 col-xxl-4"
                          >
                            {/* Student card JSX */}
                            <div className="card bg-transparent border h-100">
                              <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                                <div className="d-sm-flex align-items-center">
                                  <div className="avatar avatar-md flex-shrink-0">
                                    <img
                                      className="avatar-img rounded-circle"
                                      src={getAvatarSrc(student)}
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
                    Showing {indexOfFirstStudent + 1} to{" "}
                    {Math.min(
                      indexOfLastStudent,
                      filteredStudents.length
                    )}{" "}
                    of {filteredStudents.length} entries
                  </p>
                  {/* Pagination */}
                  <nav
                    className="d-flex justify-content-center mb-0"
                    aria-label="navigation"
                  >
                    <ul className="pagination pagination-sm pagination-primary-soft mb-0 pb-0 px-0">
                      <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                        <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)} tabIndex={-1}>
                          <i className="fas fa-angle-left" />
                        </a>
                      </li>
                      {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                          <a className="page-link" href="#" onClick={() => paginate(i + 1)}>
                            {i + 1}
                          </a>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(filteredStudents.length / studentsPerPage) && 'disabled'}`}>
                        <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>
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