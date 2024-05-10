import React, { useEffect, useState, useRef } from 'react';
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import ChatBox from "../../../components/ChatBox/ChatBox";
import Backdrop from "@mui/material/Backdrop";
import GridLoader from "react-spinners/GridLoader";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { createChat, findChat } from '../../../api/ChatRequests';
import FooterClient from 'components/Footer';

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
  let [color, setColor] = useState("#399ebf");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useRef();
  const [currentChatId, setCurrentChatId] = useState(null);

  const userId = accessToken ? jwtDecode(accessToken).id : "";

  const getAvatarSrc = (teacher) => {
    //console.log('student', student);
    if ( teacher.picturePath !== "" && teacher.authSource === "local") {
      // If user has a custom picture path
      return `https://el-kindy-project-backend.onrender.com/assets/${teacher.picturePath}`;
    } else if (teacher && teacher.picturePath === "" && teacher.gender !== "") {
      // If user has no custom picture but has a gender
      return teacher.gender === "Male"
        ? "/assets/images/element/02.jpg"
        : "/assets/images/element/01.jpg";
    } else {
      // Default avatar if no picture path or gender is available
      return teacher.picturePath;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        setOpen(true);
        const response = await axiosPrivate.get(`/auth/getAllUserByRole/teacher`, {
          signal: controller.signal
        });
        setUsers(response.data.data);
        setOpen(false);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
        }
      }
    }

    getUsers();

    return () => {
      controller.abort();
    }
  }, [axiosPrivate]);

  const handleContact = async (id) => {
    try {
      const response = await axiosPrivate.get(`/chat/find/${userId}/${id}`);
      setExistingChat(response.data);

      if (response.status === 200 && response.data) {
        setCreatedChatId(response.data._id);
        if (response.data.members && response.data.members.length > 1) {
          setReciveeeeeerId(response.data.members[1]);
        } else {
          alert("Le chat n'a pas les membres requis.");
          return;
        }
      } else {
        const res = await createChat({ senderId: userId, receiverId: id }, axiosPrivate);
        if (res.status === 201 && res.data) {
          setCreatedChatId(res.data._id);
          if (res.data.members && res.data.members.length > 1) {
            setReciveeeeeerId(res.data.members[1]);
          } else {
            alert("Le chat créé n'a pas les membres requis.");
            return;
          }
        } else {
          alert("Une erreur s'est produite lors de la création du chat.");
          return;
        }
      }

      setShowChatBox(true); // Always show the chatbox when contacting a teacher
    } catch (error) {
      console.error("Erreur lors de la recherche ou de la création du chat :", error);
      alert("Une erreur s'est produite lors de la recherche ou de la création du chat.");
    }
  };

  return (
    <div>
      <NavBar />
      <TopBarTeacherStudent />
      <div className='container'>
        <div className="row">
          <SideBarStudent />
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
                <div className="card border-2 bg-transparent rounded-3">
                  <div className="row">
                    {users?.map((user) => (
                      <div className="col-lg-6" key={user._id}>
                        <div className="card shadow p-2 m-3">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img src={getAvatarSrc(user)} className="rounded-3" alt="user" style={{ width: "130px", height: "auto", borderRadius: "10%" }} />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <div className="d-sm-flex justify-content-sm-between mb-2 mb-sm-3">
                                  <div>
                                    <h5 className="card-title mb-0">{user.firstName} {user.lastName}</h5>
                                    <p className="small mb-2 mb-sm-0">{user.phoneNumber1}</p>
                                  </div>
                                </div>
                                <div className="d-sm-flex justify-content-sm-between align-items-center">
                                  <h6 className="text-orange mb-0">{user.roles}</h6>
                                  <ul className="list-inline mb-0 mt-3 mt-sm-0">
                                    <button onClick={() => {
                                      if (createdChatId) {
                                        setShowChatBox(false); // Close old chatbox if one exists
                                      }
                                      handleContact(user._id);
                                    }} className="btn btn-primary-soft">Contacter</button>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {showChatBox && (
                  <div className="ChatBox-container" >
                    <ChatBox
                      keyy={createdChatId}
                      chat={createdChatId}
                      currentUser={userId}
                      receiverId={reciveeeeeerId}
                      receivedMessage={receivedMessage}
                      onClose={() => setShowChatBox(false)}
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
      <FooterClient />
    </div>
  );
}

export default Index;