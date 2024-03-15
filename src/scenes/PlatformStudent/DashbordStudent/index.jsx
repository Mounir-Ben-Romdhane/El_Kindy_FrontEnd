import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
import React from 'react';
import SideBarStudent from  'components/SideBarStudent';
import TopBarTeacherStudent from  'components/TopBarTeacherStudent';

function index() {
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
                           <SideBarStudent />
                            
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

export default index