import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';

import { Link, useNavigate } from 'react-router-dom'

function AddEvent() {

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


const navigate = useNavigate();



const addEvent = async (values, onSubmitProps) => {
  console.log("values",values);
  // this allow us to send form info with image
  const formData = new FormData();
  for (let value in values) {
      formData.append(value, values[value]);
  }
  formData.append('picturePath', values.picture.name);
  console.log("formData",formData);
  console.log("picture name", values.picture.name);
  
  const savedEventResponse = await fetch(
      "http://localhost:3001/event/add",
      {
          method: "POST",
          body: formData,
      }
  );
  const savedEvent = await savedEventResponse.json();


  if (savedEvent) {
      console.log('Event added!');
          console.log("Event", savedEvent);
          // Show the toast notification with autoClose: false
          toast.success("Event added successfully !!", { autoClose: 1500,
            style: {
              color: 'green' // Text color
            }});
          setTimeout(() => {
            navigate('/listEvents');
          }, 2000);
  } 
};

const handleFormSubmit = async (values, onSubmitProps) => {
values.preventDefault();
const formData = new FormData(values.target); // Create FormData object from form
const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
await addEvent(formValues, onSubmitProps);

};

  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <ToastContainer />
          <div className="page-content-wrapper border">
            <BannerStart
              title="Submit a New Event"
              description="Read our 'Before you create an event' article before submitting!"
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
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Enter Event title"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Short Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={2}
                      placeholder="Short description of the event"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="dateDebut"

                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="dateFin"

                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Event Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="Enter event price"

                    />
                  </div>
                 {/* Upload image START */}
                 <div className="m-4">
                    {/* Image */}
                    <div className="col-12">
                      <div className="text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3">
                        {/* Display the image */}
                        {imageFile && (
                          <div>
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt="Uploaded image"
                              className="img-fluid mb-2"
                              style={{ maxWidth: '300px', maxHeight: '300px' }} // Limit image dimensions
                            />
                            <p className="mb-0">Uploaded image</p>
                          </div>
                        )}
                    {/* Upload image button */}
                    <div className="mb-3">
                      <h6 className="my-2">Upload Event image here, or <span className="text-primary" style={{cursor: 'pointer'}}>Browse</span></h6>
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
