// src/components/InputForm.js
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, MenuItem, Grid, InputAdornment, Typography, Box } from '@mui/material';
import {
    GradientButton,
    StyledMenuItem,
    StyledGrid,
    StyledInputAdornment,
    StyledTypography,
    StyledBox
} from '../Helpers/StylizedComponents';

import './InputForm.css';

const InputForm = ({ onSubmit, isLoading }) => {
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        // Retrieve all keys from localStorage to find available schedules
        const schedules = JSON.parse(localStorage.getItem('weeklyScheduleForm'));
        if (schedules) {
            setAvailableSchedules(schedules);
        }
    }, []);

    let initialValues = selectedSchedule ?? {
        schedule_name: '',
        personal_information: {
            name: '',
            age: '',
            preferred_wake_up_time: '',
            preferred_bedtime: '',
            current_lifestyle_habits: {
                exercise: '',
                diet: '',
                sleep: '',
            },
            work_hours: {
                start_time: '',
                end_time: '',
            },
        },
        goals: [],
        tasks: [],
        constraints: {
            unavailable_time_blocks: [],
            daily_energy_levels: {
                morning: '',
                afternoon: '',
                evening: '',
            },
        },
        preferences: {
            activity_variety: 'medium'
        },
        model_name: null,
    };

    const validationSchema = Yup.object({
        schedule_name: Yup.string().required('Required'),
        personal_information: Yup.object({
            name: Yup.string().required('Required'),
            age: Yup.number().min(0, 'Must be 0 or more').required('Required'),
            preferred_wake_up_time: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
            preferred_bedtime: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
            work_hours: Yup.object({
                start_time: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
                end_time: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
            }).required('Required'),
        }).required('Required'),
        goals: Yup.array().of(
            Yup.object({
                goal_name: Yup.string().required('Required'),
                goal_type: Yup.string().required('Required'),
                deadline: Yup.string().required('Required'),
                priority_level: Yup.string().oneOf(['high', 'medium', 'low']).required('Required')
            })
        ),
        tasks: Yup.array().of(
            Yup.object({
                goal_name: Yup.string().required('Required'),
                task_name: Yup.string().required('Required'),
                task_frequency: Yup.string().oneOf(['daily', 'weekly', 'monthly']).required('Required'),
                estimated_duration: Yup.object({
                    duration: Yup.number().required('Required'),
                    unit: Yup.string().oneOf(['minutes']).required('Required'),
                }).required('Required'),
                preferred_time_of_day: Yup.string().oneOf(['morning', 'afternoon', 'evening']),
            })
        ),
        constraints: Yup.object({
            unavailable_time_blocks: Yup.array().of(
                Yup.object({
                    day: Yup.string().oneOf(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).required('Required'),
                    start_time: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
                    end_time: Yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Required'),
                })
            ),
            daily_energy_levels: Yup.object({
                morning: Yup.string().oneOf(['low', 'medium', 'high']).required('Required'),
                afternoon: Yup.string().oneOf(['low', 'medium', 'high']).required('Required'),
                evening: Yup.string().oneOf(['low', 'medium', 'high']).required('Required'),
            }).required('Required'),
        }).required('Required'),
        preferences: Yup.object({
            activity_variety: Yup.string().oneOf(['high', 'medium', 'low']),

        }),
        model_name: Yup.string().required('Required'),
    });

    const handleScheduleChange = (event) => {
        if (event.target.value === '') {
            setSelectedSchedule(null);
        }
        else {
            setSelectedSchedule(event.target.value);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            {({ errors, touched }) => (
                <Form >
                    <Box mb={4}>
                        <Typography textAlign={'center'} variant="h2" component="h2" gutterBottom>
                            Create/Update Schedule Preferences
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Use Existing Schedule Preferences?
                        </Typography>
                        <StyledGrid container spacing={3}>
                            <StyledGrid item xs={12}>

                                <Field
                                    as={TextField}
                                    label="Select an Existing Schedule Preference"
                                    select
                                    fullWidth
                                    onChange={handleScheduleChange}
                                    value={selectedSchedule ?? ''}
                                >
                                    <StyledMenuItem value="">
                                        <em>None</em>
                                    </StyledMenuItem>
                                    {availableSchedules.map((schedule) => (
                                        <StyledMenuItem key={schedule} value={schedule}>
                                            {schedule.schedule_name}
                                        </StyledMenuItem>
                                    ))}
                                </Field>
                            </StyledGrid>
                        </StyledGrid>
                    </Box>
                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Personal Information
                        </Typography>
                        <StyledGrid container spacing={3}>
                            <StyledGrid item xs={12} mb={2}>
                                <Field
                                    name="schedule_name"
                                    as={TextField}
                                    label="Schedule Name"
                                    fullWidth
                                    error={touched.schedule_name && !!errors.schedule_name}
                                    helperText={touched.schedule_name && errors.schedule_name}
                                />
                            </StyledGrid>
                        </StyledGrid>
                        <StyledGrid container spacing={3}>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.name"
                                    as={TextField}
                                    label="Name"
                                    fullWidth
                                    error={touched.personal_information?.name && !!errors.personal_information?.name}
                                    helperText={touched.personal_information?.name && errors.personal_information?.name}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.age"
                                    as={TextField}
                                    label="Age"
                                    type="number"
                                    fullWidth
                                    error={touched.personal_information?.age && !!errors.personal_information?.age}
                                    helperText={touched.personal_information?.age && errors.personal_information?.age}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.preferred_wake_up_time"
                                    as={TextField}
                                    label="Preferred Wake-Up Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.preferred_wake_up_time && !!errors.personal_information?.preferred_wake_up_time}
                                    helperText={touched.personal_information?.preferred_wake_up_time && errors.personal_information?.preferred_wake_up_time}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.preferred_bedtime"
                                    as={TextField}
                                    label="Preferred Bedtime"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.preferred_bedtime && !!errors.personal_information?.preferred_bedtime}
                                    helperText={touched.personal_information?.preferred_bedtime && errors.personal_information?.preferred_bedtime}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.exercise"
                                    as={TextField}
                                    label="Describe your current exercise situation (Optional)"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.exercise && !!errors.personal_information?.current_lifestyle_habits?.exercise}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.exercise && errors.personal_information?.current_lifestyle_habits?.exercise}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.diet"
                                    as={TextField}
                                    label="Describe your current diet situation (Optional)"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.diet && !!errors.personal_information?.current_lifestyle_habits?.diet}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.diet && errors.personal_information?.current_lifestyle_habits?.diet}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.sleep"
                                    as={TextField}
                                    label="Describe your current sleep situation (Optional)"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.sleep && !!errors.personal_information?.current_lifestyle_habits?.sleep}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.sleep && errors.personal_information?.current_lifestyle_habits?.sleep}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.work_hours.start_time"
                                    as={TextField}
                                    label="Work Start Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.work_hours?.start_time && !!errors.personal_information?.work_hours?.start_time}
                                    helperText={touched.personal_information?.work_hours?.start_time && errors.personal_information?.work_hours?.start_time}
                                />
                            </StyledGrid>
                            <StyledGrid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.work_hours.end_time"
                                    as={TextField}
                                    label="Work End Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.work_hours?.end_time && !!errors.personal_information?.work_hours?.end_time}
                                    helperText={touched.personal_information?.work_hours?.end_time && errors.personal_information?.work_hours?.end_time}
                                />
                            </StyledGrid>
                        </StyledGrid>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Goals
                        </Typography>
                        <FieldArray
                            name="goals"
                            render={(arrayHelpers) => (
                                <Box>
                                    {arrayHelpers.form.values.goals.map((goal, index) => (
                                        <Box key={index} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                            <StyledGrid container spacing={3}>
                                                <StyledGrid item xs={12}>
                                                    <Field
                                                        name={`goals.${index}.goal_name`}
                                                        as={TextField}
                                                        label="Goal Name"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_name && !!errors.goals?.[index]?.goal_name}
                                                        helperText={touched.goals?.[index]?.goal_name && errors.goals?.[index]?.goal_name}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12}>
                                                    <Field
                                                        name={`goals.${index}.goal_description`}
                                                        as={TextField}
                                                        label="Goal Description"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_description && !!errors.goals?.[index]?.goal_description}
                                                        helperText={touched.goals?.[index]?.goal_description && errors.goals?.[index]?.goal_description}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.goal_type`}
                                                        as={TextField}
                                                        label="Goal Type"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_type && !!errors.goals?.[index]?.goal_type}
                                                        helperText={touched.goals?.[index]?.goal_type && errors.goals?.[index]?.goal_type}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.deadline`}
                                                        as={TextField}
                                                        label="Deadline"
                                                        type="date"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        error={touched.goals?.[index]?.deadline && !!errors.goals?.[index]?.deadline}
                                                        helperText={touched.goals?.[index]?.deadline && errors.goals?.[index]?.deadline}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.priority_level`}
                                                        as={TextField}
                                                        label="Priority Level"
                                                        select
                                                        fullWidth
                                                        error={touched.goals?.[index]?.priority_level && !!errors.goals?.[index]?.priority_level}
                                                        helperText={touched.goals?.[index]?.priority_level && errors.goals?.[index]?.priority_level}
                                                    >
                                                        <StyledMenuItem value="high">High</StyledMenuItem>
                                                        <StyledMenuItem value="medium">Medium</StyledMenuItem>
                                                        <StyledMenuItem value="low">Low</StyledMenuItem>
                                                    </Field>
                                                </StyledGrid>
                                            </StyledGrid>
                                            <Box mt={2}>
                                                <Button onClick={() => arrayHelpers.remove(index)} color="secondary" variant="outlined">
                                                    Remove Goal
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button onClick={() => arrayHelpers.push({})} color="primary" variant="contained">
                                        Add Goal
                                    </Button>
                                </Box>
                            )}
                        />
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Tasks
                        </Typography>
                        <FieldArray
                            name="tasks"
                            render={(arrayHelpers) => (
                                <Box>
                                    {arrayHelpers.form.values.tasks.map((task, index) => (
                                        <Box key={index} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                            <StyledGrid container spacing={3}>
                                                <StyledGrid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.goal_name`}
                                                        as={TextField}
                                                        label="Goal Name"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.goal_name && !!errors.tasks?.[index]?.goal_name}
                                                        helperText={touched.tasks?.[index]?.goal_name && errors.tasks?.[index]?.goal_name}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.task_name`}
                                                        as={TextField}
                                                        label="Task Name"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_name && !!errors.tasks?.[index]?.task_name}
                                                        helperText={touched.tasks?.[index]?.task_name && errors.tasks?.[index]?.task_name}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.task_description`}
                                                        as={TextField}
                                                        label="Task Description"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_description && !!errors.tasks?.[index]?.task_description}
                                                        helperText={touched.tasks?.[index]?.task_description && errors.tasks?.[index]?.task_description}
                                                    />
                                                </StyledGrid>
                                                <StyledGrid item xs={12} sm={6}>
                                                    <Field
                                                        name={`tasks.${index}.task_frequency`}
                                                        as={TextField}
                                                        label="Task Frequency"
                                                        select
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_frequency && !!errors.tasks?.[index]?.task_frequency}
                                                        helperText={touched.tasks?.[index]?.task_frequency && errors.tasks?.[index]?.task_frequency}
                                                    >
                                                        <StyledMenuItem value="daily">Daily</StyledMenuItem>
                                                        <StyledMenuItem value="weekly">Weekly</StyledMenuItem>
                                                        <StyledMenuItem value="monthly">Monthly</StyledMenuItem>
                                                    </Field>
                                                </StyledGrid>
                                                <StyledGrid item xs={12} sm={6}>
                                                    <Field
                                                        name={`tasks.${index}.estimated_duration.duration`}
                                                        as={TextField}
                                                        label="Estimated Duration"
                                                        type="number"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.estimated_duration?.duration && !!errors.tasks?.[index]?.estimated_duration?.duration}
                                                        helperText={touched.tasks?.[index]?.estimated_duration?.duration && errors.tasks?.[index]?.estimated_duration?.duration}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <StyledInputAdornment position="end">
                                                                    <Field as={TextField} select name={`tasks.${index}.estimated_duration.unit`}>
                                                                        <StyledMenuItem value="minutes">minutes</StyledMenuItem>
                                                                    </Field>
                                                                </StyledInputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </StyledGrid>
                                            </StyledGrid>
                                            <Box mt={2}>
                                                <Button onClick={() => arrayHelpers.remove(index)} color="secondary" variant="outlined">
                                                    Remove Task
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button onClick={() => arrayHelpers.push({})} color="primary" variant="contained">
                                        Add Task
                                    </Button>
                                </Box>
                            )}
                        />
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Constraints
                        </Typography>
                        <Box mb={3}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Unavailable Time Blocks
                            </Typography>
                            <FieldArray
                                name="constraints.unavailable_time_blocks"
                                render={(arrayHelpers) => (
                                    <Box>
                                        {arrayHelpers.form.values.constraints.unavailable_time_blocks.map((block, index) => (
                                            <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                                <StyledGrid container spacing={3}>
                                                    <StyledGrid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.day`}
                                                            as={TextField}
                                                            label="Day"
                                                            select
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.day && !!errors.constraints?.unavailable_time_blocks?.[index]?.day}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.day && errors.constraints?.unavailable_time_blocks?.[index]?.day}
                                                        >
                                                            <StyledMenuItem value="Monday">Monday</StyledMenuItem>
                                                            <StyledMenuItem value="Tuesday">Tuesday</StyledMenuItem>
                                                            <StyledMenuItem value="Wednesday">Wednesday</StyledMenuItem>
                                                            <StyledMenuItem value="Thursday">Thursday</StyledMenuItem>
                                                            <StyledMenuItem value="Friday">Friday</StyledMenuItem>
                                                            <StyledMenuItem value="Saturday">Saturday</StyledMenuItem>
                                                            <StyledMenuItem value="Sunday">Sunday</StyledMenuItem>
                                                        </Field>
                                                    </StyledGrid>
                                                    <StyledGrid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.start_time`}
                                                            as={TextField}
                                                            label="Start Time"
                                                            type="time"
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.start_time && !!errors.constraints?.unavailable_time_blocks?.[index]?.start_time}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.start_time && errors.constraints?.unavailable_time_blocks?.[index]?.start_time}
                                                        />
                                                    </StyledGrid>
                                                    <StyledGrid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.end_time`}
                                                            as={TextField}
                                                            label="End Time"
                                                            type="time"
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.end_time && !!errors.constraints?.unavailable_time_blocks?.[index]?.end_time}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.end_time && errors.constraints?.unavailable_time_blocks?.[index]?.end_time}
                                                        />
                                                    </StyledGrid>
                                                </StyledGrid>
                                                <Box mt={2}>
                                                    <Button onClick={() => arrayHelpers.remove(index)} color="secondary" variant="outlined">
                                                        Remove Time Block
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))}
                                        <Button onClick={() => arrayHelpers.push({})} color="primary" variant="contained">
                                            Add Time Block
                                        </Button>
                                    </Box>
                                )}
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Daily Energy Levels
                            </Typography>
                            <StyledGrid container spacing={3}>
                                <StyledGrid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.morning"
                                        as={TextField}
                                        label="Morning Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.morning && !!errors.constraints?.daily_energy_levels?.morning}
                                        helperText={touched.constraints?.daily_energy_levels?.morning && errors.constraints?.daily_energy_levels?.morning}
                                    >
                                        <StyledMenuItem value="low">Low</StyledMenuItem>
                                        <StyledMenuItem value="medium">Medium</StyledMenuItem>
                                        <StyledMenuItem value="high">High</StyledMenuItem>
                                    </Field>
                                </StyledGrid>
                                <StyledGrid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.afternoon"
                                        as={TextField}
                                        label="Afternoon Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.afternoon && !!errors.constraints?.daily_energy_levels?.afternoon}
                                        helperText={touched.constraints?.daily_energy_levels?.afternoon && errors.constraints?.daily_energy_levels?.afternoon}
                                    >
                                        <StyledMenuItem value="low">Low</StyledMenuItem>
                                        <StyledMenuItem value="medium">Medium</StyledMenuItem>
                                        <StyledMenuItem value="high">High</StyledMenuItem>
                                    </Field>
                                </StyledGrid>
                                <StyledGrid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.evening"
                                        as={TextField}
                                        label="Evening Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.evening && !!errors.constraints?.daily_energy_levels?.evening}
                                        helperText={touched.constraints?.daily_energy_levels?.evening && errors.constraints?.daily_energy_levels?.evening}
                                    >
                                        <StyledMenuItem value="low">Low</StyledMenuItem>
                                        <StyledMenuItem value="medium">Medium</StyledMenuItem>
                                        <StyledMenuItem value="high">High</StyledMenuItem>
                                    </Field>
                                </StyledGrid>
                            </StyledGrid>
                        </Box>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Preferences
                        </Typography>
                        <StyledGrid container spacing={3}>
                            <StyledGrid item xs={6} sm={3}>
                                <Field
                                    name="preferences.activity_variety"
                                    as={TextField}
                                    label="Activity Variety"
                                    select
                                    fullWidth
                                    error={touched.preferences?.activity_variety && !!errors.preferences?.activity_variety}
                                    helperText={touched.preferences?.activity_variety && errors.preferences?.activity_variety}
                                >
                                    <StyledMenuItem value="low">Low</StyledMenuItem>
                                    <StyledMenuItem value="medium">Medium</StyledMenuItem>
                                    <StyledMenuItem value="high">High</StyledMenuItem>
                                </Field>
                            </StyledGrid>
                        </StyledGrid>
                    </Box>

                    <Typography variant="h5" component="h2" gutterBottom>
                        Model
                    </Typography>
                    <Box mb={4} textAlign="center">
                        <Field
                            as={TextField}
                            select
                            label="Select Model"
                            name="model_name"
                            fullWidth
                            error={touched.model_name && !!errors.model_name}
                            helperText={touched.model_name && errors.model_name}
                        >
                            <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
                            <MenuItem value="gemini-1.5-flash">Gemini 1.5 Flash</MenuItem>
                        </Field>

                        <GradientButton disabled={isLoading} type="submit" variant="contained" size="large">
                            Submit
                        </GradientButton>
                    </Box>

                </Form>
            )
            }
        </Formik >
    );
};

export default InputForm;
