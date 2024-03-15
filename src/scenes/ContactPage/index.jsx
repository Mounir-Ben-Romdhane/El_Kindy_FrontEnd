import { width } from '@mui/system'
import BannerStartHome from 'components/BannerStartHome'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import React from 'react'
import { Link } from "react-router-dom";
import '../../scenes/Style.css' 

function ContactPage() {
  return (
        <>
      <NavBar />
      {/* **************** MAIN CONTENT START **************** */}
<main>
        {/* =======================
Page Banner START */}
      <BannerStartHome
        title="Contact us"
        description="We're here to help!"
        />
        {/* =======================
Page Banner END */}
  {/* =======================
Page Banner START */}
  <section className="pt-5 pb-0" style={{backgroundImage: 'url(assets/images/element/map.svg)', backgroundPosition: 'center left', backgroundSize: 'cover'}}>
    <div className="container">
      {/* Contact info box */}
      <div className="row g-4 g-md-5 mt-0 mt-lg-3">
        {/* Box item */}
        <div className="col-lg-6 mt-lg-0">
          <div className="card card-body bg-primary shadow py-5 text-center h-100">
            {/* Title */}
            <h5 className="text-white mb-3">Hours of operation</h5>
            <ul className="list-inline mb-0">
              {/* Address */}
              <li className="list-item mb-3">
                <a href="#" className="text-white"> <i class="far fa-clock text-white me-2"></i>Lundi - Vendredi: 14:00 - 20:00</a>
              </li>
              {/* Phone number */}
              <li className="list-item mb-3">
                <a href="#" className="text-white"> <i class="far fa-clock text-white me-2"></i>Samedi - Dimande: 10:00 - 20:00</a>
              </li>
              
            </ul>
          </div>
        </div>
        {/* Box item */}
        <div className="col-lg-6 mt-lg-0">
          <div className="card card-body shadow py-5 text-center h-100">
            {/* Title */}
            <h5 className="mb-3">Contact Address</h5>
            <ul className="list-inline mb-0">
              {/* Address */}
              <li className="list-item mb-3 h6 fw-light">
                <a href="#"> <i className="fas fa-fw fa-map-marker-alt me-2 mt-1" />24, Rue Manzel Mabrouk Cité Olympique, Tunis</a>
              </li>
              {/* Phone number */}
              <li className="list-item mb-3 h6 fw-light">
               <i className="fas fa-fw fa-phone-alt me-2" />20 669 545
              </li>
              {/* Email id */}
              <li className="list-item mb-0 h6 fw-light">
                <i className="far fa-fw fa-envelope me-2" />conservatoireelkindy@gmail.com
              </li>
            </ul>
          </div>
        </div>
        {/* Box item */}
        
      </div>
    </div>
  </section>
  {/* =======================
Page Banner END */}

{/* =======================
Instructor START */}
<section className="d-flex justify-content-center align-items-center">
  <div className="container d-flex justify-content-center align-items-center">
    {/* Our team START */}
<div className="col-md-8">
  {/* Title and button */}
  <div className="d-sm-flex d-flex justify-content-center align-items-center">
    <h2 className="mb-0">Meet Our Team</h2>
  </div>
  {/* Slider START */}
  <div className="tiny-slider arrow-round arrow-creative arrow-blur arrow-hover mt-2 mt-sm-5">
    <div className="tiny-slider-inner" data-autoplay="true" data-arrow="true" data-dots="false" data-items={2} data-items-lg={2} data-items-md={2}>
      {/* Avatar item */}
      <div className="text-center">
        {/* Avatar */}
        <div className=" mb-3">
          <img className="imgg rounded-circle shine-effect" style={{ width:"200px" , height:"200px" }} src="assets/images/avatar/lotfi.jpg" alt="avatar" />
        </div>
        {/* Info */}
        <h6 className="mb-0"><a href="#">Lotfi Erraies</a></h6>
        <p className="mb-0 small">Fondateur</p>
        {/* Rating */}
        
      </div>
      {/* Avatar item */}
     
      {/* Avatar item */}
      <div className="text-center">
        {/* Avatar */}
        <div className="mb-3">
          <img className="imgg rounded-circle shine-effect" style={{ width:"200px" , height:"200px" }} src="assets/images/avatar/amin.jpg" alt="avatar" />
        </div>
        {/* Info */}
        <h6 className="mb-0"><a href="#">Amin Ben Taher</a></h6>
        <p className="mb-0 small">Surveillant Général</p>
        {/* Rating */}
        
      </div>
    </div>
  </div>	
  {/* Slider END */}
</div>
{/* Our team END */}
  </div>
</section>
{/* =======================
Instructor END */}




  {/* =======================
Image and contact form START */}
  <section>
    <div className="container">
      <div className="row g-4 g-lg-0 align-items-center">
        <div className="col-md-6 align-items-center text-center">
          {/* Image */}
          <img src="assets/images/element/contact.svg" className="h-400px" alt />
          {/* Social media button */}
          <div className="d-sm-flex align-items-center justify-content-center mt-2 mt-sm-4">
            <h5 className="mb-0">Follow us on:</h5> 
            <ul className="list-inline mb-0 ms-sm-2">
              <li className="list-inline-item"> <Link className="fs-5 me-1 text-facebook" to="https://www.facebook.com/ConservatoireElkindy"><i className="fab fa-fw fa-facebook-square" /></Link> </li>
              <li className="list-inline-item"> <Link className="fs-5 me-1 text-instagram" to="https://www.instagram.com/conservatoireelkindy/"><i className="fab fa-fw fa-instagram" /></Link> </li>
              <li className="list-inline-item"> <Link className="fs-5 me-1 text-youtube" to="https://www.youtube.com/@conservatoireelkindy"><i className="fab fa-fw fa-youtube" /></Link> </li>
       
            </ul>
          </div>
        </div>
        {/* Contact form START */}
        <div className="col-md-6">
          {/* Title */}
          <h2 className="mt-4 mt-md-0">Let's talk</h2>
          <p>To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly</p>
          <form>
            {/* Name */}
            <div className="mb-4 bg-light-input">
              <label htmlFor="yourName" className="form-label">Your name *</label>
              <input type="text" className="form-control form-control-lg" id="yourName" />
            </div>
            {/* Email */}
            <div className="mb-4 bg-light-input">
              <label htmlFor="emailInput" className="form-label">Email address *</label>
              <input type="email" className="form-control form-control-lg" id="emailInput" />
            </div>
            {/* Message */}
            <div className="mb-4 bg-light-input">
              <label htmlFor="textareaBox" className="form-label">Message *</label>
              <textarea className="form-control" id="textareaBox" rows={4} defaultValue={""} />
            </div>
            {/* Button */}
            <div className="d-grid">
              <button className="btn btn-lg btn-primary mb-0" type="button">Send Message</button>
            </div>	
          </form>
        </div>
        {/* Contact form END */}
      </div>
    </div>
  </section>
  {/* =======================
Image and contact form END */}
  {/* =======================
Map START */}
  <section className="pt-0">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <iframe className="w-100 h-400px grayscale rounded" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.2531227561085!2d10.19178487575112!3d36.836413472236906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34ea97b45431%3A0x9fa628e4f017bd3f!2sConservatoire%20Elkindy!5e0!3m2!1sen!2sin!4v1710088795447!5m2!1sen!2sin" height={500} style={{border: 0}} aria-hidden="false" tabIndex={0} />	
        </div>
      </div>
    </div>
  </section>
  {/* =======================
Map END */}
</main>
{/* **************** MAIN CONTENT END **************** */}

      <Footer />
      </>
  )
}

export default ContactPage

