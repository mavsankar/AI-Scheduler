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
    // append values to local storage list schedules
    let storedValues = localStorage.getItem('weeklyScheduleForm');
    if (storedValues === null) {
      storedValues = [];
    } else {
      storedValues = JSON.parse(storedValues);
    }
    // check if values already exist in storedValues based in values.schedule_name
    const index = storedValues.findIndex((item) => item.schedule_name === values.schedule_name);
    if (index !== -1) {
      storedValues[index] = values;
    } else {
      storedValues.push(values);
    }
    localStorage.setItem('weeklyScheduleForm', JSON.stringify(storedValues));

    setOutputLoading(true);
    fetch(`https://ai-scheduler-backend.mavsankar.com/schedule?model_name=${values.model_name}`, {
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
        alert('Error Generating the Schedule. Please try again later.');
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
            {outputLoading ? <div className='loader-container'> <Loader /> </div> : <InputForm onSubmit={handleFormSubmit} isLoading={outputLoading} />}
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
