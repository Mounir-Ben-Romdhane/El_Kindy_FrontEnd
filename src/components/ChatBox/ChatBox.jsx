import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import "./ChatBox.css";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const ChatBox = (props) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [picturePath, setPicturePath] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const socket = useRef();

  const accessToken = useSelector((state) => state.accessToken);
  const refreshTokenState = useSelector((state) => state.refreshToken);
  const userId = accessToken ? jwtDecode(accessToken).id : "";
  const dispatch = useDispatch();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleClose = () => {
    setIsChatBoxOpen(false);
    props.onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(props.keyy);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (props.chat !== null) fetchMessages();
  }, [props.chat, accessToken, dispatch]);

  const getUserData = async () => {
    try {
      const { data } = await axiosPrivate.get(`/auth/${props.receiverId}`);
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //scroll 2 last msg
  useEffect(() => {
    if (props.chat !== null && userData === null) {
      getUserData();
    }
  }, [props.chat, userData]);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    // Vérifier si le nouveau message n'est pas vide
    if (newMessage.trim() === "" && !picturePath) {
      return; // Ne rien faire si le message est vide et qu'aucune image n'est sélectionnée
    }

    // Utiliser le chemin de l'image directement
    const imagePath = picturePath ? URL.createObjectURL(picturePath) : null;

    const formData = new FormData();
    formData.append("chatId", props.keyy);
    formData.append("senderId", props.currentUser);
    formData.append("text", newMessage);
    formData.append("picturePath", imagePath); // Utiliser le chemin de l'image

    try {
      const { data } = await addMessage(formData);
      setMessages([...messages, data]);
      setNewMessage("");
      setPicturePath(null);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === props.keyy) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const scroll = useRef();
  const imageRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicturePath(file);
  };


  
  return (
    <>
      {isChatBoxOpen && (
        <div>
          <div className="chat-header  sticky-header " style={{ padding: "0.8rem", borderBottom: "1px solid #ccc" }} >
            <div
              className="follower"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={userData?.picturePath || "defaultProfile.png"}
                alt="Profile"
                className="followerImage"
                style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              />
              <div className="name " style={{ fontSize: "1rem", fontFamily: "sans-serif", color: 'black', marginLeft: "10px" }}>
                <span>
                  {userData?.firstName} {userData?.lastName}
                </span>
              </div>
              <div
                className="close-button"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "black",
                }}
              >
                x
              </div>
            </div>
          </div>
          <div className="ChatBox-container">
            {props.chat ? (
              <>
                <div className="chat-body my-5">
                  {messages && messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message ${message.senderId === props.currentUser
                          ? "own"
                          : "received"
                          }`}
                      >
                        <span>{message.text}</span>
                        {message.picturePath && !message.text && (
                          <div className="image-container">
                            <img src={message.picturePath} alt="Uploaded" style={{ width: "200px", height: "100px" }} />
                            <span className="message-time">{format(message.createdAt)}</span>
                          </div>
                        )}
                        {!message.picturePath && (
                          <span className="message-time">{format(message.createdAt)}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="style-de-non-message">No messages yet...</span>
                  )}
                  <div ref={scroll}></div>
                </div>
              </>
            ) : (
              <span className="chatbox-empty-message">
                Appuyez sur une conversation pour commencer...
              </span>
            )}
          </div>

          <div className="chat-sender input-fixed " style={{ padding: "0.8rem", borderTop: "1px solid #ccc" }}>
            <h1>{props.key}</h1>
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} onKeyDown={handleKeyDown} />
            {picturePath && (
              <img src={URL.createObjectURL(picturePath)} alt="Selected" style={{ width: "40px", height: "40px" }} />
            )}
            <div className="send-button2" onClick={handleSend}>
              <i className="bi bi-send"></i>
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
