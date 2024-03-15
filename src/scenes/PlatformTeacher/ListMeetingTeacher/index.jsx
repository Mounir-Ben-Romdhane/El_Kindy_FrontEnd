// Importez React et useState, useEffect depuis 'react'
import React, { useEffect, useState } from 'react';
// Importez les composants nécessaires
import SideBarTeacher from 'components/SideBarTeacher';
import TopBarTeacherStudent from 'components/TopBarTeacherStudent';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Index = () => {

    const [meetings, setMeetings] = useState([]);
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get('https://el-kindy-project-backend.onrender.com/meeting/getAll');
                console.log('Réponse de l\'API :', response.data);
                setMeetings(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réunions :', error);
            }
        };

        fetchMeetings();
    }, []);

    return (
        <div>
            {/* **************** MAIN CONTENT START **************** */}
            <main>
                {/* hedha l partie l fou9aneya  */}
                <TopBarTeacherStudent />
                {/* =======================
                    Page content START */}
                <section className="pt-0">
                    <div className="container">
                        <div className="row">
                            <SideBarTeacher />
                            {/* Main content START */}
                            <div className="col-xl-9">
                                {/* Meeting list START */}
                                <div className="card border bg-transparent rounded-3">
                                    {/* Header START */}
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="row justify-content-between align-middle">
                                            {/* Title */}
                                            <div className="col-sm-6">
                                                <h3 className="card-header-title mb-2 mb-sm-0">List Meeting</h3>
                                            </div>
                                            {/* Short by filter */}
                                            <div className="col-sm-4">
                                                <form>
                                                    <select className="form-select js-choice z-index-9 bg-white" aria-label=".form-select-sm">
                                                        <option value>Sort by date</option>
                                                        <option>★★★★★ (5/5)</option>
                                                        <option>★★★★☆ (4/5)</option>
                                                        <option>★★★☆☆ (3/5)</option>
                                                        <option>★★☆☆☆ (2/5)</option>
                                                        <option>★☆☆☆☆ (1/5)</option>
                                                    </select>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Header END */}
                                    {/* Meetings START */}
                                    <div className="card-body mt-2 mt-sm-4">
                                        {meetings.map((meeting, index) => (
                                            <div key={meeting._id} className="meeting-item">
                                                <h5 className="mb-1">{meeting.title}</h5>
                                                <p className="text-muted mb-2">{meeting.description}</p>
                                                <div className="meeting-details">
                                                    <p><strong>Date:</strong> {meeting.date}</p>
                                                    <p><strong>Heure de début:</strong> {meeting.startTime}</p>
                                                    <p><strong>Heure de fin:</strong> {meeting.endTime}</p>
                                                    <p><strong>Lien:</strong>  <Link to={meeting.meetingLink}>{meeting.meetingLink}</Link></p>
                                                </div>
                                                {/* Ajouter une séparation sauf pour le dernier élément */}
                                                {index !== meetings.length - 1 && <hr />}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Meetings END */}

                                </div>
                                {/* Meeting list END */}
                            </div>
                            {/* Main content END */}
                        </div>
                    </div>
                </section>
                {/* Page content END */}
            </main>
            {/* MAIN CONTENT END */}
        </div>
    );
};

export default Index;
