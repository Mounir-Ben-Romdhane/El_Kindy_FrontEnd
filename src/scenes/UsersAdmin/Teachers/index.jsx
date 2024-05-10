// Your modified code here
import React, { useEffect, useState } from "react";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import AddTeacher from "../userCrud/addTeacher";
import UpdateTeacher from "../userCrud/updateTeacher";
import { ToastContainer, toast } from "react-toastify";

import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

import {
  blockUser,
  getUsers,
  removeUser,
  unblockUser,
} from "services/usersService/api";
import GridLoader from "react-spinners/GridLoader";
import Backdrop from "@mui/material/Backdrop";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const MySwal = withReactContent(Swal);

function TeachersDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(6);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const axiosPrivate = useAxiosPrivate();


  const { t, i18n } = useTranslation();

  const iconStyle = {
    marginRight: "10px",
  };

  const getAvatarSrc = (teacher) => {
    if ( teacher.picturePath !== "" && teacher.authSource === "local") {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${teacher.picturePath}`;
    } else if (teacher && teacher.picturePath === "" && teacher.gender !== "") {
      // If user has no custom picture but has a gender
      return teacher.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return teacher.picturePath;
    }
  };

  const fetchData = async () => {
    setOpen(true);

    try {
      const response = await getUsers("teacher", axiosPrivate);
      setTeachers(response.data.data);
      if (response.status === 200) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Error fetching teachers. Please try again later.");
      setLoading(false);
      setOpen(false);
      // Multilingual toast message
      toast.error(
        t("teachers_dashboard.error_fetching"), // Translation key for failed data retrieval
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

  const handleToggleMore = (teacherId) => {
    setTeacherDetails((prevState) => ({
      ...prevState,
      [teacherId]: !prevState[teacherId],
    }));
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowFormUpdate(false);
  };

  const close = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const handleToggleFormUpdate = (teacher) => {
    setTeacher(teacher);
    setShowFormUpdate(true);
    setShowForm(false);
  };

  const handleBlockTeacher = async (teacherId) => {
    const result = await MySwal.fire({
      title: t("teachers_dashboard.confirm_block"),
      text: t("teachers_dashboard.block_teacher"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("teachers_dashboard.block_teacher"),
    });

    if (result.isConfirmed) {
      setOpen2(true);
      try {
        const response = await blockUser(teacherId, axiosPrivate);
        if (response.status === 200) {
          MySwal.fire(t("teachers_dashboard.teacher_blocked"), "", "success");
          fetchData();
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        console.error("Error blocking teacher:", error);
        MySwal.fire(t("teachers_dashboard.action_failed"), "", "error");
      }
      setOpen2(false);
    }
  };

  const handleUnblockTeacher = async (teacherId) => {
    const result = await MySwal.fire({
      title: t("teachers_dashboard.confirm_unblock"),
      text: t("teachers_dashboard.unblock_teacher"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("teachers_dashboard.unblock_teacher"),
    });

    if (result.isConfirmed) {
      setOpen2(true);
      try {
        const response = await unblockUser(teacherId, axiosPrivate);
        if (response.status === 200) {
          MySwal.fire(t("teachers_dashboard.teacher_unblocked"), "", "success");
          fetchData();
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        console.error("Error unblocking teacher:", error);
        MySwal.fire(t("teachers_dashboard.action_failed"), "", "error");
      }
      setOpen2(false);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    const result = await MySwal.fire({
      title: t("teachers_dashboard.confirm_delete"),
      text: t("teachers_dashboard.delete_teacher"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("teachers_dashboard.delete_teacher"),
    });

    if (result.isConfirmed) {
      setOpen2(true);
      try {
        const response = await removeUser(teacherId, axiosPrivate);
        if (response.status === 200) {
          MySwal.fire(t("teachers_dashboard.teacher_deleted"), "", "success");
          fetchData();
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        console.error("Error removing teacher:", error);
        MySwal.fire(t("teachers_dashboard.action_failed"), "", "error");
      }
      setOpen2(false);
      close();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    // Check basic fields
    const matchesBasicFields =
      `${teacher.firstName} ${teacher.lastName}`
        .toLowerCase()
        .includes(lowerSearchQuery) ||
      teacher.email.toLowerCase().includes(lowerSearchQuery) ||
      (teacher.address &&
        teacher.address.toLowerCase().includes(lowerSearchQuery)) ||
      (teacher.phoneNumber1 &&
        teacher.phoneNumber1.toLowerCase().includes(lowerSearchQuery)) ||
      (teacher.gender &&
        teacher.gender.toLowerCase().includes(lowerSearchQuery)) ||
      (teacher.blocked && "blocked".includes(lowerSearchQuery)) ||
      (!teacher.blocked && "active".includes(lowerSearchQuery)) ||
      (teacher.dateOfBirth &&
        new Date(teacher.dateOfBirth)
          .toLocaleDateString()
          .toLowerCase()
          .includes(lowerSearchQuery));

    // Check nested arrays
    const matchesCoursesTaught = teacher.teacherInfo.coursesTaught.some(
      (course) => course.title.toLowerCase().includes(lowerSearchQuery)
    );

    const matchesClassesTeaching = teacher.teacherInfo.classesTeaching.some(
      (classTeaching) =>
        classTeaching.className.toLowerCase().includes(lowerSearchQuery)
    );

    const matchesStudentsTaught = teacher.teacherInfo.studentsTaught.some(
      (student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(lowerSearchQuery)
    );

    // Combine checks
    return (
      matchesBasicFields ||
      matchesCoursesTaught ||
      matchesClassesTeaching ||
      matchesStudentsTaught
    );
  });

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //export admins
  const djangoapi = "https://elkindy-django-1.onrender.com/insertdata/teacher/";
  const addTeachers = async () => {
    setOpen2(true);

    try {
      const response = await fetch(djangoapi); // Assuming your backend API is available at this endpoint
      if (response.status === 200) {
        toast.success(t("teachers_dashboard.add_teacher_success"), {
          autoClose: 1500,
          style: { color: "green" },
        });
        fetchData();
        setOpen2(false);
      }
    } catch (error) {
      toast.error(t("teachers_dashboard.add_teacher_failure"), {
        autoClose: 1500,
        style: { color: "red" },
      });
      setOpen2(false);
    }
  };

  const handleOpenSheets = () => {
    // URL of your Google Sheets document
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/18maG021PnL_2ZaDc8A51ek3nORxYS-G5ItsCLfOvAnw/edit#gid=0";

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
                    {t("teachers_dashboard.title")}
                  </h1>
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
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {searchQuery === "" && (
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
                        onClick={addTeachers}
                        style={{
                          fontSize: "0.7rem", // Smaller font size
                          padding: "0.45rem 0.6rem", // Smaller padding
                        }}
                      >
                        <i
                          className="fas fa-file-import"
                          style={{ width: "1em", marginRight: "5px" }}
                        ></i>
                        <span className="d-none d-md-inline">
                          {t("teachers_dashboard.import_teachers")}
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
                        <i
                          className="fas fa-file-alt"
                          style={{ width: "1em", marginRight: "7px" }}
                        ></i>
                        <span className="d-none d-md-inline">
                          {t("teachers_dashboard.open_google_sheets")}
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
                        <i
                          className="fas fa-user"
                          style={{ width: "1em", marginRight: "7px" }}
                        ></i>
                        <span className="d-none d-md-inline">
                          {t("teachers_dashboard.add_new_teacher")}
                        </span>
                      </button>
                    </div>
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
                      {currentTeachers.map((teacher) => (
                        <div key={teacher._id} className="col-md-6 col-xxl-4">
                          <div className="card bg-transparent border h-100">
                            <div className="card-header bg-transparent border-bottom d-flex justify-content-between">
                              <div className="d-sm-flex align-items-center">
                                <div className="avatar avatar-md flex-shrink-0">
                                  <img
                                    className="avatar-img rounded-circle"
                                    src={getAvatarSrc(teacher)}
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
                                        {t("teachers_dashboard.edit")}
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
                                        {t("teachers_dashboard.remove")}
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
                                    {t("teachers_dashboard.date_of_birth")}
                                  </strong>{" "}
                                  {teacher.dateOfBirth
                                    ? new Date(
                                        teacher.dateOfBirth
                                      ).toLocaleDateString()
                                    : "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-geo-alt me-2 text-primary" />
                                  <strong>
                                    {t("teachers_dashboard.address")}
                                  </strong>{" "}
                                  {teacher.address}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1">
                                  <i className="bi bi-gender-male me-2 text-primary" />
                                  <strong>
                                    {t("teachers_dashboard.gender")}
                                  </strong>{" "}
                                  {teacher.gender || "Not available"}
                                </p>
                                <p className="mb-1">
                                  <i className="bi bi-telephone me-2 text-primary" />
                                  <strong>
                                    {t("teachers_dashboard.phone_number")}
                                  </strong>{" "}
                                  {teacher.phoneNumber1 || "Not available"}
                                </p>
                                <p className="mb-1">
                                  {teacher.blocked ? (
                                    <i className="bi bi-lock me-2 text-primary" />
                                  ) : (
                                    <i className="bi bi-check2-circle me-2 text-primary" />
                                  )}
                                  <strong>
                                    {t("teachers_dashboard.state")}
                                  </strong>{" "}
                                  {teacher.blocked ? (
                                    <span className="state-badge blocked">
                                      {t("teachers_dashboard.blocked")}
                                    </span>
                                  ) : (
                                    <span className="state-badge">
                                      {t("teachers_dashboard.active")}
                                    </span>
                                  )}
                                </p>
                                <div className="teacher-more">
                                  <a
                                    className="p-0 mb-0 mt-2 btn-more d-flex align-items-center"
                                    onClick={() =>
                                      handleToggleMore(teacher._id)
                                    }
                                  >
                                    {teacherDetails[teacher._id] ? (
                                      <>
                                        {t("teachers_dashboard.see_less")}{" "}
                                        <i className="fas fa-angle-up ms-2" />
                                      </>
                                    ) : (
                                      <>
                                        {t("teachers_dashboard.see_more")}{" "}
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
                                        <strong>
                                          {t(
                                            "teachers_dashboard.courses_taught"
                                          )}
                                        </strong>{" "}
                                        {/* Heading for Courses Taught */}
                                        {/* Display coursesTaught */}
                                        {teacher.teacherInfo.coursesTaught
                                          .length > 0
                                          ? teacher.teacherInfo.coursesTaught.map(
                                              (course, index) => (
                                                <React.Fragment
                                                  key={course._id}
                                                >
                                                  {course.title}
                                                  {index ===
                                                  teacher.teacherInfo
                                                    .coursesTaught.length -
                                                    1
                                                    ? "."
                                                    : ", "}
                                                </React.Fragment>
                                              )
                                            )
                                          : "None"}
                                      </p>

                                      {/* Classes Teaching */}
                                      <p className="mb-1">
                                        <i className="bi bi-people me-2 text-primary" />{" "}
                                        {/* Icon for Classes Teaching */}
                                        <strong>
                                          {t(
                                            "teachers_dashboard.classes_teaching"
                                          )}
                                        </strong>{" "}
                                        {/* Heading for Classes Teaching */}
                                        {/* Display classesTeaching */}
                                        {teacher.teacherInfo.classesTeaching
                                          .length > 0
                                          ? teacher.teacherInfo.classesTeaching.map(
                                              (classItem, index) => (
                                                <React.Fragment
                                                  key={classItem._id}
                                                >
                                                  {classItem.className}
                                                  {index ===
                                                  teacher.teacherInfo
                                                    .classesTeaching.length -
                                                    1
                                                    ? "."
                                                    : ", "}
                                                </React.Fragment>
                                              )
                                            )
                                          : "None"}
                                      </p>

                                      {/* Students Taught */}
                                      <p className="mb-1">
                                        <i className="bi bi-people me-2 text-primary" />{" "}
                                        {/* Icon for Students Taught */}
                                        <strong>
                                          {t(
                                            "teachers_dashboard.students_taught"
                                          )}
                                        </strong>{" "}
                                        {/* Heading for Students Taught */}
                                        {/* Display studentsTaught */}
                                        {teacher.teacherInfo.studentsTaught
                                          .length > 0
                                          ? teacher.teacherInfo.studentsTaught.map(
                                              (student, index) => (
                                                <React.Fragment
                                                  key={student._id}
                                                >
                                                  {student.firstName}{" "}
                                                  {student.lastName}
                                                  {index ===
                                                  teacher.teacherInfo
                                                    .studentsTaught.length -
                                                    1
                                                    ? "."
                                                    : ", "}
                                                </React.Fragment>
                                              )
                                            )
                                          : "None"}
                                      </p>
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
                                    <span className="text-body">
                                      {t("teachers_dashboard.join_at")}
                                    </span>{" "}
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
                    {t("teachers_dashboard.showing")} {indexOfFirstTeacher + 1}{" "}
                    {t("teachers_dashboard.to")}{" "}
                    {Math.min(indexOfLastTeacher, filteredTeachers.length)}{" "}
                    {t("teachers_dashboard.of")} {filteredTeachers.length}{" "}
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
                            filteredTeachers.length / teachersPerPage
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
                            Math.ceil(
                              filteredTeachers.length / teachersPerPage
                            ) && "disabled"
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
