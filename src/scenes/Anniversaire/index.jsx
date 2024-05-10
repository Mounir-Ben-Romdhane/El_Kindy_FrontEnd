import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'react-calendar/dist/Calendar.css';
import SideBar from "components/SideBar";
import TopBarBack from "components/TopBarBack";
import { Backdrop } from "@mui/material";
import { GridLoader } from "react-spinners";
function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  let [color, setColor] = useState("#399ebf");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    setOpen(true);
    try {
      const response = await axios.get('https://el-kindy-project-backend.onrender.com/api/birthdays');
      // Transformer les dates pour ne récupérer que le mois et le jour
      const transformedBirthdays = response.data.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        // Ignorer l'année et garder uniquement le mois et le jour
        dateOfBirth: user.dateOfBirth.substring(5, 10), // Extraction du mois et du jour
      }));
      setBirthdays(transformedBirthdays);
      setOpen(false);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      setError(error.message);
      setOpen(false);
    }
  };

  const events = birthdays.map(user => ({
    title: `${user.firstName} ${user.lastName}`,
    // Utiliser la date actuelle avec le mois et le jour de l'anniversaire
    date: new Date().getFullYear() + '-' + user.dateOfBirth,
  }));

  return (
    <div >
      <main>
      <SideBar />
      <div className="page-content">
        <TopBarBack />
        {/* Utilisation de Backdrop pour afficher un chargement */}
        {open ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <GridLoader color={color} loading={loading} size={20} />
          </Backdrop>
        ) : error ? (
          // Affichage de l'erreur
          <h2>Error: {error}</h2>
        ) : (
          <div className="page-content-wrapper border">
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open2}
            >
              <GridLoader color={color} loading={loading} size={20} />
            </Backdrop>
            <div>
              <h1>Birthday Calendar</h1>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
              />
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

export default App;
