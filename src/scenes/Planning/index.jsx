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
  const [courses, setCourses] = useState({ data: [] });
  const [classes, setClasses] = useState({ data: [] });
  const [teacherId, setTeacherId] = useState(null); // Ajoutez un état pour stocker l'ID de l'enseignant sélectionné

  // Définissez une fonction pour mettre à jour l'ID de l'enseignant sélectionné

  
  const [teachers, setTeachers] = useState([]); // Ajout d'un état pour les enseignants
  const [students, setStudents] = useState([]); // Ajout d'un état pour les étudiants
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [teachersData, setTeachersData] = useState([]); // Renommer l'état pour éviter la redondance
  const [studentsData, setStudentsData] = useState([]); // Renommer l'état pour éviter la redondance
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [editEventDetails, setEditEventDetails] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`https://el-kindy-project-backend.onrender.com/planning/${selectedEventId}`);
        setEventDetails(response.data);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
  
    if (selectedEventId) {
      fetchEventData();
    }
  }, [selectedEventId]);
  const handleSelectEvent = (event) => {
    setSelectedEventId(event.id); // Utilisez event.id au lieu de event._id
    setSelectedEvent(event);
    handleEditEvent(event); // Appel de handleEditEvent pour l'événement sélectionné
  };
  
  const handleEditEvent = (event) => {
    setSelectedEventId(event._id);
    setEditEventDetails(event);
    setShowModal(true);
  };
  const updateEvent = async (event) => {
    try {
      // Envoyer la requête de mise à jour à l'API
      const response = await axios.put(`https://el-kindy-project-backend.onrender.com/planning/${selectedEventId}`, event);
  
      // Extraire les données mises à jour de la réponse de l'API
      const updatedEventData = response.data;
  
      // Convertir les valeurs de start et end en objets Date JavaScript si nécessaire
      updatedEventData.start = new Date(updatedEventData.start);
      updatedEventData.end = new Date(updatedEventData.end);
    
      // Mettre à jour l'état des événements avec les données mises à jour
      setEvents(events.map((evt) => (evt._id === updatedEventData._id ? updatedEventData : evt)));
      
      console.log("Event updated successfully:", updatedEventData);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };
  
  
 
  
  
  
  
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 21; hour += 2) {
      // Incrémentation par 2 pour sauter une heure à chaque itération
      let startHour = moment({ hour });
      let endHour = moment({ hour }).add(1, "hour");
  
      // Vérifier si startHour et endHour sont définis
      if (startHour && endHour) {
        slots.push({
          title: `${startHour.format("HH[h]")} - ${endHour.format("HH[h]mm")}`,
          start: startHour.toDate(),
          end: endHour.toDate(),
        });
      }
  
      // Merge chaque paire de créneaux horaires en une seule plage horaire d'une heure
      if (hour < 19 && startHour && endHour) {
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
  
const MyEvent = ({ event }) => {
    // Vérifier d'abord si les noms des enseignants et des étudiants sont disponibles
    const teacher = teachers.find((t) => t._id === event.teacherId);
    const student = students.find((s) => s._id === event.studentId);
    const classe = Array.isArray(classes) ? classes.find((s) => s._id === event.classId) : null;

    // Si les noms des enseignants et des étudiants ne sont pas disponibles, affichez "Loading..."
   
    const className = classe ? `${classe.className}` : "";

    // Les noms des enseignants et des étudiants sont disponibles, construisez le composant avec les noms
    const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "";
    const studentName = student ? `${student.firstName} ${student.lastName}` : "";
    const displayStudent = event.studentId && studentName ? `Student: ${studentName}` : "";

    // Afficher "Teacher :" si l'enseignant est sélectionné, sinon afficher "Student :"
    const displayLabel = event.teacherId ? "Teacher :" : "Student :";

    // Afficher "Classe :" uniquement lorsque l'étudiant est sélectionné et que la classe est disponible
    const displayClass = event.classId && className ? `Classe: ${className}` : "";

    return (
        <div>
            <strong>{event.title}</strong>
            <div>{displayLabel} {event.teacherId ? teacherName : studentName}</div>

            {displayClass && <div>{displayClass}</div>}
            {displayStudent && <div>{displayStudent}</div>}
        </div>
    );
};

  
  
  // Effect hook pour charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersResponse, studentsResponse] = await Promise.all([
          axios.get("https://el-kindy-project-backend.onrender.com/auth/teachers"),
          axios.get("https://el-kindy-project-backend.onrender.com/auth/students"),
        ]);

        setTeachersData(teachersResponse.data);
        setStudentsData(studentsResponse.data);

        const eventsResponse = await axios.get(
          "https://el-kindy-project-backend.onrender.com/planning/all"
        );
        const loadedEvents = eventsResponse.data.map((event) => {
          const teacher = teachersResponse.data.find(
            (t) => t._id === event.teacherId
          );
          const student = studentsResponse.data.find(
            (s) => s._id === event.studentId
          );
          return {
            ...event,
            title: `${event.title}`,
            start: new Date(event.start),
            end: new Date(event.end),
          };
        });

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
      axios.get("https://el-kindy-project-backend.onrender.com/auth/teachers"),
      axios.get("https://el-kindy-project-backend.onrender.com/auth/students"),
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
      axiosPrivate
      .get("https://el-kindy-project-backend.onrender.com/classes/getAll") // Récupérez la liste des cours
      .then((response) => {
        setClasses(response.data); // Stockez les cours dans l'état
        console.log("claaassssss",response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
    axios
      .get("https://el-kindy-project-backend.onrender.com/salle")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooms", error);
      });
    axiosPrivate
      .get("https://el-kindy-project-backend.onrender.com/course/all") // Récupérez la liste des cours
      .then((response) => {
        setCourses(response.data); // Stockez les cours dans l'état
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses", error);
      });
   // Appel de l'API pour obtenir les informations de l'enseignant
axios.get(`https://el-kindy-project-backend.onrender.com/auth/getTeacher/${teacherId}`)
.then((response) => {
  // Une fois la réponse reçue, extrayez les classes enseignées par l'enseignant
  const teacher = response.data;
  const classesTaught = teacher.teacherInfo.classesTeaching;
  // Stockez les classes dans l'état ou faites tout autre traitement nécessaire
  setClasses(classesTaught);
  console.log("Classes enseignées par l'enseignant:", classesTaught);
})
.catch((error) => {
  console.error("Une erreur s'est produite lors de la récupération des informations de l'enseignant", error);
});

    

    axios
      .get("https://el-kindy-project-backend.onrender.com/planning/all")
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
            id: event._id,

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


  
  const deleteEvent = async (eventId) => {
    try {
      await axiosPrivate.delete(`https://el-kindy-project-backend.onrender.com/planning/${selectedEventId}`);
  
      const eventIndex = events.findIndex((evt) => evt._id === selectedEventId);
      if (eventIndex !== -1) {
        const updatedEvents = [...events];
        updatedEvents.splice(eventIndex, 1); // Supprimer l'événement à l'index trouvé
        setEvents(updatedEvents); // Mettre à jour l'état des événements avec la liste mise à jour
        console.log("Event deleted successfully:", selectedEventId);
      } else {
        console.warn("Event not found:", selectedEventId);
      }
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };
  

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
      teacherId: event.teacherId || null,
      classId: event.classId || null,
      studentId: event.studentId || null,

      // Assurez-vous que la valeur de teacherId ou classId soit correctement définie en fonction de la logique de votre application
    };
  
    console.log("Nouvel événement à sauvegarder :", newEvent);
  
    // Fusionner le nouvel événement avec les événements existants
    const updatedEvents = [...events, newEvent];
  
    console.log("Evénements avant la sauvegarde :", events);
  
    // Mettre à jour les événements dans le state
    setEvents(updatedEvents);
  
    const response = axios.post("https://el-kindy-project-backend.onrender.com/planning/add", newEvent);
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

  const addOrUpdateEvent = async (event) => {
    setShowModal(false);
    const roomId = event.resourceId;
  
    if (editEventDetails) {
      await updateEvent(event); // Passer l'ID de l'événement ici
    } else {
      await addNewEvent({ ...event, id: Math.random().toString() });
    }
    setEditEventDetails(null);
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
  onSelectEvent={handleSelectEvent}
  
  onSave={addOrUpdateEvent} // Définissez onSave pour gérer à la fois l'ajout et la modification d'événements
  selectable={true}
  resourceIdAccessor="resourceId"
  resourceTitleAccessor="resourceTitle"
  defaultView="day"
  min={new Date(0, 0, 0, 9, 0)}
  max={new Date(0, 0, 0, 21, 0)}
  step={30}
  timeslots={1}
  views={{ month: false, week: true, day: true }}
  resources={rooms.map((room) => ({
    resourceId: room._id,
    resourceTitle: room.name,
  }))}
  startAccessor="start"
  endAccessor="end"
  dayLayoutAlgorithm={"overlap"}
  style={{ height: "2500px" }}
  formats={formats}
  eventPropGetter={(event) => {
    return { style: { backgroundColor: event.color } };
  }}
/>

{showModal && (
 <Modal
 onClose={() => setShowModal(false)}
 onSave={addOrUpdateEvent}
 onDelete={deleteEvent} 

 eventDetails={{
   ...selectedEvent,
   rooms: rooms,
   courses: courses,
   classes: classes,

   resourceId: selectedEvent.resourceId
 }}  onSelectEvent={(event) => {
    console.log('Selected Event:', event);
    handleSelectEvent(event);
  }}
 courses={courses}
 teachers={teachers}
 students={students}
 classes={classes}

/>

)}




          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCalendar;