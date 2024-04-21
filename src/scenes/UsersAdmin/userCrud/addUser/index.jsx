import React, { useState } from 'react';
import { addAdmin } from 'services/usersService/api';

function AddUser({ onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verified: true,
    roles: ['admin'],
    address: '',
    gender: '',
    phoneNumber1: '',
    phoneNumber2: '',
    dateOfBirth: '',
    // Add other necessary fields here
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  //submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("aaaa");
    try {
      // Make API call to add user
      const response = await addAdmin(formData);
      
      if (response.status === 201) {
        console.log('User added successfully!');
        
        // Close the form
        onClose();

        //fetch data
        fetchData();
      } else {
        console.error('Error adding user:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error adding user:', error);
      // Handle error here, e.g., show error message to the user
    }
  };

  return (
    <div className="page-content-wrapper border">
      <div className="container position-relative">
        {/* Close icon */}
        <button
          className="btn btn-link text-danger position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ fontSize: '1.3rem' }}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        {/* Form content */}
        <form onSubmit={handleSubmit}>
          {/* Personal information */}
          <div className="mt-5">
            <h5 className=" font-base">
            Personal information
            </h5>
            <div
            >
              <div className="accordion-body mt-3">
                <div className="row g-4">
                  {/* First name */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          First name <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Last name */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Last name <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Email <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Password */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Password <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Address</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Gender</h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Phone Number 1 */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Phone Number 1 <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber1"
                          value={formData.phoneNumber1}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Phone Number 2 */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Phone Number 2</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="text"
                          name="phoneNumber2"
                          value={formData.phoneNumber2}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">Date of Birth</h6>
                      </div>
                      <div className="col-lg-8">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Add other necessary fields here */}
                </div>
              </div>
            </div>
          </div>
          {/* Submit button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
