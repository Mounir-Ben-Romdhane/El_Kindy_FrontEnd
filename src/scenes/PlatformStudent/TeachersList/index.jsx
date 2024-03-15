import React, { useEffect, useState, useRef  } from 'react';
import NavBar from "components/NavBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import SideBarStudent from 'components/SideBarStudent';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import ChatBox from "../../../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { createChat, findChat } from '../../../api/ChatRequests';

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

  const userId = accessToken ? jwtDecode(accessToken).id : "";

  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`/auth/getAllUserByRole/teacher`, {
          signal: controller.signal
        });
        setUsers(response.data);
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
  }, [accessToken, dispatch]);

  // Dans votre composant Index
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
        const res = await createChat({ senderId: userId, receiverId: id });
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
    } catch (error) {
      console.error("Erreur lors de la recherche ou de la création du chat :", error);
      alert("Une erreur s'est produite lors de la recherche ou de la création du chat.");
      return;
    }
  };
  
  useEffect(() => {
    if (createdChatId) {
      setShowChatBox(true);
    }
  }, [createdChatId]);


 // Connect to Socket.io
 useEffect(() => {
  socket.current = io("ws://localhost:8800");
  socket.current.emit("new-user-add", userId);
  socket.current.on("get-users", (users) => {
    setOnlineUsers(users);
  });
}, []);

// Send Message to socket server
useEffect(() => {
  if (sendMessage!==null) {
    socket.current.emit("send-message", sendMessage);}
}, [sendMessage]);

// Get the message from socket server
useEffect(() => {
  socket.current.on("recieve-message", (data) => {
    setReceivedMessage(data);
  });
}, []);


  return (
    <div>
      <NavBar />
      <TopBarTeacherStudent />
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <SideBarStudent />
            <div className="container col-md-9 mt-3">
              <div className="row">
                {users.map((user) => (
                  <div className="col-lg-6" key={user._id}>
                    <div className="card shadow p-2 mb-3">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img src={user?.picturePath ? user.picturePath : process.env.PUBLIC_URL + '/defaultProfile.png'} alt="user" style={{ width: "130px", height: "auto", borderRadius: "10%" }} />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <div className="d-sm-flex justify-content-sm-between mb-2 mb-sm-3">
                              <div>
                                <h5 className="card-title mb-0">{user.firstName} {user.lastName}</h5>
                                <p className="small mb-2 mb-sm-0">{user.position}</p>
                              </div>
                              <span className="h6 fw-light">4.3<i className="fas fa-star text-warning ms-1" /></span>
                            </div>
                            <p className="text-truncate-2 mb-3">{user.description}</p>
                            <div className="d-sm-flex justify-content-sm-between align-items-center">
                              <h6 className="text-orange mb-0">{user.roles}</h6>
                              <ul className="list-inline mb-0 mt-3 mt-sm-0">
                                <li className="list-inline-item"> <a className="mb-0 me-1 text-facebook" href="#"><i className="fab fa-fw fa-facebook-f" /></a> </li>
                                <li className="list-inline-item"> <a className="mb-0 me-1 text-instagram-gradient" href="#"><i className="fab fa-fw fa-instagram" /></a> </li>
                                <button onClick={() => handleContact(user._id)} className="btn btn-primary">Contacter</button>
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

            {showChatBox && ( // Rendre le ChatBox uniquement si showChatBox est vrai
              <div className="ChatBox-container" >
                <ChatBox
                  keyy={createdChatId}
                  chat={createdChatId}
                  currentUser={userId}
                  setSendMessage={() => { }}
                  receiverId={reciveeeeeerId}
                  
                  receivedMessage={null}
                  onClose={() => setShowChatBox(false)} // Fonction de rappel pour fermer le ChatBox
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index;
