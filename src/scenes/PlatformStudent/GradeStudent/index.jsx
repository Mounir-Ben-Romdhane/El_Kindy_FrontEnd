import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import NavBar from 'components/NavBar';
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import FooterClient from 'components/Footer';
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import NoData from 'components/NoData';

function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const [showCourses, setShowCourses] = useState({});
  const [showGrades, setShowGrades] = useState({});
  const [soloStudentGrade, setSoloStudentGrade] = useState({});
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const studentId = accessToken ? jwtDecode(accessToken).id : '';

  const fetchCourses = async (studentId) => {
    try {
      setOpen(true);
      const response = await axiosPrivate.get(`https://el-kindy-project-backend.onrender.com/auth/getCoursesByStudent/${studentId}`);
      setShowCourses((prevCourses) => ({ ...prevCourses, [studentId]: response.data }));
      setOpen(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setOpen(false);
    }
  };

  const fetchGrades = async (studentId, courseId) => {
    try {
      const response = await axiosPrivate.get(`https://el-kindy-project-backend.onrender.com/grades/getGradesByStudentAndCourse/${studentId}/${courseId}`);
      setShowGrades((prevGrades) => ({ ...prevGrades, [courseId]: response.data }));
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const toggleCourses = async (studentId) => {
    if (showCourses[studentId]) {
      setShowCourses((prevCourses) => ({ ...prevCourses, [studentId]: false }));
    } else {
      await fetchCourses(studentId);
    }
  };

  useEffect(() => {
    toggleCourses(studentId);
  }, [accessToken]);

  console.log("length", showCourses);

  useEffect(() => {
    console.log("showCourses:", showCourses);
    console.log("showGrades:", showGrades);
    // Fetch grades for each course
    Object.keys(showCourses).forEach((studentId) => {
      console.log("studentId:", studentId);
      const courses = showCourses[studentId];
      console.log("courses:", courses);
      if (Array.isArray(courses)) {
        courses.forEach((course) => {
          fetchGrades(studentId, course._id);
        });
      } else {
        console.error(`Invalid data for studentId ${studentId}: ${JSON.stringify(courses)}`);
      }
    });
  }, [showCourses]); // Update grades when showCourses changes

  return (
    <div>
      <NavBar />
      <TopBarTeacherStudent />

      <div className='container'>
        <div className="row">
          <SideBarStudent />
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
                    {Object.keys(showCourses).length === 0 || Object.values(showCourses).every(courses => courses.length === 0) ? (
                      <NoData />  ) : (
                    <div className="table-responsive border-0">
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        <tbody>
                          <tr>
                            <th>Course</th>
                            <th>Grade</th>
                          </tr>
                          {Object.keys(showCourses).map((studentId) => {
                            const courses = showCourses[studentId];
                            if (Array.isArray(courses)) {
                              return courses.map((course) => (
                                <tr key={course._id}>
                                  <td>{course.title}</td>
                                  <td>
                                    {showGrades[course._id] && showGrades[course._id].length > 0 ? (
                                      showGrades[course._id].map((grade) => (
                                        <span key={grade._id}>{grade.grade}</span>
                                      ))
                                    ) : (
                                      <span>Grade not available</span>
                                    )}
                                  </td>
                                </tr>
                              ));
                            } else {
                              console.error(`Invalid data for studentId ${studentId}: ${JSON.stringify(courses)}`);
                              return null; // Return null for invalid data
                            }
                          })}


                        </tbody>
                      </table>
                    </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

        <br />
        <br />
      <FooterClient />

    </div>
  );

}

export default Index;