import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, {useEffect, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setLogout } from "../../../../state";
import refreshToken from "scenes/Authentification/TokenService/tokenService";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const  modules  = {
  toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script:  "sub" }, { script:  "super" }],
      ["blockquote", "code-block"],
      [{ list:  "ordered" }, { list:  "bullet" }],
      ["link"],
      ["clean"],
  ],
};

function EditCourse() {

    const [dataTheme, setDataTheme] = useState('');
      
  // Inside your component function
const [fullDescription, setFullDescription] = useState('');
    const [course, setCourse] = useState({
        title: "",
        description: "",
        picturePath: "",
        courseCategory: "",
        courseLevel: "",
        courseTime: 0,
        coursePrice: 0,
        fullDescription:""
    });
    const dispatch = useDispatch();
    const { id } = useParams();
    const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://el-kindy-project-backend.onrender.com/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

    useEffect(() => {
      fetchCategories();
        const fetchData = async () => {
          try {
            const response = await fetch(`https://el-kindy-project-backend.onrender.com/course/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setCourse(data);
              setFullDescription(data.fullDescription);
            } else if (response.status === 401 || response.status === 403 ) {
              // Refresh access token
              const newAccessToken = await refreshToken(refreshTokenState, dispatch);
              if (newAccessToken) {
                // Retry fetching courses with the new access token
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
            console.error("Error fetching courses:", error);
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


const updateCourse = async (values, onSubmitProps) => {
    console.log("values",values);
    // this allow us to send form info with image
    const formData = new FormData();
    for (let value in values) {
        formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);
    console.log("formData",formData);
    console.log("picture name", values.picture.name);
    
    const savedCourseResponse = await fetch(
        `https://el-kindy-project-backend.onrender.com/course/update/${id}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            body: formData,
        }
    );
    const savedCourse = await savedCourseResponse.json();
    //onSubmitProps.resetForm();

    if (savedCourse) {
        console.log('Course updated!');
            console.log("Course", savedCourse);
            // Show the toast notification with autoClose: false
            toast.success("Course updated successfully !!", { autoClose: 1500,
              style: {
                color: 'green' // Text color
              }});
            setTimeout(() => {
              navigate('/listCourses');
            }, 2000);
            
    } 
};

const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



// Function to handle changes in the full description field
const handleFullDescriptionChange = (content) => {
  setFullDescription(content);
};

const handleFormSubmit = async (values, onSubmitProps) => {
    //values.preventDefault();
   // const formData = new FormData(values.target); // Create FormData object from form
   // const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
   // console.log("Values",formValues);
     //await register(values, onSubmitProps);
    //console.log("values",values);
    //await addCourse(values, onSubmitProps);
    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form
    formData.append('fullDescription', fullDescription); // Append full description to form data
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    console.log("Values",formValues);
    await updateCourse(formValues, onSubmitProps);
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
                  title= "Update Course"
                  description= "Read our Before you create a course article before submitting!"
                />
              {/* =======================
              Page Banner END */}
              <div class="card bg-transparent border rounded-3 mt-4">
                      {/* Card header */}
                <div className="card-header bg-light border-bottom px-lg-3">
                  {/* Step Buttons START */}
                    {/* Step 1 */}
                      <div className="">
                      <h2 className="p-2" style={{ color: dataTheme === 'dark' ? '#2B6DA2' : '#1d3b53' }}>Course details</h2>
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
                  {/* Course title */}
                  <div className="col-12">
                    <label className="form-label">Course title</label>
                    <input className="form-control" onChange={handleChange} value={course.title} name="title" type="text" placeholder="Enter course title" required/>
                  </div>
                  {/* Short description */}
                  <div className="col-12">
                    <label className="form-label">Short description</label>
                    <textarea className="form-control" onChange={handleChange} value={course.description} name="description" rows={2} placeholder="Enter keywords" defaultValue={""} required />
                  </div>
                  {/* Upload image START */}
                  <div className="m-4">
                    {/* Image */}
                    <div className="col-12">
                      <div className="text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3">
                        {/* Display the image */}
                        {(imageFile ) ?(
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
                                src={`https://el-kindy-project-backend.onrender.com/assets/${course.picturePath}`}
                                alt="Uploaded image"
                                className="img-fluid mb-2"
                                style={{ maxWidth: '300px', maxHeight: '300px' }} // Limit image dimensions
                                required
                                />
                        <p className="mb-0">{course.picturePath}</p>
                    </div>}
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
                    {(imageName ) && (
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
                  {/* Course category */}
                  <div className="col-md-6">
                    <label className="form-label">Course category</label>
                    <select name="courseCategory" onChange={handleChange} value={course.courseCategory} className="form-select  border-0 z-index-9 bg-transparent" aria-label=".form-select-sm" data-search-enabled="true" required>
                    <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                  </div>
                  {/* Course level */}
                  <div className="col-md-6">
                    <label className="form-label">Course level</label>
                    <select name="courseLevel" onChange={handleChange} value={course.courseLevel} required className="form-select border-0 z-index-9 bg-transparent" aria-label=".form-select-sm" data-search-enabled="false" data-remove-item-button="true">
                      <option value>Select course level</option>
                      <option>All level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advance</option>
                    </select>
                  </div>
                  
                  
                  
                  {/* Course time */}
                  <div className="col-md-6">
                    <label className="form-label">Course time</label>
                    <input name="courseTime" onChange={handleChange} value={course.courseTime} className="form-control" type="text" placeholder="Enter course time" />
                  </div>
                  
                  {/* Course price */}
                  <div className="col-md-6">
                    <label className="form-label">Course price</label>
                    <input name="coursePrice" onChange={handleChange} value={course.coursePrice} type="text" className="form-control" placeholder="Enter course price" />
                  </div>


                  <div className="col-12">
        <label className="form-label">Add description</label>
        
        {/* Main toolbar */}
        <div className="bg-body border rounded-bottom overflow-hidden" style={{ borderRadius: '15px' }}>
            <ReactQuill 
                modules={modules}  
                theme="snow"
                onChange={handleFullDescriptionChange}
                value={fullDescription} 
                placeholder="The content starts here..."  
                style={{ height: '100%' }} // Adjust the height of the ReactQuill editor
            />
        </div>
    </div>
                  
                </div>
                

                {/* Step 4 button */}
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <div className="text-md-end">
                    <button href="course-added.html" className="btn btn-success mb-2 mb-sm-0" type="submit">Submit a Course</button>
                    <p className="mb-0 small mt-1">Once you click "Submit a Course", your course will be uploaded and marked as pending for review.</p>
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

export default EditCourse