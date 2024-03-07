





import {BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loadScripts } from './scriptLoader';


import React, { useEffect, useRef } from "react";
import AboutPage from "../src/scenes/AboutPage";
import HomePage from "../src/scenes/HomePage";
import SignUp from "./scenes/Authentification/SignUp";
import SignIn from "./scenes/Authentification/SignIn";
import ForgetPassword from "./scenes/Authentification/ForgetPassword";
import ResetPassword from "./scenes/Authentification/ResetPassword";
import EmailVerify from "./scenes/Authentification/EmailVerify";
import NotFound from "./scenes/NotFound";
import AdminHomePage from "../src/scenes/AdminHomePage";
import ListCoursesPage from "../src/scenes/Courses/ListCoursesPage";
import Stage from "../src/scenes/Stage/StageHome";
import ListEventsPage from "../src/scenes/EventsPage/ListEventPage";
import AddEventPage from "../src/scenes/EventsPage/AddEventPage";
import AddCoursePage from "../src/scenes/Courses/AddCoursePage";
import ListCategoryPage from "../src/scenes/Category/ListCategoryPage";
import AddCategoryPage from "../src/scenes/Category/AddCategoryPage";
import EditCategoryPage from "../src/scenes/Category/EditCategoryPage";
import ListStage from "../src/scenes/Stage/ListStage";
import AddStage from "../src/scenes/Stage/AddStage";
import EditStage from "../src/scenes/Stage/EditStage";
import ListClassPage from "../src/scenes/Classe/ListClassPage";
import EditClassPage from "../src/scenes/Classe/EditClassPage";
import AddClassPage from "../src/scenes/Classe/AddClassPage";
import Category from "../src/scenes/CategoryHome";
import InscriptionPage from "./scenes/Inscriptions/InscriptionPage";
import InscriptionList from "./scenes/Inscriptions/backOffice/listInscriptions";

import MeetingHomeStudent from './scenes/PlatformStudent/MeetingHomeStudent';
import DashbordTeacher from './scenes/PlatformTeacher/DashbordTeacher'
import HomePagee from '../src/scenes/PlatformTeacher/HomePagee';
import DashbordStudent from './scenes/PlatformStudent/DashbordStudent'
import Room from '../src/scenes/PlatformTeacher/Room';

import Chat from '../src/scenes/Chat/Chat'


import InscriptionDetails from "scenes/Inscriptions/backOffice/InscriptionDetails";

import EditCourse from "scenes/Courses/EditCoursePage";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import { setLogout } from "../src/state";
import ContactPage from "scenes/ContactPage";

