import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, {useState} from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Index() {
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

const addCategory = async (values, onSubmitProps) => {
    console.log("values",values);
    // this allow us to send form info with image
    const formData = new FormData();
    for (let value in values) {
        formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);
    console.log("formData",formData);
    console.log("picture name", values.picture.name);
    
    const savedUserResponse = await fetch(
        "https://el-kindy-project-backend.onrender.com/api/categories",
        {
            method: "POST",
            body: formData,
        }
    );
    const savedCategory = await savedUserResponse.json();
    //onSubmitProps.resetForm();

    if (savedCategory) {
        console.log('Category added!');
            console.log("Category", savedCategory);
            toast.success("Category added successfully !!", { autoClose: 1500,
                style: {
                  color: 'green' // Text color
                }});
              setTimeout(() => {
                navigate('/listCategories');
              }, 2000);
      } 
};

const handleFormSubmit = async (values, onSubmitProps) => {

  values.preventDefault();
  const formData = new FormData(values.target); // Create FormData object from form
  const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
 // console.log("Values",formValues);
  await addCategory(formValues, onSubmitProps);
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
                  title= "Submit a new Category"
                  description= "Read our Before you create a category article before submitting!"
                />
              {/* =======================
              Page Banner END */}
              <div className="card bg-transparent border rounded-3 mt-4">
                      {/* Card header */}
                <div className="card-header bg-light border-bottom px-lg-3">
                  {/* Step Buttons START */}
                    {/* Step 1 */}
                      <div className="">
                      <h2 className="p-2 " style={{color:"#1d3b53"}}>Category details</h2>
                      </div>
              </div>

            <form onSubmit={handleFormSubmit}>
              {/* Step 1 content START */}
              <div className="m-4">
                {/* Title */}
                
                {/* Basic information START */}
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Category title</label>
                    <input className="form-control" name="name" type="name" placeholder="Enter category title" />
                  </div>
                  {/* Short description */}
                  <div className="col-12">
                    <label className="form-label">Short description</label>
                    <textarea className="form-control" name="description" rows={2} placeholder="Enter keywords" defaultValue={""} />
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
                      <h6 className="my-2">Upload course image here, or <span className="text-primary" style={{cursor: 'pointer'}}>Browse</span></h6>
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
                  
                  
                </div>
                

                {/* Step 4 button */}
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <div className="text-md-end">
                    <button href="course-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a Category</button>
                    <p className="mb-0 small mt-1">Once you click "Submit a category", your category will be uploaded and marked as pending for review.</p>
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

export default Index