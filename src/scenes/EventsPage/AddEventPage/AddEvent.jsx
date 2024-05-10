import BannerStart from "components/BannerStart";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { GridLoader } from "react-spinners";
import Backdrop from "@mui/material/Backdrop";

function AddEvent() {
  const [isPaid, setIsPaid] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    timeFrom: "",
    timeTo: "",
    place: "",
    price : 0,
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

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
    document
      .getElementById("image")
      .parentElement.classList.add("border-danger");
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        error = value.trim() === "" ? "Please enter a course title !" : "";
        break;
      case "description":
        error = value.trim() === "" ? "Please enter a short description !" : "";
        break;
      case "picture":
        error = value === null ? "Please upload an image !" : "";
        break;
      case "dateDebut":
        error = value === "" ? "Please select a course category !" : "";
        break;
      case "dateFin":
        error = value === "" ? "Please select a course level !" : "";
        break;
      case "price":
        if(isPaid) {
          error = value === 0 || value === null || value < 0 ? "Please add a price !" : "";
          break;
        }
        break;
      case "place":
        error = value === "" ? "Please select a course category !" : "";
        break;
      case "timeFrom":
        error = value === "" ? "Please select a course level !" : "";
        break;
      case "timeTo":
        error = value === "" ? "Please select a course level !" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  //const dispatch = useDispatch();
  const navigate = useNavigate();

  const addEvent = async () => {
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    console.log("formData", formData);

    // Append picturePath to the form data
    formDataToSend.append("picturePath", formData.picture.name);

    try {
      setOpen2(true);

      const response = await axiosPrivate.post("/event/add", formDataToSend);
      //const savedCourse = response.data;
      //console.log("Event added!");
      //console.log("Course", savedCourse);
      // Show the toast notification with autoClose: false
      if(response.status === 201) {
        toast.success("Event added successfully !!", {
          autoClose: 1000,
          style: {
            color: "green", // Text color
          },
        });
        setOpen2(false);

        setTimeout(() => {
          navigate("/listEvents");
        }, 1500);
      }
      
    } catch (error) {
      setOpen2(false);

      console.error("Error adding course:", error);
      // Handle error
      toast.error("Failed to add course. Please try again.");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    values.preventDefault();

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
      document
        .getElementById("image")
        .parentElement.classList.add("border-danger");
      return;
    }
    await addEvent();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);  };


  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
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
              title="Submit a New Event"
              description="Submit new Event here!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <h2 className="p-2 " style={{ color: "#1d3b53" }}>
                  Event Details
                </h2>
              </div>
              <form onSubmit={handleFormSubmit} className="m-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">
                      Event Title <span className="text-danger">*</span>
                    </label>
                    <input
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      type="text"
                      name="title"
                      placeholder="Enter Event title"
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}{" "}
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Short Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      name="description"
                      rows={2}
                      placeholder="Short description of the event"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.description}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      className={
                        "form-control" + (errors.dateDebut ? " is-invalid" : "")
                      }
                      type="date"
                      name="dateDebut"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.dateDebut}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      className={
                        "form-control" + (errors.dateFin ? " is-invalid" : "")
                      }
                      type="date"
                      name="dateFin"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.dateFin}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Time From <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      className={
                        "form-control" + (errors.timeFrom ? " is-invalid" : "")
                      }
                      name="timeFrom"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.timeFrom}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Time To <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="time"
                      className={
                        "form-control" + (errors.timeTo ? " is-invalid" : "")
                      }
                      name="timeTo"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.timeTo}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Place <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={
                        "form-control" + (errors.place ? " is-invalid" : "")
                      }
                      name="place"
                      placeholder="Enter event place"
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.place}</div>
                  </div>
                  {/*  <div className="col-md-6">
                    <label className="form-label">Event Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="Enter event price"
                    />
                  </div> */}

                  <div className="col-md-6 event-price-container">
                    <label htmlFor="paidCheckbox" className="form-label">
                      Event Price <span className="text-danger">*</span>
                    </label>
                    <div className="price-toggle">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="paidCheckbox"
                        checked={isPaid}
                        onChange={() => {
                          setIsPaid(!isPaid);
                          setIsFree(false); // Uncheck the free option when paid is selected
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="paidCheckbox"
                      >
                        Paid
                      </label>
                    </div>
                    {isPaid && (
                      <div >
                      <input
                        type="number"
                        className={
                          "form-control price-input" + (errors.price ? " is-invalid" : "")
                        }
                        name="price"
                        onChange={handleChange}
                        placeholder="Enter event price"
                      />
                      <div className="invalid-feedback">{errors.price}</div>
                      </div>
                    )}


                    <div className="price-toggle mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="freeCheckbox"
                        checked={isFree}
                        onChange={() => {
                          setIsFree(!isFree);
                          setIsPaid(false); // Uncheck the paid option when free is selected
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="freeCheckbox"
                      >
                        Free
                      </label>
                    </div>
                  </div>
                  {/* Upload image START */}
                  {/* Upload image START */}
                  <div className="m-4">
                    <div className="col-12">
                      <div
                        className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${
                          errors.picture ? "border-danger" : ""
                        }`}
                      >
                        {formData.picture && (
                          <div>
                            <img
                              src={URL.createObjectURL(formData.picture)}
                              alt="Uploaded image"
                              className="img-fluid p-2 mb-2"
                              style={{
                                maxWidth: "100%", // This makes the image responsive
                                maxHeight: "300px",
                                height: "auto", // Maintain aspect ratio
                                width: "auto", // Allow width to scale with the height
                                objectFit: "contain", // Ensures the image is scaled to maintain its aspect ratio while fitting within the frame
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
                              Browse <span className="text-danger">*</span>
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
                  {/* Upload image END */}
                </div>
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <button
                    type="submit"
                    className="btn btn-success mb-2 mb-sm-0"
                  >
                    Submit Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddEvent;