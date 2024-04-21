import React, { useEffect, useState } from 'react';
import { getAllClasses } from 'services/classesService/api';
import { getAllCourses } from 'services/courseService/api';
import { addStudent } from 'services/usersService/api';

function AddStudent({ onClose, fetchData }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    classLevel: '', // Add classLevel for student
    coursesEnrolled: [],
    dateOfBirth: '',
    address: '',
    gender: '',
    phoneNumber1: '',
    phoneNumber2: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    disponibilite: [] // Availability slots
  });

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await getAllCourses();
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await getAllClasses();
        setClasses(classesData.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'coursesEnrolled') {
      const selectedCourseId = value;
      const isChecked = checked;
      if (isChecked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesEnrolled: [...prevFormData.coursesEnrolled, selectedCourseId],
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursesEnrolled: prevFormData.coursesEnrolled.filter((id) => id !== selectedCourseId),
        }));
      }
    } else if (name === 'classLevel') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("formData : ",formData);
    formData.disponibilite = selectedTimeSlots;
    try {
      // Make API call to add student
      const response = await addStudent(formData);
      if (response.status === 201) {
        console.log('Student added successfully!');
        // Close the form
        onClose();
        // Fetch data
        fetchData();
      } else {
        console.error('Error adding student:', response.data);
        // Handle error here, e.g., show error message to the user
      }
    } catch (error) {
      console.error('Error adding student:', error);
      // Handle error here, e.g., show error message to the user
    }
  };

  //table time
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Function to handle cell click
  const handleCellClick = (day, startTime, endTime) => {
    const timeSlot = { day, startTime, endTime };
    // Check if the time slot is already selected
    const isSelected = selectedTimeSlots.some(
      (slot) =>
        slot.day === timeSlot.day &&
        slot.startTime === timeSlot.startTime &&
        slot.endTime === timeSlot.endTime
    );

    if (isSelected) {
      // Deselect the time slot
      setSelectedTimeSlots((prevSelected) =>
        prevSelected.filter(
          (slot) =>
            !(
              slot.day === timeSlot.day &&
              slot.startTime === timeSlot.startTime &&
              slot.endTime === timeSlot.endTime
            )
        )
      );
    } else {
      // Select the time slot
      setSelectedTimeSlots((prevSelected) => [...prevSelected, timeSlot]);
    }
  };

  // Function to handle cell hover
  const handleCellHover = (day, startTime, endTime) => {
    if (isMouseDown) {
      handleCellClick(day, startTime, endTime);
    }
  };

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const isSelectable = (day, hour, minute) => {
    if (day === "Saturday" || day === "Sunday") {
      return true; // Allow selection on Saturday and Sunday
    }

    const nonSelectableHours = [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
    ];
    const currentTime = `${hour}:${minute < 10 ? "0" : ""}${minute}`;

    return !nonSelectableHours.includes(currentTime);
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
            <h5 className=" font-base">Personal information</h5>
            <div>
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
                          type="text"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Courses enrolled */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Courses Enrolled{' '}
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <div className="row row-cols-3">
                          {courses.map((course) => (
                            <div key={course._id} className="col">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={course._id}
                                  name="coursesEnrolled"
                                  value={course._id}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor={course._id}>
                                  {course.title}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Class level */}
                  <div className="col-12">
                    <div className="row g-xl-0 align-items-center">
                      <div className="col-lg-4">
                        <h6 className="mb-lg-0">
                          Class Level{' '}
                          <span className="text-danger">*</span>
                        </h6>
                      </div>
                      <div className="col-lg-8">
                        <select
                          name="classLevel"
                          value={formData.classLevel}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select class</option>
                          {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem._id}>
                              {classItem.className}
                            </option>
                          ))}
                        </select>
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
                  {/* Parent's information */}
                  <div className="col-12">
                    <h5 className=" font-base">Parent's information</h5>
                    <div>
                      <div className="accordion-body mt-3">
                        <div className="row g-4">
                          {/* Parent Name */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Name <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="text"
                                  name="parentName"
                                  value={formData.parentName}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Parent Email */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Email <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="email"
                                  name="parentEmail"
                                  value={formData.parentEmail}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Parent Phone */}
                          <div className="col-12">
                            <div className="row g-xl-0 align-items-center">
                              <div className="col-lg-4">
                                <h6 className="mb-lg-0">
                                  Parent's Phone <span className="text-danger">*</span>
                                </h6>
                              </div>
                              <div className="col-lg-8">
                                <input
                                  type="text"
                                  name="parentPhone"
                                  value={formData.parentPhone}
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
                   {/* Availability */}
                   <div className="mb-3">
                    <h6
                      className="mb-lg-0"
                      id="heading-3"
                    >
                      AVAILABLE TIME SLOTS
                    </h6>
                    <div
                      
                    >
                      <div className=" mt-3">
                        <div className="table-responsive">
                          <table className="calendar-table">
                            <thead>
                              <tr>
                                <th className="time-column"></th>
                                {dayNames.map((day) => (
                                  <th key={day}>{day}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(20)].map((_, index) => {
                                const startHour =
                                  Math.floor(index / 2) + 10;
                                const startMinute =
                                  index % 2 === 0 ? "00" : "30";
                                const endHour =
                                  Math.floor((index + 1) / 2) + 10;
                                const endMinute =
                                  (index + 1) % 2 === 0 ? "00" : "30";
                                const startTime = `${startHour}:${startMinute}`;
                                const endTime = `${endHour}:${endMinute}`;

                                return (
                                  <tr key={index}>
                                    <td className="time-column">
                                      {startTime} - {endTime}
                                    </td>
                                    {dayNames.map((day, dayIndex) => (
                                      <td
                                        key={dayIndex}
                                        className={`
                      ${
                        !isSelectable(day, startHour, parseInt(startMinute))
                          ? "non-selectable-cell"
                          : ""
                      }
                      ${
                        selectedTimeSlots.some(
                          (slot) =>
                            slot.day === day &&
                            slot.startTime === startTime &&
                            slot.endTime === endTime
                        )
                          ? "selected"
                          : ""
                      }
                    `}
                                        onClick={() =>
                                          isSelectable(
                                            day,
                                            startHour,
                                            parseInt(startMinute)
                                          ) &&
                                          handleCellClick(
                                            day,
                                            startTime,
                                            endTime
                                          )
                                        }
                                        onMouseEnter={() =>
                                          isSelectable(
                                            day,
                                            startHour,
                                            parseInt(startMinute)
                                          ) &&
                                          handleCellHover(
                                            day,
                                            startTime,
                                            endTime
                                          )
                                        }
                                        onMouseDown={() =>
                                          setIsMouseDown(true)
                                        }
                                        onMouseUp={() =>
                                          setIsMouseDown(false)
                                        }
                                      ></td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Submit button */}
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;

