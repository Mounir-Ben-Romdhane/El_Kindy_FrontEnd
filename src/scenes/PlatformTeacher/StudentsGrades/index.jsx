import React, { useEffect, useState } from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import NavBar from "components/NavBar";
import axios from "api/axios";
import { jwtDecode } from "jwt-decode";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { useSelector } from "react-redux";
import Footer from 'components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const [courses, setCourses] = useState([]);
  const [showClasses, setShowClasses] = useState({});
  const [showStudents, setShowStudents] = useState({});
  const [showGrades, setShowGrades] = useState({});
  const [editingGrade, setEditingGrade] = useState(null);
  const [classesData, setClassesData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [soloStudentGrade, setSoloStudentGrade] = useState({});
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = accessToken ? jwtDecode(accessToken).id : "";
        setOpen(true)
        const response = await axios.get(`/auth/getCoursesTaughtByTeacher/${userId}`);
        setCourses(response.data);
        setOpen(false)
      } catch (error) {
        console.error('Error fetching courses:', error);
        setOpen(false)
      }
    };

    if (accessToken) {
      fetchCourses();
    }
  }, [accessToken]);


  const fetchClassesAndStudents = async (courseId, userId) => {
    try {
      const response = await axios.get(`/auth/getClassesAndStudentsNotEnrolledInClassByCourseAndTeacher/${courseId}/${userId}`);
      setClassesData([{ courseId, classes: response.data.classesTaught }]);
      setStudentsData([{ courseId, students: response.data.studentsEnrolled }]);

      const classes = response.data.classesTaught;
      const students = response.data.studentsEnrolled;

      // Fetch grades for each student
      const gradesPromises = students.map(async (student) => {
        try {
          const gradeResponse = await axios.get(`/grades/getGradeByStudentId/${student._id}`);
          return { studentId: student._id, grade: gradeResponse.data };
        } catch (error) {
          console.error('Error fetching grade for student:', student._id, error);
          return { studentId: student._id, grade: null };
        }
      });

      const grades = await Promise.all(gradesPromises);
      const gradesMap = {};
      grades.forEach((grade) => {
        gradesMap[grade.studentId] = grade.grade;
      });

      setSoloStudentGrade((prevGradesData) => {
        const updatedGradesData = {
          ...prevGradesData,
          ...gradesMap
        };
        console.log('soloStudentGrade', updatedGradesData);
        return updatedGradesData;
      });

      console.log('soloStudentGrade', soloStudentGrade);

    } catch (error) {
      console.error('Error fetching classes and students:', error);
    }
  };


  const fetchStudents = async (classId, courseId) => {
    try {
      const response = await axios.get(`/auth/getStudentsInClassByCourseAndClass/${classId}/${courseId}`);
      setShowStudents(prevStudents => ({
        ...prevStudents,
        [classId]: {
          ...prevStudents[classId],
          [courseId]: response.data
        }
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrades = async (courseId, classId) => {
    try {
      const response = await axios.get(`/grades/getGradesByCourseAndClass/${courseId}/${classId}`);
      setShowGrades(prevGrades => ({
        ...prevGrades,
        [courseId]: {
          ...prevGrades[courseId],
          [classId]: response.data
        }
      }));
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const affectGradeWithoutClass = async (studentId, courseId, grade) => {
    try {
      const response = await axios.post('/grades/affectGradeWithoutClass', { studentId, courseId, grade });
      await fetchGrades(courseId);
      setEditingGrade(null);
      // Update the state with the new grade
      setSoloStudentGrade(prevGradesData => ({
        ...prevGradesData,
        [studentId]: {
          ...prevGradesData[studentId],
          grade: grade // Update the grade for the specific student
        }

      })); window.location.reload();

    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };

  const affectGrade = async (studentId, courseId, grade, classId) => {
    try {
      const response = await axios.post('/grades/affectGrade', { studentId, courseId, grade, classId });
      await fetchGrades(courseId, classId);
      setEditingGrade(null);
    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };

  const toggleClasses = async (userId, courseId, studentId) => {
    // Close all currently open classes
    Object.keys(showClasses).forEach((key) => {
      setShowClasses((prevClasses) => ({ ...prevClasses, [key]: false }));
    });

    // Open the selected class
    if (!showClasses[courseId]) {
      await fetchClassesAndStudents(courseId, userId);
      setShowClasses((prevClasses) => ({ ...prevClasses, [courseId]: true }));
    }
  };


  const toggleStudents = async (userId, classId, courseId) => {
    if (!showStudents[classId] || !showStudents[classId][courseId]) {
      fetchStudents(classId, courseId);
      fetchGrades(courseId, classId);
      setShowStudents(prevStudents => ({
        ...prevStudents,
        [classId]: {
          ...prevStudents[classId],
          [courseId]: true
        }
      }));

    } else {
      setShowStudents(prevStudents => ({
        ...prevStudents,
        [classId]: {
          ...prevStudents[classId],
          [courseId]: false

        }

      }));
    }
  };

  const handleFormSubmit1 = async (e, studentId, courseId) => {
    e.preventDefault();
    try {
      await affectGradeWithoutClass(studentId, courseId, e.target.grade.value);
      // Update the state with the new grade after affecting it
      setSoloStudentGrade(prevGradesData => ({
        ...prevGradesData,
        [studentId]: {
          ...prevGradesData[studentId],
          grade: e.target.grade.value // Update the grade for the specific student
        }
      }));
      // Close the modal
      document.getElementById(`addGrade-${studentId}`).classList.remove('show');
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < modalBackdrops.length; i++) {
        modalBackdrops[i].parentNode.removeChild(modalBackdrops[i]);
      }
    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };

  const handleFormSubmit = async (e, studentId, courseId, classId) => {
    e.preventDefault();
    try {
      await affectGrade(studentId, courseId, e.target.grade.value, classId);
      document.getElementById('addQuestion').classList.remove('show');
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < modalBackdrops.length; i++) {
        modalBackdrops[i].parentNode.removeChild(modalBackdrops[i]);
      }
    } catch (error) {
      console.error('Error affecting grade:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
  
      <div className='container'>
        <div className="row">
          <SideBarTeacher />
          <div className="col-xl-9">
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
                {/* Backdrop with GridLoader */}
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open2}
                >
                  <GridLoader color={color} loading={loading} size={20} />
                </Backdrop>
                <div className="card border-2 bg-transparent rounded-3">
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="mb-0">Student Grade Dashboard</h3>
                    <div className="table-responsive border-0">
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        <thead>
                          <tr className='bg-blue'>
                            <th scope="col" className="border-0 rounded-start">Course Name</th>
                            <th scope="col" className="border-0">Show Classes and Students</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map((courseItem) => (
                            <tr key={courseItem._id}>
                              <td>{courseItem.title}</td>
                              <td>
                                <button className="btn btn-sm btn-success-soft btn-round me-1 mb-0 ml-3" onClick={() => toggleClasses(accessToken ? jwtDecode(accessToken).id : "", courseItem._id)}>
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="visually-hidden">
                                    {showClasses[courseItem._id] ? 'Hide Classes' : 'Show Classes'}
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {Object.keys(showClasses).map((courseId) => (
                      showClasses[courseId] && (
                        <div key={courseId}>
                          <table className="table table-dark-gray align-middle p-4 mb-0 table-hover mt-3">
                            <thead>
                              <tr className='bg-blue'>
                                <th>Class Name</th>
                                <th>Show Grades</th>
                                <th>Edit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classesData.map(({ courseId, classes }) => (
                                showClasses[courseId] && (
                                  <>
                                    {classes.map((classItem) => (
                                      <React.Fragment key={classItem._id}>
                                        <tr >
                                          <td>Class : {classItem.className}</td>
                                          <td>Show Students</td>
                                          <td>
                                            <button
                                              className="btn btn-sm btn-success-soft btn-round me-1 mb-0 ml-3"
                                              onClick={() => toggleStudents(accessToken ? jwtDecode(accessToken).id : "", classItem._id, courseId)}
                                            >
                                              <i className="fas fa-fw fa-eye"></i>
                                              <span className="visually-hidden">
                                                {showStudents[classItem._id] ? 'Hide Students' : 'Show Students'}
                                              </span>
                                            </button>
                                          </td>
                                        </tr>
                                        {showStudents[classItem._id] && showStudents[classItem._id][courseId] && (
                                          <tr>
                                            <td colSpan="4">
                                              {showStudents[classItem._id][courseId].length > 0 ? (
                                                <table className="table table-striped">
                                                  <thead>
                                                    <tr className='bg-blue'>
                                                      <th>First Name</th>
                                                      <th>Last Name</th>
                                                      <th>Semester Grade</th>
                                                      <th>Action</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {showStudents[classItem._id][courseId].map((student, index) => {
                                                      const grades = showGrades[courseId]?.[classItem._id]?.filter(grade => grade.student === student._id);
                                                      const grade = grades && grades.length > 0 ? grades[0].grade : 'N/A';
                                                      return (
                                                        <tr key={index}>
                                                          <td>{student.firstName}</td>
                                                          <td>{student.lastName}</td>
                                                          <td>
                                                            <span>{grade}</span>
                                                          </td>
                                                          <td>
                                                            <button
                                                              className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                                              data-bs-target={`#addQuestion-${student._id}`}
                                                              data-bs-toggle="modal"
                                                              onClick={() => {
                                                                if (editingGrade !== student._id) {
                                                                  setEditingGrade(student._id);
                                                                }
                                                              }}
                                                            >
                                                              <i className="far fa-fw fa-edit"></i>
                                                            </button>
                                                            <td> </td>
                                                            <div className="modal fade" id={`addQuestion-${student._id}`} tabIndex={-1} aria-labelledby={`addQuestionLabel-${student._id}`} aria-hidden="true" data-bs-backdrop="false">
                                                              <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                  <div className="modal-header bg-dark">
                                                                    <h5 className="modal-title text-white" id={`addQuestionLabel-${student._id}`}>Add Student Grade</h5>
                                                                    <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                                                                  </div>
                                                                  <div className="modal-body">
                                                                    <form className="row text-start g-3" onSubmit={(e) => handleFormSubmit(e, student._id, courseId, classItem._id)}>
                                                                      <div className="col-6">
                                                                        <h5>{student.lastName} {student.firstName}</h5>
                                                                      </div>
                                                                      <input className="form-control" name="studentId" type="hidden" value={student._id} />
                                                                      <input className="form-control" name="courseId" type="hidden" value={courseId} />
                                                                      <input className="form-control" name="classId" type="hidden" value={classItem._id} />
                                                                      <input type="text" name="grade" defaultValue={grade} />
                                                                      <div className="modal-footer">
                                                                        <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                                                                        <button className="btn btn-success my-0" type="submit">Add Student Grade</button>
                                                                      </div>
                                                                    </form>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              ) : (
                                                <div className="alert alert-info" role="alert">
                                                  No students enrolled in this class yet.
                                                </div>
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    ))}
  
                                    {studentsData.find(item => item.courseId === courseId)?.students.map((student) => {
                                      const grade = soloStudentGrade[student._id]?.[0]?.grade || 'N/A'; // Access grade using student ID as key
                                      return (
                                        <tr key={student._id}>
                                          <td>Individual Student : {student.firstName} {student.lastName}</td>
                                          <td>{grade}</td>
                                          <td>
                                            <button
                                              className="btn btn-sm btn-success-soft btn-round me-1 mb-0"
                                              data-bs-target={`#addGrade-${student._id}`}
                                              data-bs-toggle="modal"
                                              onClick={() => {
                                                if (editingGrade !== student._id) {
                                                  setEditingGrade(student._id);
                                                }
                                              }}
                                            >
                                              <i className="far fa-fw fa-edit"></i>
                                              <span className="visually-hidden"></span>
                                            </button>
                                            <div className="modal fade" id={`addGrade-${student._id}`} tabIndex={-1} aria-labelledby={`addQuestionLabel-${student._id}`} aria-hidden="true" data-bs-backdrop="false">
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header bg-blue">
                                                    <h5 className="modal-title text-white" id={`addQuestionLabel-${student._id}`}>Add Student Grade</h5>
                                                    <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                                                  </div>
                                                  <div className="modal-body">
                                                    <form className="row text-start g-3" onSubmit={(e) => handleFormSubmit1(e, student._id, courseId)}>
                                                      <div className="col-6">
                                                        <h5>{student.lastName} {student.firstName}</h5>
                                                      </div>
                                                      <input className="form-control" name="studentId" type="hidden" value={student._id} />
                                                      <input className="form-control" name="courseId" type="hidden" value={courseId} />
                                                      <input type="text" name="grade" defaultValue={grade} />
                                                      <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                                                        <button className="btn btn-success my-0" type="submit">Add Student Grade</button>
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
  
                                  </>
                                )
                              ))}
                            </tbody>
  
  
                          </table>
                        </div>
                      )
                    ))}
  
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
  
}

          export default Index;