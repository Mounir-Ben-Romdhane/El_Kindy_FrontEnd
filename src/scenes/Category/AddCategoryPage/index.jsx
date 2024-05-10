import BannerStart from "components/BannerStart";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GridLoader } from "react-spinners";
import Backdrop from "@mui/material/Backdrop";
import NoData from "components/NoData";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Index() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    picture: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  // Refresh token
  const axiosPrivate = useAxiosPrivate();

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, picture: selectedFile });
    
    // Remove red border when an image is selected
    event.target.parentElement.classList.remove("border-danger");
  
    // Check if a picture is selected and update the error status
    if (!selectedFile) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "",
      }));
    }
  };
  
  const handleRemoveImage = () => {
    setFormData({ ...formData, picture: null });
    document.getElementById("image").value = "";
  
    // Update the error status for the picture field
    setErrors((prevErrors) => ({
      ...prevErrors,
      picture: "Please upload an image!",
    }));
  
    // Add red border if no image is selected after removal
    document.getElementById("image").parentElement.classList.add("border-danger");
  };
  
  
  

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        error = value.trim() === "" ? "Please enter a category title!" : "";
        break;
      case "description":
        error = value.trim() === "" ? "Please enter a short description!" : "";
        break;
      case "picture":
        error = value === null ? "Please upload an image!" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const addCategory = async () => {
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Append picturePath to the form data
    formDataToSend.append('picturePath', formData.picture.name);
  
    try {
      setOpen2(true);
      const savedCategoryResponse = await axiosPrivate.post("/api/categories/add", formDataToSend);
      const savedCategory = savedCategoryResponse.data;
  
      if (savedCategory) {
        toast.success("Category added successfully!", {
          autoClose: 1500,
          style: {
            color: "green",
          },
        });
        setOpen2(false);
        setTimeout(() => {
          navigate("/listCategories");
        }, 2000);
      }
    } catch (error) {
      setOpen2(false);
      toast.error("Error adding category.", {
        autoClose: 1500,
        style: { color: "red" },
      });
      console.error("Error adding category:", error);
    }
  };
  
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Validate fields
    for (let [key, value] of Object.entries(formData)) {
      validateField(key, value);
    }
  
    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }
  
    // Check if an image is selected
    if (!formData.picture) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));
      // Add red border if no image is selected
      document.getElementById("image").parentElement.classList.add("border-danger");
      return;
    }
  
    await addCategory();
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
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
            <>
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
          <div className="page-content-wrapper border">
            <BannerStart
              title="Submit a new Category"
              description="Read our Before you create a category article before submitting!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <div className="">
                  <h2 className="p-2 " style={{ color: "#1d3b53" }}>
                    Category details
                  </h2>
                </div>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="m-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label">Category title {" "}
                                          <span className="text-danger">*</span></label>
                      <input
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        name="name"
                        type="text"
                        placeholder="Enter category title"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Short description {" "}
                                          <span className="text-danger">*</span></label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        rows={2}
                        placeholder="Enter keywords"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>

                    <div className="m-4">
                      <div className="col-12">
                        <div className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${errors.picture ? "border-danger" : ""}`}>
                          {formData.picture && (
                            <div>
                              <img
                                src={URL.createObjectURL(formData.picture)}
                                alt="Uploaded image"
                                className="img-fluid p-2 mb-2"
                                style={{
                                  maxWidth: "100%",  // This makes the image responsive
                                  maxHeight: "300px",
                                  height: "auto",     // Maintain aspect ratio
                                  width: "auto",      // Allow width to scale with the height
                                  objectFit: "contain" // Ensures the image is scaled to maintain its aspect ratio while fitting within the frame
                                
                                }}
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          )}
                          <div className="mb-3">
                            <h6 className="my-2">
                              Upload course image here, or{" "}
                              <span
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                              >
                                Browse {" "}
                                          <span className="text-danger">*</span>
                              </span>
                            </h6>
                            <input
                              className="form-control"
                              type="file"
                              name="picture"
                              id="image"
                              accept="image/gif, image/jpeg, image/png"
                              onChange={handleImageSelect}
                            />
                            <p className="small mb-0 mt-2">
                              <b>Note:</b> Only JPG, JPEG, and PNG formats are
                              supported. Our suggested dimensions are 600px *
                              450px. Larger images will be cropped to fit our
                              thumbnails/previews.
                            </p>
                          </div>
                          {formData.picture && (
                            <div className="d-sm-flex justify-content-end mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger-soft mb-3"
                                onClick={handleRemoveImage}
                              >
                                Remove image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button
                        className="btn btn-success mb-2 mb-sm-0"
                        type="submit"
                      >
                        Submit a Category
                      </button>
                      <p className="mb-0 small mt-1">
                        Once you click "Submit a category", your category will
                        be uploaded and marked as pending for review.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
