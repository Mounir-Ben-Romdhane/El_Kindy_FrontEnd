import SideBar from 'components/SideBar'
import TopBarBack from 'components/TopBarBack'
import React from 'react'

function TeachersDashboard() {
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
            <h1>Teachers Dashboard</h1>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeachersDashboard