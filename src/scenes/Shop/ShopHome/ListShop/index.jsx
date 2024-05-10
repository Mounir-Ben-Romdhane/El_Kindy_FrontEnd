import BannerStartHome from 'components/BannerStartHome'
import Footer from 'components/FooterClient'
import NavBar from 'components/NavBar'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import './ListShop.css';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';

function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const decodeToken = accessToken ? jwtDecode(accessToken) : "";
  const [popupVisible, setPopupVisible] = useState(false); // Etat pour contrôler la visibilité du popup
  const [shops, setShops] = useState([]); // Etat pour stocker la liste des shops
  const [errors, setErrors] = useState({}); // State to hold form errors

  // State to hold the image name
  const [imageName, setImageName] = useState(null);
  // State to hold the image file
  const [imageFile, setImageFile] = useState(null);

  // Function to handle removing the image
  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById('image').value = '';
  };
  // Function to handle selecting an image
  const handleImageSelect = (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];
    // Set the image name
    setImageName(selectedFile.name);
    // Set the image file
    setImageFile(selectedFile);
  };
  const navigate = useNavigate();

  const addShop = async (values, onSubmitProps) => {
    console.log("values", values);
    // this allow us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);
    console.log("formData", formData);
    console.log("picture name", values.picture.name);

    // Add the full name of the user to the form data
    const fullName = decodeToken ? decodeToken.fullName : '';
    const email = decodeToken ? decodeToken.email : '';

    formData.append('fullName', fullName);
    formData.append('email', email);

    const savedUserResponse = await fetch(
      "https://el-kindy-project-backend.onrender.com/shops",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedShop = await savedUserResponse.json();
    //onSubmitProps.resetForm();
    if (savedShop) {
      console.log('Instrument ajouté !');
      console.log('Instrument', savedShop);
      setPopupVisible(true); // Afficher le popup après l'ajout réussi
      setTimeout(() => {
        setPopupVisible(false); // Fermer le popup après un délai
        navigate('/ListShop');
      }, 1500); // Délai pour fermer le popup et naviguer vers la liste des magasins
      toast.success('Instrument ajouté avec succès !!', {
        autoClose: 1500,
        onClose: () => {
          navigate('/ListShop');
        }
      });
    }
  };
  // Effet pour nettoyer le corps après la fermeture du modal
  useEffect(() => {
    const handleModalClose = () => {
      document.body.classList.remove('modal-open');
    };

    if (!popupVisible) {
      handleModalClose();
    }

    return () => {
      handleModalClose();
    };
  }, [popupVisible]);
  const handleFormSubmit = async (values, onSubmitProps) => {

    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    const formErrors = {};
    // Add validation for image
    if (!imageFile) {
      formErrors.picture = 'Image is required';
    }
    // console.log("Values",formValues);const formErrors = {};
    if (!formValues.name) {
      formErrors.name = 'Name is required';
    }
    if (!formValues.marque) {
      formErrors.marque = 'Brand is required';
    }
    if (!formValues.price) {
      formErrors.price = 'Price is required';
    }
    if (!formValues.phoneNumber) {
      formErrors.phoneNumber = 'Phone number is required';
    }
    if (!formValues.description) {
      formErrors.description = 'description is required';
    }
    setErrors(formErrors); // Update error state
    if (Object.keys(formErrors).length === 0) {
      await addShop(formValues, onSubmitProps);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://el-kindy-project-backend.onrender.com/shops");
      const data = await response.json();
      // Filtrer les shops dont le statut est "accepted"
      const acceptedShops = data.filter((shop) => shop.status === 'accepted');
      setShops(acceptedShops);
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <ToastContainer />
        {/* =======================
Page Banner START */}
        <BannerStartHome
          title="Shop Home"
          description="Buy here , musical instruments for everyone ...!"
        />
        {/* =======================Page Banner END */}
        <div>
          <section className="py-5">
            <div className="container">
            <div className="row justify-content-center align-items-center">
  <div className="col-lg-6 position-relative order-1 order-lg-2">
    {/* Title */}
    <h5 className="text-center">
      <img src="assets/images/element/guitarr.svg" className="h-50px mb-2" alt="" /> Sell your own product <img src="assets/images/element/guitarr.svg" className="h-50px mb-2" alt="" />
    </h5>
    <p className="mb-2 text-center">For instance, when it comes to buying musical instruments, whether new or used, our website makes it easy for you.</p>

    {/* Button */}
    <div className="text-center">
      <a href="#" className="btn btn-primary mb-0" data-bs-toggle="modal" data-bs-target="#addShop">
        <FontAwesomeIcon icon={faShare} className="me-2" /> Share your product for sale here ...
      </a>
    </div>
  </div>
</div>
              <div className="my-5"></div>


              <div className="row">
                {/* Main content START */}
                <div className="col-12">
                  {/* Search option START */}
                  <div className="row mb-4 align-items-center">
                    {/* Title */}
                    <div className="col-md-4">
                      <h5 className="mb-2 mb-sm-0"> We have {shops.length} Instruments in our shop</h5>
                    </div>
                  </div>
                  {/* Search option END */}
                  {/* Main content START */}
                  {/* Main content START */}
                  <section className="py-5">
                    <div className="container">
                      <div className="row g-4">
                        {/* Parcours des shops et génération dynamique des cartes */}
                        {shops.map((shop) => (
                          <div key={shop._id} className="col-sm-6 col-lg-4 col-xl-3">
                            <Link to={`/DetailShopFront/${shop._id}`} className="text-decoration-none">
                              <div className="cardd h-100 shadow zoom border-2s position-relative" style={{ backgroundColor: 'white' }}>
                                {/* Bouton panier en haut à droite avec espace */}

                                {/* Image */}
                                <img
                                  src={`https://el-kindy-project-backend.onrender.com/assets/${shop.picturePath}`}
                                  className="card-img-top"
                                  alt="shop image"
                                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                />
                                {/* Card body */}
                                <div className="card-body px-3">
                                  {/* Title */}
                                  <h5 className="card-title mb-0">
                                    <a href={`/shop-details/${shop._id}`} className="stretched-link">{shop.name}</a>
                                  </h5>
                                </div>

                                {/* Card footer */}
                                <div className="card-footer pt-0 px-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="h6 fw-light mb-0">By {shop.marque} <br /> </span>
                                  </div>
                                </div>
                                <div className="card-footer  pt-0 px-3">
                                  {/* Conditionally render price with or without discount */}
                                  {shop.remise !== null ? (
                                    <div className="d-flex justify-content-end align-items-center me-2">
                                      <li className="list-inline-item">
                                        <label className="btn btn-success-soft-check" htmlFor={`option_${shop._id}`}>
                                          {/* Price and discount */}
                                          <span className="d-flex align-items-center">
                                            <span className="mb-0 h5 me-2 text-success">{(shop.price - (shop.price * shop.remise) / 100).toFixed(2)} dt</span>
                                            {/* Placeholder for discount */}
                                            <span className="text-decoration-line-through fs-6 mb-0 me-2">{shop.price}dt</span>
                                            {/* Placeholder for discount percentage */}
                                            <span className="badge bg-danger text-white mb-0">{shop.remise}% off</span>
                                          </span>
                                        </label>
                                      </li>
                                    </div>
                                  ) : (
                                    <div className="d-flex justify-content-end align-items-center me-2">

                                      <li className="list-inline-item">
                                        <label className="btn btn-success-soft-check" htmlFor={`option_${shop._id}`}>

                                          <h5 className="text-success mb-0">{shop.price} dt</h5>
                                        </label>
                                      </li>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                  {/* Main content END */}

                  {/* Main content END */}
                  
                </div>
                {/* Main content END */}
              </div>{/* Row END */}
            </div>
          </section>
          {/* =======================
Page content END */}

          <div className={`modal fade ${popupVisible ? 'show' : ''}`} id="addShop" tabIndex={-1} aria-labelledby="addShopLabel" aria-hidden={!popupVisible}>
            <div className={`modal-dialog modal-dialog-centered ${popupVisible ? 'show' : ''}`}>
              <div className="modal-content">
                <div className="modal-header bg-primary">
                  <h5 className="modal-title text-white" id="addShopLabel">Add New Instrument</h5>
                  <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleFormSubmit} className="row text-start g-3">
                    {/* Instrument name */}
                    <div className="col-6">
                      <label className="form-label">Instrument name </label>
                      <input className="form-control" name="name" type="text" placeholder="Write name" />
                      {errors.name && <div className="text-danger">{errors.name}</div>} {/* Display name error */}
                    </div>
                    {/* Brand */}
                    <div className="col-6">
                      <label className="form-label">Brand</label>
                      <input className="form-control" name="marque" type="text" placeholder="Write the brand" />
                      {errors.marque && <div className="text-danger">{errors.marque}</div>} {/* Display brand error */}
                    </div>
                    {/* Price */}
                    <div className="col-6">
                      <label className="form-label">Price</label>
                      <input className="form-control" name="price" type="number" placeholder="Write the price" />
                      {errors.price && <div className="text-danger">{errors.price}</div>} {/* Display price error */}
                    </div>
                    {/* Discount */}
                    <div className="col-6">
                      <label className="form-label">Discount</label>
                      <input className="form-control" name="remise" type="number" placeholder="Write a discount" />
                    </div>
                    {/* Phone number */}
                    <div className="col-6">
                      <label className="form-label">Phone number</label>
                      <input className="form-control" name="phoneNumber" type="number" placeholder="Write the number" />
                      {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>} {/* Display phone number error */}
                    </div>
                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input className="form-control" name="description" type="text" placeholder="Write description" />
                      {errors.description && <div className="text-danger">{errors.description}</div>} {/* Display phone number error */}

                    </div>
                    {/* Upload image */}
                    <div className="col-12">
                      <div className="m-4">
                        <div className="text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3">
                          {imageFile && (
                            <div>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded image"
                                className="img-fluid mb-2 rounded"
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          )}
                          <div className="mb-3">
                            <h6 className="my-2">Upload instrument picture here, or <span className="text-primary" style={{ cursor: 'pointer' }}>Browse</span></h6>
                            <input
                              className="form-control form-control-sm"
                              type="file"
                              name="picture"
                              id="image"
                              accept="image/gif, image/jpeg, image/png"
                              onChange={handleImageSelect}

                            />
                            {errors.picture && <div className="text-danger">{errors.picture}</div>} {/* Display phone number error */}

                            <p className="small mb-0 mt-2"><b>Note:</b> Only JPG, JPEG, and PNG formats are supported. Our suggested dimensions are 600px * 450px. Larger images will be cropped to fit our thumbnails/previews.</p>
                          </div>
                          {errors.picture && <div className="text-danger">{errors.picture}</div>} {/* Display image error */}
                          {imageFile && (
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
                    {/* Submit button */}
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                      <button className="btn btn-success my-0" type="submit">Add Instrument</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>


        </div>




      </main>
      {/* **************** MAIN CONTENT END **************** */}

      <Footer />
    </>
  )
}

export default Index