function App() {
  const isAuth = Boolean(useSelector((state) => state.accessToken));
  


  const scriptsLoaded = useRef(false);
  /*'/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
      '/assets/vendor/bootstrap/dist/js/bootstrap.bundle.js',
      '/assets/vendor/tiny-slider/tiny-slider.js',
      '/assets/vendor/glightbox/js/glightbox.js',
      '/assets/vendor/purecounterjs/dist/purecounter_vanilla.js',
      '/assets/vendor/choices/js/choices.min.js',
      '/assets/vendor/aos/aos.js',
      '/assets/vendor/quill/js/quill.min.js',
      '/assets/vendor/stepper/js/bs-stepper.min.js', */



  useEffect(() => {
    const scripts = [
      "/assets/vendor/quill/js/quill.min.js",
      "/assets/vendor/glightbox/js/glightbox.js",
      "/assets/vendor/purecounterjs/dist/purecounter_vanilla.js",
      "/assets/js/functions.js",
    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []);

  return (

     
    <div>
      <Routes>
        {/* auth routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:id?/:token?"
          element={<ResetPassword />}
        />
        <Route
          path="/verify-account/:id/verify/:token"
          element={<EmailVerify />}
        />

        {/* public routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={<HomePage /> }
        />
        <Route path="/contact-us" element={<ContactPage />} />

        <Route
          path="/category"
          element={ <Category />}
        />

        <Route
          path="/inscription/:id?"
          element={<InscriptionPage />}
          />

        {/* PRIVATE ROUTE */}
        <Route
          path="/dashboard-admin"
          element={
            <PrivateRoute
              element={<AdminHomePage />}
              requiredRoles={["superAdmin", "admin"]}

            />
          }
        />

        <Route
          path="/inscriptionsList"
          element={
            <PrivateRoute
              element={<InscriptionList />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/inscriptionDetails/:id"
          element={
            <PrivateRoute
              element={<InscriptionDetails />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />

        <Route
          path="/listCourses"
          element={
            <PrivateRoute
              element={<ListCoursesPage />}
              requiredRoles={["superAdmin", "admin"]}
            />
          }
        />
           <Route 
              path="/dashbordTeacher" 
              element={isAuth ? <DashbordTeacher/> : <Navigate to="/" /> } 
            />

<Route 
              path="/meetingHomeS" 
              element={isAuth ? <MeetingHomeStudent/> : <Navigate to="/" /> } 
            />

<Route 
              path="/dashbordStudent" 
              element={isAuth ? <DashbordStudent/> : <Navigate to="/" /> } 
            />
                
                <Route 
              path="/homeMeet" 
              element={isAuth ? <HomePagee /> : <Navigate to="/" /> } 
            />
             <Route path="/room/:roomId"
              element={isAuth ? <Room /> : <Navigate to="/" /> } 
          />
        
        <Route
          path="/edit-course/:id"
          element={isAuth ? <EditCourse /> : <Navigate to="/" />}
        />

        <Route
          path="/ListStage"
          element={isAuth ? <ListStage /> : <Navigate to="/" />}
        />
        <Route
          path="/AddStage"
          element={isAuth ? <AddStage /> : <Navigate to="/" />}
        />
        <Route
          path="/EditStage/:id"
          element={isAuth ? <EditStage /> : <Navigate to="/" />}
        />
        <Route
          path="/stage"
          element={isAuth ? <Stage /> : <Navigate to="/" />}
        />


        <Route
          path="/listEvents"
          element={isAuth ? <ListEventsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/addEvent"
          element={isAuth ? <AddEventPage /> : <Navigate to="/" />}
        />
        <Route
          path="/addCourse"
          element={isAuth ? <AddCoursePage /> : <Navigate to="/" />}
        />

        <Route
          path="/listClasse"
          element={isAuth ? <ListClassPage /> : <Navigate to="/" />}
        />
        <Route
          path="/add-classe"
          element={isAuth ? <AddClassPage /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-classe/:id"
          element={isAuth ? <EditClassPage /> : <Navigate to="/" />}
        />

        <Route
          path="/chat"
          element={isAuth ? <Chat /> : <Navigate to="../auth" />}
        />
            
          
          <Route path="/about" element={<AboutPage />}/>
            <Route  path="/listCategories" 
              element={isAuth ? <ListCategoryPage /> : <Navigate to="/" /> } 
          />
             <Route  path="/add-category" 
              element={isAuth ? <AddCategoryPage /> : <Navigate to="/" /> } 
          />
          <Route path="/edit-category/:id"
              element={isAuth ? <EditCategoryPage /> : <Navigate to="/" /> } />

        <Route path="/*" element={<NotFound />} />

      </Routes>
    </div>
  );
}

// PrivateRoute component to check authentication and required roles
function PrivateRoute({ element, requiredRoles }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const userRoles = accessToken ? jwtDecode(accessToken).roles : [];

  // If user is authenticated and has required roles, render the element
  if (accessToken && userRoles.some((role) => requiredRoles.includes(role))) {
    return element;
  } else {
    dispatch(setLogout());
  }

  // If user is not authenticated, redirect to login
  return <Navigate to="/" replace />;
}

export default App;
