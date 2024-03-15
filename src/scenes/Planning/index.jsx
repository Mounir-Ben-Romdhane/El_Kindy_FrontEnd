import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal"; // Assurez-vous d'avoir un composant Modal
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [courses, setCourses] = useState([]); // Ajoutez un état pour stocker les cours
  const [teachers, setTeachers] = useState([]); // Ajout d'un état pour les enseignants
  const [students, setStudents] = useState([]); // Ajout d'un état pour les étudiants
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [teachersData, setTeachersData] = useState([]); // Renommer l'état pour éviter la redondance
  const [studentsData, setStudentsData] = useState([]); // Renommer l'état pour éviter la redondance
  

  const axiosPrivate = useAxiosPrivate();

  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 21; hour += 2) {
      // Incrémentation par 2 pour sauter une heure à chaque itération
      let startHour = moment({ hour });
      let endHour = moment({ hour }).add(1, "hour");

      slots.push({
        title: `${startHour.format("HH[h]")} - ${endHour.format("HH[h]mm")}`,
        start: startHour.toDate(),
        end: endHour.toDate(),
      });

      // Merge chaque paire de créneaux horaires en une seule plage horaire d'une heure
      if (hour < 19) {
        let nextStartHour = moment({ hour }).add(1, "hour");
        let nextEndHour = moment({ hour }).add(2, "hour");

        slots.push({
          title: `${nextStartHour.format("HH[h]")} - ${nextEndHour.format(
            "HH[h]mm"
          )}`,
          start: nextStartHour.toDate(),
          end: nextEndHour.toDate(),
        });
      }
    }

    return slots;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teachers and students data
        const [teachersResponse, studentsResponse] = await Promise.all([
          axios.get("http://localhost:3001/auth/teachers"),
          axios.get("http://localhost:3001/auth/students"),
        ]);
        
        // Set the data and immediately use it to map events
        setTeachersData(teachersResponse.data);
        setStudentsData(studentsResponse.data);
        
        // Now fetch and map events
        const eventsResponse = await axios.get("http://localhost:3001/planning/all");
        const loadedEvents = eventsResponse.data.map((event) => {
          const teacher = teachersResponse.data.find(t => t._id === event.teacherId);
          const student = studentsResponse.data.find(s => s._id === event.studentId);
          return {
            ...event,
            title: `${event.title} Teacher: ${teacher ? teacher.firstName + " " + teacher.lastName : "Enseignant inconnu"}, Student: ${student ? student.firstName + " " + student.lastName : "Étudiant inconnu"}`,
            start: new Date(event.start),
            end: new Date(event.end),
          };
        });
  
        // Update events state
        setEvents(loadedEvents);
        
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoadingTeachers(false);
        setLoadingStudents(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/auth/teachers"),
      axios.get("http://localhost:3001/auth/students"),
    ])
      .then(([teachersResponse, studentsResponse]) => {
        setTeachers(teachersResponse.data);
        setStudents(studentsResponse.data);
        setLoadingTeachers(false);
        setLoadingStudents(false);
      })
      .catch((error) => {
        console.error("Error fetching teachers and students", error);
      });
  

    axios
      .get("http://localhost:3001/salle")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooms", error);
      });
      axiosPrivate.get("http://localhost:3001/course/all") // Récupérez la liste des cours
      .then((response) => {
        setCourses(response.data); // Stockez les cours dans l'état
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });


    axios
      .get("http://localhost:3001/planning/all")
      .then((response) => {
        const loadedEvents = response.data.map((event) => {
          // Assurez-vous que chaque événement a un ID unique.
          const color = event.color; // Utilisez l'ID de l'événement pour récupérer sa couleur
         
         
          return {
            ...event,
            title: `${event.title} `,

            start: new Date(event.start),
            end: new Date(event.end),
            resourceId: event.resourceId,
            color, // Stockez la couleur avec l'événement
            teacherId: event.selectedTeacherId,
            studentId: event.selectedStudentId,
          };
        });

        const timeSlots = generateTimeSlots();
        setEvents([...timeSlots, ...loadedEvents]); // Combinez les tranches horaires avec les événements chargés
        console.log("Événements mis à jour pour le calendrier:", [
          ...timeSlots,
          ...loadedEvents,
        ]);
      })
      .catch((error) => {
        console.error("There was an error fetching the events", error);
      });
  }, []);

  const handleSelectSlot = ({ start, end, resourceId }) => {
    setSelectedEvent({ start, end, resourceId });
    setShowModal(true);
  };

  const addNewEvent = (event) => {
    setShowModal(false);
    const roomId = event.roomId;
    const roomExists = rooms.some((room) => room._id === roomId);
    const selectedCourse = courses.data.find(
      (course) => course._id === event.courseId
    );

    if (!roomExists) {
      console.error("L'ID de la salle spécifiée n'existe pas.");
      return;
    }

    // Vérifiez si selectedCourse est défini avant d'accéder à sa propriété title
    const courseTitle = selectedCourse
      ? selectedCourse.title
      : "Titre de cours non trouvé";
     

    const newEvent = {
      id: events.length + 1, // Assurez-vous de donner un ID unique à chaque événement
      title: `${event.title} `,
      start: event.start,
      end: event.end,
      resourceId: roomId,
      color: event.color, // Utiliser la couleur sélectionnée du Modal
      teacherId: event.teacherId, // Utilisez event.teacherId au lieu de event.selectedTeacherId
      studentId: event.studentId, // Utilisez event.studentId au lieu de event.selectedStudentId
        };
    console.log("Nouvel événement à sauvegarder :", newEvent);

    // Fusionner le nouvel événement avec les événements existants
    const updatedEvents = [...events, newEvent];

    console.log("Evénements avant la sauvegarde :", events);

    // Mettre à jour les événements dans le state
    setEvents(updatedEvents);

    const response = axios.post("http://localhost:3001/planning/add", newEvent);
    const addedEvent = response.data;

    // Mise à jour de l'état avec le nouvel événement
    setEvents((prevEvents) => [...prevEvents, addedEvent]);
    console.log("Nouvel événement ajouté avec succès:", addedEvent);
  };
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH[h]mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      let startTime = localizer.format(start, "HH[h]mm", culture);
      let endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
      let startTime = localizer.format(start, "HH[h]mm", culture);
      let endTime = localizer.format(end, "HH[h]mm", culture);
      return `${startTime} - ${endTime}`;
    },
  };
  const MyEvent = ({ event }) => {
    if (loadingTeachers || loadingStudents) {
      return <div>Loading...</div>;
    }
  
    const teacher = teachers.find((t) => t._id === event.teacherId);
    const student = students.find((s) => s._id === event.studentId);
  
    const teacherName = teacher
      ? `${teacher.firstName} ${teacher.lastName}`
      : "Unknown Teacher";
    const studentName = student
      ? `${student.firstName} ${student.lastName}`
      : "Unknown Student";
  
    return (
      <div>
        <strong>{event.title}</strong>
        <div>Teacher: {teacherName}</div>
        <div>Student: {studentName}</div>
      </div>
    );
  };
  
  
  return (
    <div>
      <SideBar />
      <main>
        <div className="page-content">
          <TopBarBack />
          <div className="page-content-wrapper border">
            <Calendar
             components={{
              event: MyEvent,
            }}
              key={events.length}
              localizer={localizer}
              events={events}
              onSelectSlot={handleSelectSlot}
              selectable={true}
              resourceIdAccessor="resourceId"
              resourceTitleAccessor="resourceTitle"
              defaultView="day"
              min={new Date(0, 0, 0, 9, 0)}
              max={new Date(0, 0, 0, 21, 0)} // Fin à 21:00 PM
              step={30} // Définit des tranches horaires de 30 minutes
              timeslots={1}
              views={{ month: false, week: true, day: true }}
              resources={rooms.map((room) => ({
                resourceId: room._id,
                resourceTitle: room.name,
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100vh" }}
              formats={formats}
              eventPropGetter={(event) => {
                return { style: { backgroundColor: event.color } };
              }}
            />

            {showModal && (
              <Modal
                onClose={() => setShowModal(false)}
                onSave={addNewEvent}
                eventDetails={selectedEvent}
                rooms={rooms}
                courses={courses} // Passez les cours comme prop au composant Modal
                teachers={teachers} // Passez les enseignants
                students={students} // Passez les étudiants
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCalendar;
