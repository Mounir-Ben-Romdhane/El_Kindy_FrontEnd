import BannerStart from "components/BannerStart";
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { GridLoader } from "react-spinners";
import Backdrop from "@mui/material/Backdrop";

function EditEvent() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    dateDebut: "",
    dateFin: "",
    picturePath: "",
    timeFrom: "",
    timeTo: "",
    place: "",
  });

  const [formModified, setFormModified] = useState(false);
  const [imageName, setImageName] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  let [color, setColor] = useState("#399ebf");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
    const fetchEvent = async () => {
      try {
        const response = await axiosPrivate.get(
          `https://el-kindy-project-backend.onrender.com/event/events/${id}`
        );
        if (response.status === 200) {
          const eventData = response.data;
        setFormState({
          title: eventData.title,
          description: eventData.description,
          price: eventData.price,
          dateDebut: formatDate(eventData.dateDebut),
          dateFin: formatDate(eventData.dateFin),
          timeFrom: eventData.timeFrom,
          timeTo: eventData.timeTo,
          place: eventData.place,
          picturePath: eventData.picturePath,
        });
        setOpen(false);
        }

        
      } catch (error) {
        setOpen(false);
        console.error("Error Fetching Event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setImageName(selectedFile.name);
    setImageFile(selectedFile);

    event.target.parentElement.classList.remove("border-danger");

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
    setFormModified(true);
  };

   // Function to handle removing the image
   const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById("image").value = "";

    if (formState.picturePath === "") {
      // Update the error status for the picture field
      setErrors((prevErrors) => ({
        ...prevErrors,
        picture: "Please upload an image!",
      }));

      // Add red border if no image is selected after removal
      document
        .getElementById("image")
        .parentElement.classList.add("border-danger");
    }
    setFormModified(false);

  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    validateField(name, value);
    setFormModified(true); // Set form as modified when any field is changed
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        error = value.trim() === "" ? "Please enter a course title!" : "";
        break;
      case "description":
        error = value.trim() === "" ? "Please enter a short description!" : "";
        break;
      case "picture":
        error = value === null ? "Please upload an image!" : "";
        break;
      case "courseCategory":
        error = value === "" ? "Please select a course category!" : "";
        break;
      case "courseLevel": // Add validation for courseLevel
        error = value === "" ? "Please select a course level!" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validation
    const requiredFields = ["title", "description", "dateDebut", "dateFin", "timeFrom", "timeTo", "place"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formState[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("price", formState.price);
    formData.append("dateDebut", formatDate(formState.dateDebut));
    formData.append("dateFin", formatDate(formState.dateFin));
    formData.append("timeFrom", formState.timeFrom);
    formData.append("timeTo", formState.timeTo);
    formData.append("place", formState.place);
    if (imageFile) {
      formData.append("picture", imageFile);
      formData.append("picturePath", imageName);
    }

    try {
      setOpen2(true);
      const response = await axiosPrivate.patch(
        `event/update/${id}`,
        formData
      );
      if (response.status === 200) {
        setOpen2(false);
        toast.success("Event updated successfully !!", {
          autoClose: 1000,
          style: { color: "green" },
        });
        setTimeout(() => {
          navigate("/listEvents");
        }, 1500);
      } else {
        setOpen2(false);
        toast.error("Failed to update event");
      }
    } catch (error) {
      setOpen2(false);
      console.error("Error Updating Event:", error);
      toast.error("Failed to update event");
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
              title="Edit Event"
              description="Edit event details below"
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
                    <label className="form-label">Event Title</label>
                    <input
                      className={"form-control" + (errors.title ? " is-invalid" : "")}
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleEventChange}
                      placeholder="Enter Event title"
                     
                    />
                    <div className="invalid-feedback">{errors.title}</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Short Description</label>
                    <textarea
                      className={"form-control" + (errors.description ? " is-invalid" : "")}
                      name="description"
                      value={formState.description}
                      onChange={handleEventChange}
                      rows={2}
                      placeholder="Short description of the event"
                     
                    />
                    <div className="invalid-feedback">{errors.description}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      className={"form-control" + (errors.dateDebut ? " is-invalid" : "")}
                      type="date"
                      name="dateDebut"
                      value={formState.dateDebut}
                      onChange={handleEventChange}
                      required
                    />
                    <div className="invalid-feedback">{errors.dateDebut}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      className={"form-control" + (errors.dateFin ? " is-invalid" : "")}
                      type="date"
                      name="dateFin"
                      value={formState.dateFin}
                      onChange={handleEventChange}
                      required
                    />
                    <div className="invalid-feedback">{errors.dateFin}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Event Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formState.price}
                      onChange={handleEventChange}
                      placeholder={
                        formState.price ? "Enter Event Price" : "Free Event"
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Time From</label>
                    <input
                      type="time"
                      className={"form-control" + (errors.timeFrom ? " is-invalid" : "")}
                      name="timeFrom"
                      value={formState.timeFrom}
                      onChange={handleEventChange}
                    />
                    <div className="invalid-feedback">{errors.timeFrom}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Time To</label>
                    <input
                      type="time"
                      className={"form-control" + (errors.timeTo ? " is-invalid" : "")}
                      name="timeTo"
                      value={formState.timeTo}
                      onChange={handleEventChange}
                    />
                    <div className="invalid-feedback">{errors.timeTo}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Place</label>
                    <input
                      type="text"
                      value={formState.place}
                      className={"form-control" + (errors.place ? " is-invalid" : "")}
                      name="place"
                      placeholder="Enter event place"
                      onChange={handleEventChange}
                    />
                    <div className="invalid-feedback">{errors.place}</div>
                  </div>
                   {/* Upload image START */}
                   <div className="m-4">
                      {/* Image */}
                      <div className="col-12">
                        <div
                          className={`text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3 ${
                            errors.picture ? "border-danger" : ""
                          }`}
                        >
                          {/* Display the image */}
                          {imageFile ? (
                            <div>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded image"
                                className="img-fluid p-2 mb-2"
                                style={{
                                  maxWidth: "100%", // This makes the image responsive
                                      maxHeight: "300px",
                                      height: "auto", // Maintain aspect ratio
                                      width: "auto", // Allow width to scale with the height
                                      objectFit: "contain", // Ensures the image is scaled to maintain its aspect ratio while fitting within the frame
                                   }} // Limit image dimensions
                                required
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          ) : (
                            <div>
                              <img
                                src={`https://el-kindy-project-backend.onrender.com/assets/${formState.picturePath}`}
                                alt="Uploaded image"
                                className="img-fluid p-2 mb-2"
                                style={{
                                  maxWidth: "100%", // This makes the image responsive
                                  maxHeight: "300px",
                                  height: "auto", // Maintain aspect ratio
                                  width: "auto", // Allow width to scale with the height
                                  objectFit: "contain", // Ensures the image is scaled to maintain its aspect ratio while fitting within the frame
                               }} // Limit image dimensions
                                required
                              />
                              <p className="mb-0">{formState.picturePath}</p>
                            </div>
                          )}
                          {/* Upload image button */}
                          <div className="mb-3">
                            <h6 className="my-2">
                              Upload course image here, or{" "}
                              <span
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                              >
                                Browse
                              </span>
                            </h6>
                            {/* File input */}
                            <input
                              className="form-control"
                              type="file"
                              name="picture"
                              id="image"
                              accept="image/gif, image/jpeg, image/png"
                              onChange={handleImageSelect}
                            />
                            {/* Note */}
                            <p className="small mb-0 mt-2">
                              <b>Note:</b> Only JPG, JPEG, and PNG formats are
                              supported. Our suggested dimensions are 600px *
                              450px. Larger images will be cropped to fit our
                              thumbnails/previews.
                            </p>
                          </div>
                          {/* Remove image button */}
                          {imageName && (
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
                    disabled={!formModified} 
                    type="submit"
                    className="btn btn-success mb-2 mb-sm-0"
                  >
                    Update Event
                  </button>
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

export default EditEvent;