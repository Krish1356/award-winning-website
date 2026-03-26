import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SkillAssessment from './pages/SkillAssessment';
import RaiseQuery from './pages/RaiseQuery';
import MentorDashboard from './pages/MentorDashboard';
import Mentors from './pages/Mentors';
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="mentors" element={<Mentors />} />

          {/* Student Routes */}
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="assessment" element={<SkillAssessment />} />
          <Route path="query/new" element={<RaiseQuery />} />

          {/* Mentor Routes */}
          <Route path="mentor/dashboard" element={<MentorDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
