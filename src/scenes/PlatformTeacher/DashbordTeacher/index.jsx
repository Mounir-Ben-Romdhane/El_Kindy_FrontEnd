import React, { useState, useEffect } from "react";
import SideBarTeacher from "components/SideBarTeacher";
import TopBarTeacherStudent from "components/TopBarTeacherStudent";
import NavBar from "components/NavBar";
import FooterClient from "components/FooterClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import Footer from "components/Footer";
import "../../../App.css";
import NoData from "components/NoData";
import welcomeTeacher from "./../../../components/welcomeTeacher";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";

function Index() {
  const [mostEnrolledCourse, setMostEnrolledCourse] = useState({
    courseId: "",
    courseTitle: "",
  });
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effect function to fetch most enrolled course data
    const fetchMostEnrolledCourse = async () => {
      setOpen(true);
      try {
        const response = await fetch(
          "https://el-kindy-project-backend.onrender.com/inscription/all/mostEnrolledCourse"
        );
        const data = await response.json();
        if (data.success) {
          setOpen(false);
          setMostEnrolledCourse({
            courseId: data.courseId,
            courseTitle: data.courseTitle,
          });
        } else {
          setOpen(false);
          console.error(
            "Failed to fetch most enrolled course data:",
            data.error
          );
        }
      } catch (error) {
        setOpen(false);
        console.error("Error fetching most enrolled course data:", error);
      }
    };

    fetchMostEnrolledCourse();
  }, []);

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <NavBar />
        <TopBarTeacherStudent />
        {/* =======================
                    Page content START */}

        <section className="pt-0">
          <div className="container">
            <div className="row">
              <SideBarTeacher />
              {/* Main content START */}
              <div className="col-xl-9">
                {open ? (
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={open}
                  >
                    <GridLoader color={color} loading={loading} size={20} />
                  </Backdrop>
                ) : error ? (
                  <h2>Error: {error}</h2>
                ) : (
                  <div className="card bg-transparent border-2 rounded-3">
                    {/* Counter boxes START */}
                    <div className="m-3">
                      {/* Counter item */}
                      <div className="col-sm-6 col-lg-4">
                        <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
                          <FontAwesomeIcon
                            icon={faBook}
                            className="display-6 text-warning mb-0"
                          />
                          <div className="ms-4">
                            <div className="d-flex">
                              <h5
                                className="purecounter mb-0 fw-bold"
                                data-purecounter-start={0}
                                data-purecounter-end={
                                  mostEnrolledCourse.courseTitle
                                }
                                data-purecounter-delay={200}
                              >
                                {mostEnrolledCourse.courseTitle}
                              </h5>
                            </div>
                            <div className="d-flex mt-2">
                              <span className="mb-0 h6 fw-light">
                                Most Enrolled Course
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Other Counter items */}
                    </div>
                    {/* Counter boxes END */}
                  </div>
                )}
              </div>
              {/* Main content END */}
            </div>
            {/* Row END */}
          </div>
        </section>

        {/* =======================
                    Page content END */}

        <Footer />
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;
