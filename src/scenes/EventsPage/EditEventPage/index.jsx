import BannerStart from 'components/BannerStart'
import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React , { useState }from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { redirect } from 'react-router';
import { useNavigate } from 'react-router-dom';

function EditEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: '', 
    dateDebut: '',
    dateFin: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://el-kindy-project-backend.onrender.com/event/event/create', formData);
      alert('Event added successfully');
      navigate('/listEvents');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    }
  };

  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <div className="page-content-wrapper border">
            <BannerStart 
              title="Submit a New Event"
              description="Read our 'Before you create an event' article before submitting!"
            />
            <div className="card bg-transparent border rounded-3 mt-4">
              <div className="card-header bg-light border-bottom px-lg-3">
                <h2 className="p-2 " style={{color:"#1d3b53"}}>Event Details</h2>
              </div>
              <form onSubmit={handleSubmit} className="m-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Event Title</label>
                    <input className="form-control" type="text" name="title" placeholder="Enter Event title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Short Description</label>
                    <textarea className="form-control" name="description" rows={2} placeholder="Short description of the event" value={formData.description} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input className="form-control" type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input className="form-control" type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Event Price</label>
                    <input type="number" className="form-control" name="price" placeholder="Enter event price" value={formData.price} onChange={handleChange} />
                  </div>
                    {/* Upload image START */}
              
                {/* Upload image END */}
                </div>
                <div className="d-md-flex justify-content-end align-items-start mt-4">
                  <button type="submit" className="btn btn-success mb-2 mb-sm-0">Submit Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditEvent;