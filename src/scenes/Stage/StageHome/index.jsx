import React, { useEffect, useState, useRef } from "react";
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import { useSelector } from "react-redux";

import { loadScripts } from "../../../scriptLoader";
import BannerStartHome from "components/BannerStartHome";
import '../../Style.css';

function Index() {
  const [stages, setStages] = useState([]);

  // Récupérer les stage de l'API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await fetch("http://localhost:3001/stage");
        const { stages } = await response.json();
        setStages(stages);
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };


    fetchStages();
  }, []);

  return (
    <>
      <NavBar />

      <BannerStartHome
          title="All Stages"
          description="Find Out Our stages."
        />

      {/* =======================
Main Banner START */}
      
      {/* =======================
Main Banner END */}

      <div>
        {/*Page Banner START */}
       
        {/* =======================
Page Banner END */}
        {/* =======================
Page content START */}
       <section className="position-relative pt-0 pt-lg-5 bg-light">
  <div className="container">
    <div className="row g-4">
      {stages.map((stage, index) => (
        <div className="col-sm-6 col-lg-3 col-xl-3" key={index}>
          <div className="cardd shadow-hover h-100">
            <div className="overflow-hidden rounded-3">
              {/* Affichage de l'image */}
              {stage.picturePath ? (
                <img
                  src={`http://localhost:3001/assets/${stage.picturePath}`}
                  alt=""
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  className="card-img-top"
                />
              ) : (
                <span>No Image</span>
              )}
              {/* Overlay */}
              <div className="bg-overlay bg-dark opacity-4" />
              <div className="card-img-overlay d-flex align-items-start p-3">
                {/* Badge */}
                <a href="#" className="badge bg-success text-white">
                  Student Event
                </a>
                {/* Reservation Button 
                <button className="btn btn-warning ml-5 ms-5">Reservation</button>*/}
              </div>
            </div>
            <h5 className="card-title fw-normal">
                          {/*     <a href="#">{event.title}</a> */}
                            </h5>
                            <div className="text-center mt-5 cardd-layer">
                            <a href="#" className="btn btn-primary btn-sm">View more</a>
                            </div>
            {/* Card body */}
            <div className="card-body">
            
              {/* Title */}
              <h5 className="card-title">
                
                <a href="#">{stage.title}</a>
                
              </h5>
              <p className="text-truncate-2">{stage.description}</p>
              {/* Info */}
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">
                  <a href="#">{stage.startDate}</a>
                </h6>
                <span className="small">{stage.finishDate}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      </div>

      <Footer />
    </>
  );
}

export default Index;
