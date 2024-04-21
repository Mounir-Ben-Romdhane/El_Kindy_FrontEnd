import React, { useEffect, useState } from "react";
import NavBar from 'components/NavBar'
import BannerStartHome from 'components/BannerStartHome'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from "components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Index() {
    const [stage, setStage] = useState([]);
    const { id } = useParams();
    const [showContactForm, setShowContactForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [reservation, setReservation] = useState({
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    });    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/stage/${id}`, {
            method: "GET",
          });
          if (response.ok) {
            const data = await response.json();
            setStage(data);
          } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error("Error fetching stage:", error);
        }
      };
  
      if (id) fetchData();
    }, [id]);
  
    const handleApplyClick = () => {
      setShowContactForm(prevState => !prevState);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Here you should replace 'YOUR_RESERVATION_ENDPOINT' with your actual endpoint URL
      const url = `http://localhost:3001/reservationstage/${id}/reservation`;
      const dataToSend = {
        userName: reservation.name,
        userEmail: reservation.email,
        phoneNumber: reservation.phoneNumber,
        message: reservation.message
      };
      const response = await axios.post(url, dataToSend);
      console.log("Reservation response:", response.data);
      toast.success("Reservation successful!", { autoClose: 2000 });
      navigate("/stage"); // Redirect to "/stage" after successful submission
    } catch (error) {
      toast.error("Reservation failed. " + error.message);
      console.error("Reservation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((reservation) => ({
      ...reservation,
      [name]: value,
    }));
  };

  return (
    <div>
      <NavBar />
      <BannerStartHome
        title="Internship"
        description="Find Detail About Our Internship."
      />
      <section className="pt-5 pb-0">
        <div className="container">
          <div className="row g-0 g-lg-5">
            {/* Left sidebar START */}
            <div className="col-lg-4">
              <div className="row">
                <div className="col-md-6 col-lg-12">
                  {/* Instructor image START */}
                  <div className="card shadow p-2 mb-4 text-center">
                    <div className="rounded-3">
                      {/* Image */}
                      {stage.picturePath ? (
                        <img
                          src={`http://localhost:3001/assets/${stage.picturePath}`}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="card-img-top"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    {/* Card body */}
                    <div className="card-body px-3">
                      {/* Social media button */}
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <a className="btn px-2 btn-sm bg-facebook" href="https://www.facebook.com/ConservatoireElkindy">
                            <i className="fab fa-fw fa-facebook-f" />
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a className="btn px-2 btn-sm bg-instagram-gradient" href="https://www.instagram.com/conservatoireelkindy">
                            <i className="fab fa-fw fa-instagram" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Instructor image END */}
                </div>
              </div>
              {/* Row End */}
            </div>
            {/* Left sidebar END */}
            {/* Main content START */}
            <div className="col-lg-8">
              {/* Title */}
              <h5 className="mb-0">El Kindy Conservatory offers Internships for its students they can participate in </h5>
              <h1 className="mb-0">{stage.title}</h1>
              <p>El-kindy Conservatory Internship</p>
              <button className="btn btn-primary btn-sm btn-block" onClick={handleApplyClick}>
                {showContactForm ? "Hide Form" : "Apply"}
              </button>
              <div className="row">
                <div className="col-md-6">
                  <p className="mt-4">{stage.description}</p>
                  {/* Personal info */}
                  <ul className="list-group list-group-borderless">
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-clock text-primary me-1 me-sm-3" />Start Date:</span>
                      <span>{stage.startDate}</span>
                    </li>
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-clock text-primary me-1 me-sm-3" />Finish Date:</span>
                      <span>{stage.finishDate}</span>
                    </li>
                    <li className="list-group-item px-0">
                      <span className="h6 fw-light"><i className="fas fa-fw fa-headphones text-primary me-1 me-sm-3" />Phone number:</span>
                      <span>+216 20 669 545</span>
                    </li>
                  </ul>
                </div>
                {/* Show contact form if applicable */}
                {showContactForm && (
                  <div className="col-md-6">
  <form onSubmit={handleReservationSubmit}>
                      {/* Name */}<h2>Internship Form</h2>
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="yourName" className="form-label">Your name *</label>
                        <input 
  type="text" 
  className="form-control form-control-lg" 
  value={reservation.name} 
  onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
  id="yourName" 
/>

                      </div>
                      {/* Email */}
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="emailInput" className="form-label">Email address *</label>
                        <input 
  type="email" 
  className="form-control form-control-lg" 
  value={reservation.email} 
  onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
  id="emailInput" 
/>
                      </div>
                       {/* Message */}
                       <div className="mb-4 bg-light-input">
                        <label htmlFor="phoneNumberareaBox" className="form-label">phoneNumber *</label>
                        <input 
  type="text" 
  className="form-control form-control-lg" 
  value={reservation.phoneNumber} 
  onChange={(e) => setReservation({ ...reservation, phoneNumber: e.target.value })}
  id="phoneNumberInput" 
/>
                      </div>

                      {/* PhoneNumber */}
                      <div className="mb-4 bg-light-input">
                        <label htmlFor="textareaBox" className="form-label">Message *</label>
                        <textarea 
  className="form-control" 
  value={reservation.message} 
  onChange={(e) => setReservation({ ...reservation, message: e.target.value })}
  id="textareaBox" 
  rows={4} 
/>
                      </div>
                     
                      {/* Button */}
                      <div className="d-grid">
                      <button 
  className="btn btn-lg btn-primary mb-0"
  type="submit"  // Change the type to "submit" 
  onClick={handleReservationSubmit}
>
  Apply For Internship
</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            {/* Main content END */}
          </div>
          {/* Row END */}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Index;
