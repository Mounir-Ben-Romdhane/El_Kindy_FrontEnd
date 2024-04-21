import React from 'react';

const EventDetailsModal = ({ event, onClose ,  roomId, rooms }) => {
    console.log("Event in modal:", event); // Vérifiez que les données sont correctement passées
    const roomName = rooms.find(room => room._id === roomId)?.name;

    return (
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
        maxHeight: '80%',
        overflowY: 'auto'
      }}>
        <span className="close" onClick={onClose} style={{position: 'absolute', top: '5px', right: '10px', cursor: 'pointer', fontSize: '24px'}}>&times;</span>
        
        <h2 style={{marginBottom: '15px'}}>{event.title}</h2>
        <p><strong>Start:</strong> {event.start && new Date(event.start).toLocaleString()}</p>
        <p><strong>End:</strong> {event.end && new Date(event.end).toLocaleString()}</p>
        
        {/* Logique conditionnelle pour afficher le nom de la classe ou de l'élève */}
        <p><strong>Teacher Name:</strong> {event.teacherId.firstName} {event.teacherId.lastName}</p>
        {roomName && <p><strong>Room Name:</strong> {roomName}</p>}

      
      </div>
    );
};

export default EventDetailsModal;
