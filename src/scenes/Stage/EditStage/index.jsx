import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setLogout } from "../../../state";
import refreshToken from "scenes/Authentification/TokenService/tokenService";

function EditStage() {

  const [dataTheme, setDataTheme] = useState('');
  const [stage, setstage] = useState({
    title: "",
    description: "",
    picturePath: "",
    startDate: "",
    finishDate: ""
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://el-kindy-project-backend.onrender.com/stage/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setstage(data);
        } else if (response.status === 401 || response.status === 403) {
          // Refresh access token
          const newAccessToken = await refreshToken(refreshTokenState, dispatch);
          if (newAccessToken) {
            // Retry fetching stages with the new access token
            dispatch(setAccessToken({ accessToken: newAccessToken }));
            //fetchData();
            console.log("newAccessToken : ", newAccessToken);
          } else {
            console.error("Failed to refresh access token.");
            dispatch(setLogout()); // Log out user if token refresh fails
          }
        } else {
          const errorMessage = await response.text();
          //dispatch(setLogout()); // Log out user if token refresh fails
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        // Handle error
      }
    };

    if (id) fetchData();
  }, [accessToken, dispatch, id]);


  // State to hold the image name
  const [imageName, setImageName] = useState(null);
  // State to hold the image file
  const [imageFile, setImageFile] = useState(null);

  // Function to handle selecting an image
  const handleImageSelect = (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];
    // Set the image name
    setImageName(selectedFile.name);
    // Set the image file
    setImageFile(selectedFile);
  };

  // Function to handle removing the image
  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById('image').value = '';
  };

  //const dispatch = useDispatch();
  const navigate = useNavigate();


  const updateStage = async (values, onSubmitProps) => {
    console.log("values", values);
    // this allow us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);
    console.log("formData", formData);
    console.log("picture name", values.picture.name);

    const savedStageResponse = await fetch(
      `https://el-kindy-project-backend.onrender.com/api/stage/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    const savedStage = await savedStageResponse.json();
    //onSubmitProps.resetForm();

    if (savedStage) {
      console.log('Stage updated!');
      console.log("Stage", savedStage);
      // Show the toast notification with autoClose: false
      toast.success("Stage updated successfully !!", {
        autoClose: 1500,
        style: {
          color: 'green' // Text color
        }
      });
      setTimeout(() => {
        navigate('/listStage');
      }, 2000);

    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setstage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    //values.preventDefault();
    // const formData = new FormData(values.target); // Create FormData object from form
    // const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    // console.log("Values",formValues);
    //await register(values, onSubmitProps);
    //console.log("values",values);
    //await addstage(values, onSubmitProps);
    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    // console.log("Values",formValues);
    await updateStage(formValues, onSubmitProps);
  };

  return (
    <div>
      <SideBar />
      <main>
        {/* Page content START */}
        <div className="page-content">
          <TopBarBack />
          <ToastContainer />

          {/* Page main content START */}
          <div className="page-content-wrapper border">

            {/* =======================
              Page Banner START */}
            <BannerStart
              title="Update stage"
              description="Read our Before you create a stage article before submitting!"
            />
            {/* =======================
              Page Banner END */}
            <div class="card bg-transparent border rounded-3 mt-4">
              {/* Card header */}
              <div className="card-header bg-light border-bottom px-lg-3">
                {/* Step Buttons START */}
                {/* Step 1 */}
                <div className="">
                  <h2 className="p-2" style={{ color: dataTheme === 'dark' ? '#2B6DA2' : '#1d3b53' }}>stage details</h2>
                </div>
              </div>
              <div>

              </div>

              <form onSubmit={handleFormSubmit}>
                {/* Step 1 content START */}
                <div className="m-4">
                  {/* Title */}

                  {/* Basic information START */}
                  <div className="row g-4">
                    {/* stage title */}
                    <div className="col-12">
                      <label className="form-label">Stage title</label>
                      <input className="form-control" onChange={handleChange} value={stage.title} name="title" type="text" placeholder="Enter stage title" required />
                    </div>
                    {/* Short description */}
                    <div className="col-12">
                      <label className="form-label">Short description</label>
                      <textarea className="form-control" onChange={handleChange} value={stage.description} name="description" rows={2} placeholder="Enter keywords" defaultValue={""} required />
                    </div>
                    {/* Upload image START */}
                    <div className="m-4">
                      {/* Image */}
                      <div className="col-12">
                        <div className="text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3">
                          {/* Display the image */}
                          {(imageFile) ? (
                            <div>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded image"
                                className="img-fluid mb-2"
                                style={{ maxWidth: '300px', maxHeight: '300px' }} // Limit image dimensions
                                required
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          ) : <div>
                            <img
                              src={`http://localhost:3001/assets/${stage.picturePath}`}
                              alt="Uploaded image"
                              className="img-fluid mb-2"
                              style={{ maxWidth: '300px', maxHeight: '300px' }} // Limit image dimensions
                              required
                            />
                            <p className="mb-0">{stage.picturePath}</p>
                          </div>}
                          {/* Upload image button */}
                          <div className="mb-3">
                            <h6 className="my-2">Upload stage image here, or <span className="text-primary" style={{ cursor: 'pointer' }}>Browse</span></h6>
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
                            <p className="small mb-0 mt-2"><b>Note:</b> Only JPG, JPEG, and PNG formats are supported. Our suggested dimensions are 600px * 450px. Larger images will be cropped to fit our thumbnails/previews.</p>
                          </div>
                          {/* Remove image button */}
                          {(imageName) && (
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




                    {/* stage time */}
                    <div className="col-md-6">
                      <label className="form-label">stage time</label>
                      <input
                        className="form-control"
                        type="date"
                        name="startDate"

                        required
                      />                    </div>

                    {/* stage price */}
                    <div className="col-md-6">
                      <label className="form-label">stage price</label>
                      <input
                        className="form-control"
                        type="date"
                        name="finishDate"

                        required
                      />                  </div>




                  </div>


                  {/* Step 4 button */}
                  <div className="d-md-flex justify-content-end align-items-start mt-4">
                    <div className="text-md-end">
                      <button href="stage-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a stage</button>
                      <p className="mb-0 small mt-1">Once you click "Submit a stage", your stage will be uploaded and marked as pending for review.</p>
                    </div>
                  </div>

                </div>

              </form>
            </div>


          </div>
        </div>
      </main>
    </div>
  )
}

export default EditStage