import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import React, {useEffect, useRef, useState} from "react";

import { loadScripts } from '../../scriptLoader';


function Index() {
 
  
  
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
            <div className="row">
              <div className="col-12 mb-3">
                <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
              </div>
            </div>
          </div>
          {/* Page main content END */}
          
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </div>
  );
}

export default Index;