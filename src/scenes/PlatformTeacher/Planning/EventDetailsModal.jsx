import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EventDetailsModal = ({ event, onClose, roomId, rooms, courses, courseId, teachers, teacherId }) => {
  const courseName = courseId ? (courses.data.find(course => course._id === courseId)?.title || "N/A") : "N/A";
  const roomName = roomId ? (rooms.find(room => room._id === roomId)?.name || "N/A") : "N/A";
  const teacher = teacherId ? (teachers.find((teacher) => teacher._id === teacherId) || {}) : {};
  const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "N/A";
  
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{courseName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: '15px' }}>
          <strong>Start:</strong> {event.start && new Date(event.start).toLocaleString()}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>End:</strong> {event.end && new Date(event.end).toLocaleString()}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Room Name:</strong> {roomName}
        </div>
       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;