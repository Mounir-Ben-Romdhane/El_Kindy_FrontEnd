import React , { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Assurez-vous d'importer Link depuis react-router-dom
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { ToastContainer, toast } from "react-toastify";

function Index() {


    
        const [classes, setClasses] = useState([]);
      
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/classes/getAll", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data || []); // Assurez-vous de gérer les cas où data.data peut être undefined
                    console.log(data)
                } else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
    
      
        useEffect(() => {
          fetchData();
        }, []);

        const handleDelete = async (id) => {
            try {
              await fetch(`http://localhost:3001/classes/${id}`, {
                method: "DELETE",
              });
        
              toast.success("classe deleted successfully !!", {
                autoClose: 1500,
                style: {
                  color: "green", // Text color
                },
              });
              setClasses((prevStages) =>
                prevStages.filter((classes) => classes._id !== id)
              ); // Assuming `_id` is the unique identifier
            } catch (error) {
              console.error("Error deleting calsse:", error);
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
  
            {/* Page main content START */}
            <div className="page-content-wrapper border">
              <ToastContainer />
              {/* Title */}
              <div className="row mb-3">
                <div className="col-12 d-sm-flex justify-content-between align-items-center">
                  <h1 className="h3 mb-2 mb-sm-0">Classe</h1>
                  <Link to="/AddAllClasse" className="btn btn-sm btn-primary me-1 mb-1 mb-md-0">Add class</Link>

                </div>
              </div>
  
              {/* Render text if courses array is empty */}
             
                <div className="card bg-transparent border">
                  {/* Card header START */}
                  <div className="card-header bg-light border-bottom">
                    {/* Search and select START */}
                    <div className="row g-3 align-items-center justify-content-between">
                      {/* Search bar */}
                      <div className="col-md-8">
                        <form className="rounded position-relative">
                          <input
                            className="form-control bg-body"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                        </form>
                      </div>
                      {/* Select option */}
                      <div className="col-md-3">
                        {/* Short by filter */}
                        <form>
                          <select
                            className="form-select  border-0 z-index-9"
                            aria-label=".form-select-sm"
                          >
                            <option value>Sort by</option>
                            <option>Newest</option>
                            <option>Oldest</option>
                            <option>Accepted</option>
                            <option>Rejected</option>
                          </select>
                        </form>
                      </div>
                    </div>
                    {/* Search and select END */}
                  </div>
                  {/* Card header END */}
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Course table START */}
                    <div className="table-responsive border-0 rounded-3">
                      {/* Table START */}
                      <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
                        {/* Table head */}
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            <th scope="col" className="border-0 rounded-start">
                            Class Name
                            </th>
                            <th scope="col" className="border-0 ">
                            Capacity
                            </th>
                            <th scope="col" className="border-0">
                            Order
                            </th>
                            
                            
                            <th scope="col" className="border-0 rounded-end">
                              Action
                            </th>
                          </tr>
                        </thead>
                        {/* Table body START */}
                        <tbody style={{ whiteSpace: "nowrap" }}>
                      {classes.map((classe) => {
                        return (
                          <tr key={classe._id}>
                            <td>{classe.className}</td>
                            <td>{classe.capacity}</td>
                            <td>{classe.ordre}</td>
                            <td>
                            <Link to={`/EditAllClasse/${classe._id}`} className="btn btn-success-soft btn-round me-1 mb-1 mb-md-0">
            <i class="bi bi-pencil-square"></i>
        </Link>
                              <button
                                className="btn btn-danger-soft btn-round me-1 mb-1 mb-md-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title=""
                                data-bs-original-title="Delete"
                                onClick={() => handleDelete(classe._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                        {/* Table body END */}
                      </table>
                      {/* Table END */}
                    </div>
                    {/* Course table END */}
                  </div>
                  {/* Card body END */}
                  {/* Card ffooter START */}
                  <div className="card-footer bg-transparent pt-0">
                    {/* Pagination START */}
                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                      {/* Content */}
  
                      {/* Pagination */}
                      <nav
                        className="d-flex justify-content-center mb-0"
                        aria-label="navigation"
                      >
                        <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                          <li className="page-item mb-0">
                            <a className="page-link" href="#" tabIndex={-1}>
                              <i className="fas fa-angle-left" />
                            </a>
                          </li>
                          <li className="page-item mb-0">
                            <a className="page-link" href="#">
                              1
                            </a>
                          </li>
                          <li className="page-item mb-0 active">
                            <a className="page-link" href="#">
                              2
                            </a>
                          </li>
                          <li className="page-item mb-0">
                            <a className="page-link" href="#">
                              3
                            </a>
                          </li>
                          <li className="page-item mb-0">
                            <a className="page-link" href="#">
                              <i className="fas fa-angle-right" />
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                    {/* Pagination END */}
                  </div>
                  {/* Card footer END */}
                </div>
              
              {/* Card END */}
            </div>
            {/* Page main content END */}
          </div>
          {/* Page content END */}
        </main>
        {/* **************** MAIN CONTENT END **************** */}
      </div>
    );
  
}
export default Index