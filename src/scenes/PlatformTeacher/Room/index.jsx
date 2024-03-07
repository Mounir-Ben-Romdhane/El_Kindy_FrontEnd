import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import SideBarTeacher from 'components/SideBarTeacher';
import { useSelector } from "react-redux";
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
//import MeetingHomeStudent from '../src/scenes/PlatformStudent/MeetingHomeStudent';
import MeetingHomeStudent from '../../PlatformStudent/MeetingHomeStudent';

const Room = () => {
    const { roomId } = useParams()
    const currentUser = useSelector(state => state.user);
    const [meetingLink, setMeetingLink] = useState(""); // Ajout de l'état local
    const [showLinkInterface, setShowLinkInterface] = useState(false);
    const [showLinkInterfaceInMeetingHome, setShowLinkInterfaceInMeetingHome] = useState(false);

    const myMeeting = async (element) => {
        const appID = 984376862;
        const serverSecret = "7deae5e2a3a2361722b16d4867d0e1a3";
        console.log("Current User:", currentUser);
        if (currentUser && currentUser.firstName) {
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), currentUser.firstName);
            console.log("Kit Token:", kitToken);
            const zc = ZegoUIKitPrebuilt.create(kitToken);
            zc.joinRoom({
                container: element,
                sharedLinks: [
                    {
                        name: 'copy Link',
                        url: `http://localhost:3000/room/${roomId}`
                    }
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                showScreenSharingButton: true,// HTMLDivElement | string
            })
            setMeetingLink(`http://localhost:3000/room/${roomId}`);
            // Fonction pour afficher l'interface supplémentaire


        } else {
            console.error("User data is not available.");
        }
    }

    const showLinkInterfaceHandler = () => {
        
        setShowLinkInterface(true);
        setShowLinkInterfaceInMeetingHome(true);
    }
   

    return (


        <div>
            {/* **************** MAIN CONTENT START **************** */}
            <main>

                <NavBar />
                {/* hedha l partie l fou9aneya  */}
                <TopBarTeacherStudent />
                {/* =======================
  Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarTeacher />
                            <div className="col-xl-9">
                                {/* Student review START */}
                                <div className="card border bg-transparent rounded-3">

                                    {/* Reviews START */}
                                    <div className="card-body mt-2 mt-sm-4">
                                        {/* Review item START */}
                                        <div className="d-sm-flex">

                                            <div>
                                                <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                                    {/* Title */}
                                                    <div>
                                                        <h5 className="m-0">Making a meeting</h5>

                                                    </div>

                                                </div>

                                                {/* Button */}
                                                <div className="text-end">
                                                    <div ref={myMeeting} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Divider */}
                                        <hr />
                                        <div>
                                            {/* ... */}
                                            <div className="text-end">

                                                {/* Affichez le lien sous forme de lien cliquable */}
                                                <button class="btn btn-primary mb-0" onClick={showLinkInterfaceHandler} >Spread the link </button>

                                            </div>

                                            {showLinkInterface && (
                                                <div>
                                                    {/* Vous pouvez également inclure le lien cliquable ici si nécessaire */}
                                                    <p>The meeting link is : <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a></p>

                                                </div>
                                            )}
                                            {/* ... */}
                                        </div>
                                        {/* Divider */}

                                        {/* Review item END */}
                                    </div>
                                    {/* Reviews END */}

                                </div>
                                {/* Student review END */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* =======================
  Page content END */}


                <Footer />




            </main>
            {/* **************** MAIN CONTENT END **************** */}

        </div>




    );
};

export default Room;