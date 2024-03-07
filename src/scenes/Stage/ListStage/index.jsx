import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Index() {

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0); // Initialize with total number of entries
  const entriesPerPage = 8; // Number of entries to display per page

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await fetch("https://el-kindy-project-backend.onrender.com/stage");
        const { stages } = await response.json();
        setStages(stages);
        setTotalEntries(stages.length); // Update the totalEntries state
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };

    fetchStages();
  }, []);


  const handleEditClick = (stage) => {
    setSelectedStage(stage);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://el-kindy-project-backend.onrender.com/stage/${id}`, {
        method: 'DELETE',
      });
      // Filter out the deleted stage from the state
      setStages(prevStages => prevStages.filter(stage => stage._id !== id)); // Assuming `_id` is the unique identifier
    } catch (error) {
      console.error("Error deleting stage:", error);
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

            {/* Title */}
            <div className="row mb-3">
              <div className="col-12 d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-2 mb-sm-0">Internship</h1>
                <Link to="/addStage" className="btn btn-sm btn-primary mb-0">Create an Intership</Link>
              </div>
            </div>


            {/* Card START */}
            <div className="card bg-transparent border">
              {/* Card header START */}
              <div className="card-header bg-light border-bottom">
                {/* Search and select START */}
                <div className="row g-3 align-items-center justify-content-between">
                  {/* Search bar */}
                  <div className="col-md-8">
                    <form className="rounded position-relative">
                      <input className="form-control bg-body" type="search" placeholder="Search" aria-label="Search" />
                      <button className="btn bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit"><i className="fas fa-search fs-6 " /></button>
                    </form>
                  </div>
                  {/* Select option */}
                  <div className="col-md-3">
                    {/* Short by filter */}
                    <form>
                      <select className="form-select  border-0 z-index-9" aria-label=".form-select-sm">
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
                    <thead>
                      <tr>{/*{stage.title}*/}
                        <th scope="col" className="border-0 rounded-start">Internship Title</th>
                        <th scope="col" className="border-0">Image</th>
                        <th scope="col" className="border-0">startDate</th>
                        <th scope="col" className="border-0">finishDate</th>
                        <th scope="col" className="border-0">description</th>
                        <th scope="col" className="border-0 rounded-end">Action</th>
                      </tr>
                    </thead>
                    {/* Table body START */}
                    <tbody>

                      {/* Table row */}
                      {/* Table row */}
                      {stages.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((stage, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center position-relative">
                              <h6 className="table-responsive-title mb-0 ms-2">{stage.title}</h6>
                            </div>
                          </td>
                          <td>
                            <div className="w-60px">
                              <td>
                                {/* Affichage de l'image */}
                                {stage.picturePath ? (
                                  <img
                                    src={`http://localhost:3001/assets/${stage.picturePath}`}
                                    alt=""
                                    style={{ width: '30px', height: 'auto' }} // Adjust size as needed
                                  />

                                ) : (
                                  <span>No Image</span>
                                )}
                              </td>                              </div>
                          </td>
                          <td>{stage.startDate}</td>
                          <td>{stage.finishDate}</td>
                          <td>{stage.description.length > 50 ? `${stage.description.substring(0, 50)}...` : stage.description}</td>

                          <td>

                          <Link to={`/EditStage/${stage._id}`}  className="btn btn-sm btn-dark me-1 mb-1 mb-md-0"  onClick={() => handleEditClick(stage)}>
          Edit
        </Link>
                           <button onClick={() => handleDelete(stage._id)}className="btn btn-sm btn-danger me-1 mb-1 mb-md-0">Delete</button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Table body END */}
                  </table>
                  {/* Table END */}
                </div>
                {/* Course table END */}
              </div>
              {/* Card body END */}
              {/* Card footer START */}
              <div className="card-footer bg-transparent pt-0">
                {/* Pagination START */}
                <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                  {/* Content */}
                  <p className="mb-0 text-center text-sm-start">Showing {(currentPage - 1) * 8 + 1} to {Math.min(currentPage * 8, totalEntries)} of {totalEntries} entries</p>
                  {/* Pagination */}
                  <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
                    <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                      {/* Previous page button */}
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} tabIndex={-1}>
                          <i className="fas fa-angle-left" />
                        </button>
                      </li>
                      {/* Page numbers */}
                      {Array.from({ length: Math.ceil(totalEntries / 8) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                        </li>
                      ))}
                      {/* Next page button */}
                      <li className={`page-item ${currentPage * 8 >= totalEntries ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                          <i className="fas fa-angle-right" />
                        </button>
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
  )
}

export default Index