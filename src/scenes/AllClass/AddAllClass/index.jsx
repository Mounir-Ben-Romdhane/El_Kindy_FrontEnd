import BannerStart from 'components/BannerStart';
import SideBar from 'components/SideBar';
import TopBarBack from 'components/TopBarBack';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import useAxiosPrivate from 'hooks/useAxiosPrivate';

function Index() {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]); // State to hold selected courses
  const [orderError, setOrderError] = useState(''); // State to hold order error message
  const [errors, setErrors] = useState({}); // State to hold form errors
  const navigate = useNavigate();
  const [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const axiosPrivate = useAxiosPrivate();


  useEffect(() => {
    const fetchCourses = async () => {
      setOpen(true);  // Assuming setOpen manages a loading indicator

      try {
        const response = await axiosPrivate.get("/course/all");
        if (response.data && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
        }
        setOpen(false);  // Hide loading indicator on success
      } catch (error) {
        console.error("Error fetching courses:", error);
        setOpen(false);  // Hide loading indicator on failure
      }
    };

    fetchCourses();
}, [axiosPrivate]);  // Dependency on axiosPrivate to re-run if the instance


  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
    }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setOrderError(value.trim() ? '' : 'Order is required.');
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    values.preventDefault();
    const formData = new FormData(values.target);
    const formValues = Object.fromEntries(formData.entries());
    formValues.courses = selectedCourses; // Add selected courses to form data

    // Validation checks
    const errors = {};
    if (!formValues.className) {
      errors.className = 'Class Name is required.';
    }
    if (!formValues.capacity) {
      errors.capacity = 'Capacity is required.';
    }
    if (!formValues.ordre) {
      errors.ordre = 'Order is required.';
    }

    // Update the errors state
    setErrors(errors);
    //console.log(formValues)
    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      try {
        setOpen2(true);  // Show a loading indicator
        const savedClassesResponse = await axiosPrivate.post("/classes/create", formValues);
        const savedClasses = savedClassesResponse.data;
      
        if (savedClasses) {
          //console.log('Class added!', savedClasses);
          toast.success("Class added successfully !!", {
            autoClose: 1000,
            style: {
              color: 'green',
            },
          });
          setTimeout(() => {
            navigate('/ListAllClasse');  // Navigate after success
          }, 1500);
        } else {
          toast.error("Failed to add class", {  // Show error toast if response is falsy
            autoClose: 2000,
            style: {
              color: 'red',
            },
          });
        }
      } catch (error) {
        console.error("Error adding class:", error);
        toast.error("Error adding class", {
          autoClose: 2000,
          style: {
            color: 'red',
          },
        });
      } finally {
        setOpen2(false);  // Hide loading indicator regardless of the outcome
      }
      
    }
  };

  return (
    <div>
      <SideBar />
      <main>
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

              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
              <ToastContainer />
            <BannerStart
              title="Submit a new Class"
              description="Read our Before you create a class article before submitting!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <div className="">
                  <h2 className="p-2" style={{ color: "#1d3b53" }}>Class details</h2>
                </div>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="m-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label">Class Name</label>
                      <input className={`form-control ${errors.className ? 'is-invalid' : ''}`} name="className" type="text" placeholder="Enter name " onChange={handleChange} />
                      {errors.className && (
                        <div className="invalid-feedback">{errors.className}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="row g-xl-0 align-items-center">
                        <div className="col-lg-4">
                          <h6 className="mb-lg-0">
                            Courses Taught{' '}
                            <span className="text-danger">*</span>
                          </h6>
                        </div>
                        <div className="col-lg-8">
                          <div className="row row-cols-3">
                            {courses.map((course) => (
                              <div key={course._id} className="col">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={course._id}
                                    name="courses"
                                    value={course._id}
                                    onChange={handleCourseChange} // Handle checkbox change
                                  />
                                  <label className="form-check-label" htmlFor={course._id}>
                                    {course.title}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Capacity</label>
                      <input className={`form-control ${errors.capacity ? 'is-invalid' : ''}`} name="capacity" type="number" placeholder="Enter capacity " onChange={handleChange} />
                      {errors.capacity && (
                        <div className="invalid-feedback">{errors.capacity}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Order</label>
                      <input
                        className={`form-control ${errors.ordre ? 'is-invalid' : ''}`}
                        name="ordre"
                        type="number"
                        placeholder="Enter Order "
                        onChange={handleOrderChange} // Handle order input change
                      />
                      {orderError && <p style={{ color: 'red' }}>{orderError}</p>}
                    </div>
                  </div>
                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button href="course-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a Class</button>
                      <p className="mb-0 small mt-1">Once you click "Submit a category", your category will be uploaded and marked as pending for review.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
          </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
