import React, { useEffect, useState, useRef } from 'react';
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherTeacher from 'components/TopBarTeacherStudent';
import ChatBox from "../../../components/ChatBox/ChatBox";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { createChat, findChat } from '../../../api/ChatRequests';
import Footer from 'components/Footer';
function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const [users, setUsers] = useState([]);
  const [existingChat, setExistingChat] = useState([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const [createdChatId, setCreatedChatId] = useState(null);
  const [reciveeeeeerId, setReciveeeeeerId] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
  const [receiverData, setReceiverData] = useState(null);
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = accessToken ? jwtDecode(accessToken).id : "";
  //the other user of the chat
  const [receiverId, setReceiverId] = useState(null);


  
  const getAvatarSrc = (student) => {
    console.log('student', student);
    if ( student.picturePath !== "" ) {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${student.picturePath}`;
    } else if (student && student.picturePath === "" && student.gender !== "") {
      // If user has no custom picture but has a gender
      return student.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return student.picturePath;
    }
  };


  //get the list of student taught by a teachher
  const getAllStudents = async () => {

    setOpen(true);

  try {
    const response = await axiosPrivate.get(`/auth/getStudentsTaughtByTeacher/${userId}`);
    setReceiverData(response.data);
    setOpen(false);
  } catch (err) {
      console.error(err);
      setOpen(false);
  }
}

  useEffect(() => {
    

    getAllStudents();
  }, [receiverId, axiosPrivate]);
  // Dans votre composant Index

  useEffect(() => {
    if (createdChatId) {
      setShowChatBox(true);
    }
  }, [createdChatId]);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosPrivate.get(`/chat/getChats/${userId}`);
        setUsers(response.data); // Supposons que chaque objet de chat inclut maintenant otherUser
       // console.log('users', response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, [userId, axiosPrivate]);


  // Dans votre composant Index
  const handleContact = async (id) => {
    try {
      const response = await axiosPrivate.get(`/chat/find/${userId}/${id}`);

      if (response.status === 200 && response.data) {
        setCreatedChatId(response.data._id);
        const otherUserId = response.data.members.find(member => member !== userId);
        setReciveeeeeerId(otherUserId); // Id de l'autre membre du chat
        setReceiverId(otherUserId); // Mise à jour pour déclencher la récupération des données de l'utilisateur
      } else {
        alert("Une erreur s'est produite lors de la recherche du chat.");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche ou de la création du chat :", error);
      alert("Une erreur s'est produite lors de la recherche du chat.");
      return;
    }
  };

  const handleCloseChatBox = () => {
    setShowChatBox(false);
    setCreatedChatId(null);
    setReciveeeeeerId("");
    setReceivedMessage(null);
    // Reset any other relevant state here
  };

  return (
    <div>
      <NavBar />
      <TopBarTeacherTeacher />
  
      <div className='container'>
        <div className="row">
          <SideBarTeacher />
          <div className="col-xl-9">
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
              <>
                
                <div className="card border-2 p-3 bg-transparent rounded-3">
                  <div className="row">
                    {users.filter(chat => chat.otherUser).map((chat) => (
                      <div className="col-lg-6" key={chat._id}>
                        <div className="card shadow p-2 m-2">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img src={getAvatarSrc(chat.otherUser)} className="rounded-3" alt="user" style={{ width: "130px", height: "auto", borderRadius: "10%" }} />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title mb-0">{chat.otherUser?.firstName} {chat.otherUser?.lastName}</h5>


                              </div>
                              <div className="d-sm-flex justify-content-sm-between align-items-center p-3">
                              <h6 className="text-orange mb-0 m-2 ">Student</h6>
                                <ul className="list-inline mb-0 mt-3 mt-sm-0">
                                  <button onClick={() => handleContact(chat.otherUser?._id)} className="btn btn-primary-soft">Contacter</button>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
                {showChatBox && ( // Render the ChatBox only if showChatBox is true
                  <div className="ChatBox-container" >
                    <ChatBox
                      keyy={createdChatId}
                      chat={createdChatId}
                      currentUser={userId}
                      receiverId={reciveeeeeerId}
                      receivedMessage={receivedMessage}
                      onClose={handleCloseChatBox}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
  <br></br>
  <br />
      <Footer />
    </div>
  );
  
}

export default Index;