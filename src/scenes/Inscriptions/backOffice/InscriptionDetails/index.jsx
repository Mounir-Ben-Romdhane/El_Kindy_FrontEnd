import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInscription } from "services/inscriptionService/api";
import { ToastContainer, toast } from "react-toastify";

import useAxiosPrivate from "hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import NoData from "components/NoData";
import withReactContent from "sweetalert2-react-content";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";
const MySwal = withReactContent(Swal);


function Index() {
  const { id } = useParams();
  const [inscription, setInscription] = useState("");
  const [disponibilite, setDisponibilite] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //refresh token
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      setOpen(true);

      try {
        const inscription = await getInscription(id, axiosPrivate);
        //console.log("inscription", inscription.data);
        setInscription(inscription.data);
        setDisponibilite(inscription.data.disponibilite);
        setOpen(false);
      } catch (err) {
        setOpen(false);
        toast.error(
          "Error fetching inscription.",
          {
            autoClose: 1500,
            style: { color: "red" },
          }
        );
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const approveInscription = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to approve the payment for this inscription?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpen2(true);
        try {
          const response = await axiosPrivate.patch(`/inscription/${id}/approvepayment`);
          if (response.status === 200) {
            setOpen2(false);
            toast.success("Payment approved successfully!", {
              autoClose: 1000,
              style: { color: "green" },
            });
            
            setTimeout(() => {
              navigate("/inscriptionsList");
            }, 1500);
          }
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 400) {
            setOpen2(false);

            toast.error("Issue encountered during approval. Email already exist.", {
              autoClose: 1500,
              style: { color: "red" },
            });
          } else {
            setOpen2(false);

            toast.error(
              "Error approving payment. Please check the console for more details.",
              {
                autoClose: 1500,
                style: { color: "red" },
              }
            );
          }
        }
      }
    });
  };
  

 /*  const activateuser = async (id) => {
    try {
      const response = await axiosPrivate.patch(
        `/inscription/${id}/approve`
      );
      if (response.status === 200) {
        navigate("/inscriptionsList");
      }
    } catch (error) {
      console.error(error);
    }
  }; */

  const rejectInscription = async (id) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "Do you want to reject this inscription?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, reject it!",
      });
  
      if (result.isConfirmed) {
        setOpen2(true);
        const response = await axiosPrivate.patch(`/inscription/${id}/reject`);
        if (response.status === 200) {
          setOpen2(false);
            toast.success("Inscription rejected successfully!", {
              autoClose: 1000,
              style: { color: "green" },
            });
            
            setTimeout(() => {
              navigate("/inscriptionsList");
            }, 1500);
        }
      } 
    } catch (error) {
      setOpen2(false);
      toast.error("Inscription rejection error.", {
        autoClose: 1000,
        style: { color: "red" },
      });
      console.error(error);
    }
  };
  
  

  return (
    <div>
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <SideBar />
        {/* Page content START */}
        <div className="page-content">
          <TopBarBack />
          {open ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open2}
              >
                <GridLoader color={color} loading={loading} size={20} />
              </Backdrop>
          <ToastContainer />
          {/* Page main content START */}
          <div className="page-content-wrapper border">
          

            {/* Title */}
            <div className="row">
              <div className="col-12 mb-3">
                <h1 className="h3 mb-2 mb-sm-0">Instructor detail</h1>
              </div>
            </div>
            <div className="row g-4">
              {/* Personal information START */}
              <div className="col-xxl-7">
                <div className="card bg-transparent border rounded-3 h-100">
                  {/* Card header */}
                  <div className="card-header bg-light border-bottom">
                    <h5 className="card-header-title mb-0">
                      Personal Information
                    </h5>
                  </div>
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Profile picture */}
                    <div className="avatar avatar-xl mb-3">
                      <img
                        className="avatar-img rounded-circle border border-white border-3 shadow"
                        src="/assets/images/element/01.jpg"
                        alt
                      />
                    </div>
                    {/* Information START */}
                    <div className="row">
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Full Name:</span>
                            <span className="h6 mb-0">
                              {inscription.firstName} {inscription.lastName}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Email ID:</span>
                            <span className="h6 mb-0">{inscription.email}</span>
                          </li>
                          <li className="list-group-item">
                            <span>Gender</span>
                            <span className="h6 mb-0">
                              {inscription.gender}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Date of birth: </span>
                            <span className="h6 mb-0">
                              {inscription.dateOfBirth}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Location:</span>
                            <span className="h6 mb-0">{inscription.city}</span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-md-6">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Parent Name:</span>
                            <span className="h6 mb-0">
                              {inscription.parentName}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Parent profession:</span>
                            <span className="h6 mb-0">
                              {inscription.parentProfession}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Mobile Number N°1:</span>
                            <span className="h6 mb-0">
                              +256 {inscription.phoneNumber1}
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span>Mobile Number N°2:</span>
                            <span className="h6 mb-0">
                              +256 {inscription.phoneNumber2}
                            </span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item">
                            <span>Education:</span>
                            <span className="h6 mb-0">
                              {inscription.niveauEtude}
                            </span>
                          </li>
                        </ul>
                      </div>
                      {/* Information item */}
                      <div className="col-12">
                        <ul className="list-group list-group-borderless">
                          <li className="list-group-item d-flex">
                            <span>Message:</span>
                            <p className="h6 mb-0">
                            Hello El Kindy Conservatory, I have just submitted my pre-registration form and wanted to confirm that you have received it. Could you please confirm my submission and let me know the next steps? I am looking forward to starting my musical education with you. Thank you!

                            </p>
                          </li>
                        </ul>
                      </div>
                      {inscription.status === "pending" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "30px",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="btn btn-sm btn-success-soft"
                            style={{ width: "130px" }}
                            onClick={() => approveInscription(inscription._id)}
                          >
                            Payment Request
                          </button>
                          <button
                            className="btn btn-sm btn-danger-soft"
                            style={{ width: "120px" }}
                            onClick={() => rejectInscription(inscription._id)}
                          >
                            Reject Request
                          </button>
                          {/* <button
                            className="btn btn-sm btn-info-soft"
                            style={{ width: "120px" }}
                            onClick={() => activateuser(inscription._id)}
                          >
                            Activate user
                          </button> */}
                        </div>
                      )}
                    </div>
                    {/* Information END */}
                  </div>
                  {/* Card body END */}
                </div>
              </div>
              {/* Personal information END */}
              {/* Student status chart START */}
              <div className="col-xxl-5">
                <div className="row g-4">
                  {/* Active student START */}
                  <div className="col-md-6 col-xxl-12">
                    <div className="card bg-transparent border overflow-hidden">
                      {/* Card header */}
                      <div className="card-header bg-light border-bottom">
                        <h5 className="card-header-title mb-0">
                          Liked courses
                        </h5>
                      </div>
                      {/* Card body */}
                      <div className="card-body p-0">
                        <div className="d-sm-flex justify-content-between p-4">
                          <ul>
                            {inscription?.likedCourses?.map((course) => (
                              <li key={course.id}>{course.title}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Active student END */}
                  {/* Enrolled START */}
                  <div className="col-md-6 col-xxl-12">
                    <div className="card bg-transparent border overflow-hidden">
                      {/* Card header */}
                      <div className="card-header bg-light border-bottom">
                        <h5 className="card-header-title mb-0">
                          Available time
                        </h5>
                      </div>
                      {/* Card body */}
                      <div className="card-body p-0">
                        <div className="d-sm-flex justify-content-between p-4">
                          <ul>
                            {/* Sort and arrange disponibilite to start with Monday */}
                            {[...disponibilite]
                              .sort((a, b) => {
                                // Sort by day first
                                const daysOrder = [
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                  "Sunday",
                                ];
                                const indexA = daysOrder.indexOf(a.day);
                                const indexB = daysOrder.indexOf(b.day);
                                if (indexA < indexB) return -1;
                                if (indexA > indexB) return 1;
                                // If days are the same, sort by start time
                                if (a.startTime < b.startTime) return -1;
                                if (a.startTime > b.startTime) return 1;
                                return 0;
                              })
                              .map((slot, index) => (
                                <li key={index}>
                                  <span>{slot.day} : </span>
                                  <span>{slot.startTime} --&gt; </span>
                                  <span>{slot.endTime}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Enrolled END */}
                </div>
              </div>
              {/* Student status chart END */}
            </div>{" "}
            {/* Row END */}
          </div>
          {/* Page main content END */}
          </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
