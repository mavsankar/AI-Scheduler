import React, { useState } from 'react';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import InputForm from './components/InputForm/InputForm';
import OutputScreen from './components/OutputScreen/OutputScreen';
import Loader from './components/Helpers/Loader';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [outputLoading, setOutputLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    setOutputLoading(true);
    fetch('https://ai-scheduler-backend.mavsankar.com/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then(response => response.json())
      .then(data => {
        setSchedule(data.weekly_schedule);
        setOutputLoading(false);
        navigate('/output');
      })
      .catch((error) => {
        setOutputLoading(false);
        console.error('Error:', error);
      });
  };

  const handleFileUpload = (scheduleData) => {
    setSchedule(scheduleData);
    navigate('/output');
  };

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create"
          element={
            <Container>
              <InputForm onSubmit={handleFormSubmit} isLoading={outputLoading} />
              {outputLoading && <div className='loader-container'> <Loader /> </div>}
            </Container>
          }
        />
        <Route
          path="/view"
          element={
              <OutputScreen weeklySchedule={schedule} onFileUpload={handleFileUpload} />
          }
        />
        <Route
          path="/output"
          element={<OutputScreen weeklySchedule={schedule} />}
        />
      </Routes>
  );
}

export default App;
