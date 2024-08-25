import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Box, Button, Input } from '@mui/material';
import chroma from 'chroma-js';
import GoalLegend from '../GoalLegend/GoalLegend';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './OutputScreen.css';
import html2canvas from 'html2canvas';
import LoadFile from '../Helpers/LoadFile';


// Generate distinct colors for each goal
const generateDistinctColors = (numColors) => {
  return chroma.scale('Spectral').mode('lch').colors(numColors);
};

const generateGoalColors = (goals) => {
  const distinctGoals = Array.from(new Set(goals));
  const colors = generateDistinctColors(distinctGoals.length);

  return distinctGoals.reduce((acc, goal, index) => {
    acc[goal] = colors[index];
    return acc;
  }, {});
};

// Function to get all unique time slots across the week
const getTimeSlots = (weeklySchedule) => {
  const timeSlots = new Set();
  weeklySchedule.days.forEach(day => {
    day.schedule.forEach(item => {
      timeSlots.add(item.time);
    });
  });
  return Array.from(timeSlots).sort();
};

const OutputScreen = ({ weeklySchedule }) => {

  const [schedule, setSchedule] = useState(weeklySchedule);
  const [goalColors, setGoalColors] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      // Here you should parse jsonData to match the structure of your weeklySchedule
      const parsedSchedule = parseScheduleData(jsonData);
      // Here you should parse the goal colors from the second sheet of the workbook and set it in the state

      const goalColorsSheet = workbook.Sheets[workbook.SheetNames[1]];
      const goalColorsData = XLSX.utils.sheet_to_json(goalColorsSheet, { header: 1 });

      const formattedGoalColors = goalColorsData.reduce((acc, [goal, color]) => {
        if (goal == 'Goal' && color == 'Color Code') return acc;
        acc[goal] = color;
        return acc;
      }, {});

      setGoalColors(formattedGoalColors);
      setSchedule(parsedSchedule);
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to determine if the current time matches the given time slot
  const isActiveTimeSlot = (time, day_of_week) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().substring(0, 5); // Extract "HH:MM"

    return currentDay === day_of_week && currentTime >= time && currentTime < addMinutes(time, 30);
  };

  // Utility function to add minutes to a time string
  const addMinutes = (time, minutesToAdd) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes + minutesToAdd);
    return newTime.toTimeString().substring(0, 5);
  };


  const parseScheduleData = (data) => {
    // The first row contains the headers, which include time and days of the week
    const [header, ...rows] = data;

    // Extract day information from the header
    const days = header.slice(1).map((dayInfo, index) => {
      const [day_of_week, date] = dayInfo.split(' - ');

      // Extract the schedule for this day
      const schedule = rows
        .map(row => {
          const time = row[0]; // First column is time
          const activityGoal = row[index + 1]; // The activity and goal for this day at this time

          if (activityGoal) {
            const [activity, goal] = activityGoal.split(' (');
            return {
              time,
              activity: activity.trim(),
              goal: goal ? goal.replace(')', '').trim() : '', // Remove the closing parenthesis and trim
            };
          }

          return null; // Return null if no activity is found for this time slot
        })
        .filter(Boolean); // Remove any null entries

      return {
        day_of_week,
        date,
        schedule,
      };
    });

    return { days };
  };

  const exportToExcel = (weeklySchedule, timeSlots, goalColors) => {
    const worksheetData = [];

    // Create header row for the schedule
    const headerRow = ["Time", ...weeklySchedule.days.map(day => `${day.day_of_week}`)];
    worksheetData.push(headerRow);

    // Fill data rows for the schedule
    timeSlots.forEach(time => {
      const row = [time];
      weeklySchedule.days.forEach(day => {
        const activity = day.schedule.find(item => item.time === time);
        row.push(activity ? `${activity.activity} (${activity.goal})` : "Same as above / Leisure");
      });
      worksheetData.push(row);
    });

    // Create worksheet and workbook
    const scheduleWorksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, scheduleWorksheet, "Weekly Schedule");

    // Create worksheet for goal colors
    const goalColorsData = [["Goal", "Color Code"]];
    Object.entries(goalColors).forEach(([goal, color]) => {
      if (goal) {
        goalColorsData.push([goal, color]);
      }
      else {
        goalColorsData.push(["", "#f0f0f0"]);
      }
    });

    const goalColorsWorksheet = XLSX.utils.aoa_to_sheet(goalColorsData);
    XLSX.utils.book_append_sheet(workbook, goalColorsWorksheet, "Goal Colors");

    // Export to Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Weekly_Schedule_with_Colors.xlsx");
  };

  // Function to export the schedule as an image
  const exportToImage = () => {
    const tableElement = document.getElementById('schedule-table');
    const tableContainer = tableElement.querySelector('.MuiTableContainer-root'); // Get the TableContainer element

    // Save original styles
    const originalOverflow = tableContainer.style.overflow;
    const originalHeight = tableContainer.style.height;

    // Set the styles to show all content
    tableContainer.style.overflow = 'visible';
    tableContainer.style.height = 'auto';

    // Use html2canvas to capture the entire table, including previously scrollable content
    html2canvas(tableElement, {
      scale: 2, // Adjust scale for better resolution
      useCORS: true, // Enable cross-origin images
    }).then(canvas => {
      // Restore original styles
      tableContainer.style.overflow = originalOverflow;
      tableContainer.style.height = originalHeight;

      // Create a download link
      const link = document.createElement('a');
      link.download = 'Weekly_Schedule.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  if (!schedule) {
    return (<Paper style={{ padding: '16px', margin: '16px' }}>
      <LoadFile onFileUpload={handleFileUpload} />
    </Paper>);
  }
  // Proceed with rendering the schedule as before
  const allGoals = schedule.days?.flatMap(day => day.schedule.map(item => item.goal));
  if (goalColors && Object.keys(goalColors).length === 0) {
    setGoalColors(generateGoalColors(allGoals));
  }
  const timeSlots = getTimeSlots(schedule);

  return (
    <>
      <Paper style={{ padding: '16px', margin: '16px', display: 'flex', alignItems: 'center' }}>
      <LoadFile onFileUpload={handleFileUpload} /> <div style={{margin: '10px'}}>{'<'}-- Upload Excel File To Load the Schedule</div>
    </Paper>
      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Weekly Schedule
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToExcel(schedule, timeSlots, goalColors)}
          style={{ margin: '16px' }}
        >
          Download as Excel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportToImage()}
          style={{ margin: '16px' }}
        >
          Download as Image
        </Button>

        <div id='schedule-table'>
          <GoalLegend goalColors={goalColors} />

          <TableContainer component={Paper} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Time</strong></TableCell>
                  {schedule.days.map((day, index) => (
                    <TableCell key={index} align="center"><strong>{day.day_of_week}</strong><br />{day.date}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((time, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell><strong>{time}</strong></TableCell>
                    {schedule.days.map((day, colIndex) => {
                      const currentActivity = day.schedule.find(item => item.time === time);

                      // If the current slot is empty, mark it as "Leisure" or "Same as Above"
                      const displayContent = currentActivity
                        ? (
                          <>
                            <strong>{currentActivity.activity}</strong><br />
                            <Typography variant="body2">{currentActivity.goal}</Typography>
                          </>
                        ) : (
                          <Typography variant="body2" style={{ color: '#999' }}>Same as above / Leisure</Typography>
                        );
                      const isActive = isActiveTimeSlot(time, day.day_of_week);

                      return (
                        <TableCell
                          key={colIndex}
                          align="center"
                          style={{
                            backgroundColor: currentActivity ? goalColors[currentActivity.goal] : '#f0f0f0',
                            border: !isActive ? '1px solid #ddd' : undefined, // Default border for non-active cells
                          }}
                          className={isActive ? 'blinking' : ''} // Apply blinking border if active
                        >
                          {displayContent}
                        </TableCell>


                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

      </Paper>
    </>
  );
};

export default OutputScreen;
