import BannerStart from "components/BannerStart";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import { Link, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import useAxiosPrivate from "hooks/useAxiosPrivate";

function Index() {
  const [dataTheme, setDataTheme] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const addClasses = async (values) => {
    setOpen(true); // Assuming there's a state to control a loading modal or indicator
    try {
      const response = await axiosPrivate.post("/salle", values);
      const savedClasses = response.data;
      setOpen(false); // Close the loading indicator

      if (savedClasses.success) {
        toast.success("Class added successfully !!", {
          autoClose: 1000,
          style: { color: "green" },
        });
        setTimeout(() => {
          navigate("/listClasse");
        }, 1500);
      } else {
        toast.error(`Error: ${savedClasses.error}`, {
          autoClose: 5000,
          style: { color: "red" },
        });
      }
    } catch (error) {
      setOpen(false); // Ensure loading indicator is closed on error as well
      console.error("Error adding class:", error);
      toast.error("Failed to add class. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `Please enter a ${name}.`,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    // Validation checks
    const errors = {};
    if (!formValues.name) {
      errors.name = "Please enter a class name.";
    }
    if (!formValues.capacity) {
      errors.capacity = "Please enter a class capacity.";
    }
    if (!formValues.status) {
      errors.status = "Please select a class status.";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      await addClasses(formValues);
    }
  };

  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <GridLoader color={color} loading={loading} size={20} />
          </Backdrop>
          <ToastContainer />
          <div className="page-content-wrapper border">
            <BannerStart
              title="Submit a new Class"
              description="Read our Before you create a class article before submitting!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <div className="">
                  <h2
                    className="p-2"
                    style={{
                      color: dataTheme === "dark" ? "#2B6DA2" : "#1d3b53",
                    }}
                  >
                    Class details
                  </h2>
                </div>
              </div>
              <div>
                <form onSubmit={handleFormSubmit}>
                  <div className="m-4">
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label">Name</label>
                        <input
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          name="name"
                          type="text"
                          placeholder="Enter number class"
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Capacity</label>
                        <input
                          className={`form-control ${
                            errors.capacity ? "is-invalid" : ""
                          }`}
                          name="capacity"
                          type="text"
                          placeholder="Enter capacity class"
                          onChange={handleInputChange}
                        />
                        {errors.capacity && (
                          <div className="invalid-feedback">
                            {errors.capacity}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Class status</label>
                        <select
                          name="status"
                          className={`form-select ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          aria-label=".form-select-sm"
                          data-search-enabled="true"
                          onChange={handleInputChange}
                        >
                          <option value="">Select Status</option>
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        {errors.status && (
                          <div className="invalid-feedback">
                            {errors.status}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-md-flex justify-content-end align-items-start mt-4">
                      <div className="text-md-end">
                        <button
                          className="btn btn-success mb-2 mb-sm-0"
                          type="submit"
                        >
                          Submit a Class
                        </button>
                        <p className="mb-0 small mt-1">
                          Once you click "Submit a Class", your Class will be
                          uploaded and marked as pending for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
