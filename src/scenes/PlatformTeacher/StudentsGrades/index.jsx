import React, { useEffect, useState } from 'react';
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import NavBar from "components/NavBar";
import axios from "api/axios";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import Footer from 'components/Footer';
import StudentGrades from '../../../components/StudentGrade'; // Import the new component
function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const [showStudents, setShowStudents] = useState(false);
  const [classes, setClasses] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = accessToken ? jwtDecode(accessToken).id : "";
        const response = await axios.get(`/classes/getClassesByTeacher/${userId}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [accessToken]);

  const fetchGrades = async () => {
    try {
      // Fetch grades for each student in all classes
      const gradePromises = classes.flatMap((classItem) =>
        classItem.students.map(async (student) => {
          try {
            const response = await axios.get(`/classes/getGrade/${student._id}`);
            console.log("fffffffffffffff",response.data);
            return { studentId: student._id, grade: response.data };
            
          } catch (error) {
            if (error.response && error.response.status === 404) {
              // Handle the case when grade is not found (404 error)
              console.error(`Grade not found for student ${student._id}`);
              return { studentId: student._id, grade: null };
            } else {
              throw error; // Rethrow other errors
            }
          }
        })
      );
  
      // Resolve all grade promises
      const grades = await Promise.all(gradePromises);
  
      // Update the studentGrades state with fetched grades
      const updatedStudentGrades = {};
      grades.forEach((gradeObj) => {
        updatedStudentGrades[gradeObj.studentId] = gradeObj.grade;
      });
      setStudentGrades(updatedStudentGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  useEffect(() => {
    if (showStudents) {
      fetchGrades(); // Fetch grades when showing students
    }
  }, [showStudents]);

  const toggleStudents = () => {
    setShowStudents(!showStudents);
  };

  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
      <div className="container">
        <div className="row">
          <SideBarTeacher />
          <div className="container col-md-9 mt-3">
            <div className="row">
              <h1>List of Classes</h1>
              {classes.map((classItem) => (
                <React.Fragment key={classItem._id}>
                  <table className="table table-striped">
                    {/* Your existing table header */}
                    <tbody>
                      <tr>
                        <td>{classItem.className}</td>
                        <td>{classItem.students.length}</td>
                        <td>{classItem.teachers.map((teacher) => teacher.firstName).join(", ")}</td>
                        <td>
                          <button onClick={toggleStudents}>Show Students</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {showStudents && (
 
 <table className="table">
    {/* Your existing table header */}
    <tbody>
      {classItem.students.map((student) => (
        <tr key={student._id}>
          <td>{student.firstName}</td>
          <td>{student.lastName}</td>
          {studentGrades[student._id] ? (
            studentGrades[student._id].map((gradeObj, index) => (
              <td key={index}>Grade: {gradeObj.grade}</td>
            ))
          ) : (
            <td>Grade not found</td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)}

                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;