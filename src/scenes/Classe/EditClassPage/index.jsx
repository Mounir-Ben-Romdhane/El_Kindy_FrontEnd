import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import BannerStart from "components/BannerStart"; // If you have this component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import useAxiosPrivate from "hooks/useAxiosPrivate";

function ClassesForm() {
  const [formState, setFormState] = useState({
    name: "",
    capacity: "",
    status: "",
  });

  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formModified, setFormModified] = useState(false); // State variable to track form modification
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [errors, setErrors] = useState({});


  useEffect(() => {
    setOpen(true);
    const fetchClasseData = async () => {
      try {
        const response = await axiosPrivate.get(`/salle/${id}`);
        setFormState({
          name: response.data.name,
          capacity: response.data.capacity,
          status: response.data.status,
        });
        setOpen(false);
        // Assuming response.data has a imagePath attribute
      } catch (error) {
        setOpen(false);
        console.error("Failed to fetch class data:", error);
        setMessage("Failed to load class data.");
      }
    };

    if (id) fetchClasseData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `Please enter a ${name}.`,
    }));
    setFormModified(true); // Set form as modified when image is selected
  };

  const handleSubmit = async (event) => {
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
      setOpen(true);
      try {
        await axiosPrivate.put(`/salle/${id}`, formState);
  
        toast.success("Class edited successfully !!", {
          autoClose: 1000,
          style: {
            color: "green",
          },
        });
        setOpen(false);
        setTimeout(() => {
          navigate("/listClasse");
        }, 1500);
      } catch (error) {
        setOpen(false);
        console.error("Failed to update class:", error);
        setMessage("Failed to update Class. Please try again.");
      }
    }

    
  };

  return (
    <main>
      <SideBar />
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
          {/* Add your banner component if you have one */}
          <BannerStart
            title="Update Class"
            description="Make changes to your class details below."
          />
          <div className="card bg-transparent border rounded-3 mt-4">
            <div className="card-header bg-light border-bottom px-lg-3">
              <div className="">
                <h2 className="p-2 " style={{ color: "#1d3b53" }}>
                  Class details
                </h2>
              </div>
            </div>
            {message && (
              <div
                className={`alert ${
                  message.startsWith("Failed")
                    ? "alert-danger"
                    : "alert-success"
                }`}
              >
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div className="m-4">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="capacity" className="form-label">
                        Capacity
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.capacity ? "is-invalid" : ""
                        }`}
                        id="capacity"
                        name="capacity"
                        value={formState.capacity}
                        onChange={handleChange}
                      />
                      {errors.capacity && (
                          <div className="invalid-feedback">
                            {errors.capacity}
                          </div>
                        )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        required
                        value={formState.status}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                        {/* Ajoutez les autres choix ici en fonction de votre application */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="d-md-flex justify-content-end align-items-start mt-4 p-3">
                <div className="text-md-end">
                  <button
                    className="btn btn-success mb-2 mb-sm-0"
                    type="submit"
                    disabled={!formModified} // Disable button if form is not modified
                  >
                    Update Class
                  </button>
                  <p className="mb-0 small mt-1">
                    Once you click "Update Class", your changes will be saved.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ClassesForm;
