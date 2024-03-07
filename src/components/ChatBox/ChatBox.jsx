import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [picturePath, setPicturePath] = useState(null); // State to store selected image

  const handleChange = (newMessage) => {
    setNewMessage(newMessage)
  }

  // Handle key down event (e.g., pressing Enter key)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  // Send Message
  const handleSend = async () => {

    // Si une image a été sélectionnée
    let imagePath = null;
    if (picturePath) {
      imagePath = URL.createObjectURL(picturePath); // Obtenir le chemin de l'image
    }

    const formData = new FormData();
    formData.append("chatId", chat._id);
    formData.append("senderId", currentUser);
    formData.append("text", newMessage);
    formData.append("picturePath", imagePath); // Utiliser le chemin de l'image

    const receiverId = chat.members.find((id) => id !== currentUser);

    setSendMessage({ senderId: currentUser, text: newMessage, chatId: chat._id, image: picturePath, receiverId });

    try {
      const { data } = await addMessage(formData);
      setMessages([...messages, data]);
      setNewMessage("");
      setPicturePath(null);
    } catch (error) {
      console.log(error);
    }
  };


  // Receive Message from parent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage])

  const scroll = useRef();
  const imageRef = useRef();

  // Function to handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPicturePath(file); // Store selected image in state
  }
  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* chat-header */}
          <div className="chat-header">
            <div className="follower" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={userData?.picturePath || "defaultProfile.png"}
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <div className="name" style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
                <span>
                  {userData?.firstName} {userData?.lastName}
                </span>
              </div>
            </div>
            <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
                marginTop: "20px",
              }}
            />
          </div>
          {/* chat-body */}
          <div className="chat-body">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${message.senderId === currentUser ? "own" : "received"}`}
                >
                  <span>{message.text}</span>
                  
                  {message.picturePath && !message.text && ( // Ajoutez cette condition
        <img src={message.picturePath} alt="Uploaded" />
      )}
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            ) : (
              <span>No messages yet...</span>
            )}
            <div ref={scroll}></div> {/* For scrolling to the bottom */}
          </div>
          {/* chat-sender */}
          <div className="chat-sender">
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {picturePath && (
              <img
                src={URL.createObjectURL(picturePath)}
                alt="Selected"
                style={{ width: "50px", height: "50px" }} // Définissez la taille de l'image comme vous le souhaitez
              />
            )}
            <div className="send-button2" onClick={handleSend}>
              Send
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
              onChange={handleImageChange}
            />
          </div>

        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
      )}
    </div>

  );
};

export default ChatBox;
