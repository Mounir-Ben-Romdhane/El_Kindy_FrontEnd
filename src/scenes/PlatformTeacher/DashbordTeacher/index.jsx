
import React from 'react';
import SideBarTeacher from 'components/SideBarTeacher';

import TopBarTeacherStudent from  'components/TopBarTeacherStudent';


function Index() {

  

    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
            <main>
                {/* hedha l partie l fou9aneya  */}
                < TopBarTeacherStudent />
                {/* =======================
Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                           <SideBarTeacher />
                            {/* Main content START */}
                           
                            {/* Main content END */}
                        </div>{/* Row END */}
                    </div>
                </section>
                {/* =======================
Page content END */}

            </main>
            {/* **************** MAIN CONTENT END **************** */}

        </div>
    )
}

export default Index