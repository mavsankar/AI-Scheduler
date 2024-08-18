// src/components/InputForm.js
import React from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, MenuItem, Grid, InputAdornment, Typography, Box } from '@mui/material';

const InputForm = ({ onSubmit, isLoading }) => {

    const initialValues = {
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
            breaks: {
                frequency: '',
                duration: '',
            },
            activity_variety: '',
            social_time: '',
            personal_time: '',
        },
    };

    const validationSchema = Yup.object({
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
                priority_level: Yup.string().oneOf(['high', 'medium', 'low']).required('Required'),
                time_commitment: Yup.object({
                    duration: Yup.number().required('Required'),
                    unit: Yup.string().oneOf(['minutes', 'hours']).required('Required'),
                }).required('Required'),
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
            breaks: Yup.object({
                frequency: Yup.object({
                    interval: Yup.number(),
                    unit: Yup.string().oneOf(['minutes', 'hours']),
                }),
                duration: Yup.object({
                    duration: Yup.number(),
                    unit: Yup.string().oneOf(['minutes']),
                }),
            }).default({ frequency: { interval: 0, unit: 'minutes' }, duration: { duration: 0, unit: 'minutes' } }),
            activity_variety: Yup.string().oneOf(['high', 'medium', 'low']),
            social_time: Yup.object({
                duration: Yup.number(),
                unit: Yup.string().oneOf(['minutes', 'hours']),
            }).default({ duration: 0, unit: 'minutes' }),
            personal_time: Yup.object({
                duration: Yup.number(),
                unit: Yup.string().oneOf(['minutes', 'hours']),
            }).default({ duration: 0, unit: 'minutes' }),
        }),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                const formattedValues = {
                    ...values,
                    goals: values.goals.map(goal => ({
                        ...goal,
                        time_commitment: `${goal.time_commitment.duration} ${goal.time_commitment.unit} daily`,
                    })),
                    tasks: values.tasks.map(task => ({
                        ...task,
                        estimated_duration: `${task.estimated_duration.duration} ${task.estimated_duration.unit}`,
                    })),
                    preferences: {
                        ...values.preferences,
                        breaks: {
                            ...values.preferences.breaks,
                            frequency: `every ${values.preferences.breaks.frequency.interval} ${values.preferences.breaks.frequency.unit}`,
                            duration: `${values.preferences.breaks.duration.duration} ${values.preferences.breaks.duration.unit}`,
                        },
                        social_time: `${values.preferences.social_time.duration} ${values.preferences.social_time.unit} daily`,
                        personal_time: `${values.preferences.personal_time.duration} ${values.preferences.personal_time.unit} daily`,
                    },
                };
                onSubmit(formattedValues);
            }}
        >
            {({ errors, touched }) => (
                <Form>
                    <Box mb={4}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Personal Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.name"
                                    as={TextField}
                                    label="Name"
                                    fullWidth
                                    error={touched.personal_information?.name && !!errors.personal_information?.name}
                                    helperText={touched.personal_information?.name && errors.personal_information?.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.age"
                                    as={TextField}
                                    label="Age"
                                    type="number"
                                    fullWidth
                                    error={touched.personal_information?.age && !!errors.personal_information?.age}
                                    helperText={touched.personal_information?.age && errors.personal_information?.age}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.preferred_wake_up_time"
                                    as={TextField}
                                    label="Preferred Wake-Up Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.preferred_wake_up_time && !!errors.personal_information?.preferred_wake_up_time}
                                    helperText={touched.personal_information?.preferred_wake_up_time && errors.personal_information?.preferred_wake_up_time}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.preferred_bedtime"
                                    as={TextField}
                                    label="Preferred Bedtime"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.preferred_bedtime && !!errors.personal_information?.preferred_bedtime}
                                    helperText={touched.personal_information?.preferred_bedtime && errors.personal_information?.preferred_bedtime}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.exercise"
                                    as={TextField}
                                    label="Exercise"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.exercise && !!errors.personal_information?.current_lifestyle_habits?.exercise}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.exercise && errors.personal_information?.current_lifestyle_habits?.exercise}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.diet"
                                    as={TextField}
                                    label="Diet"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.diet && !!errors.personal_information?.current_lifestyle_habits?.diet}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.diet && errors.personal_information?.current_lifestyle_habits?.diet}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="personal_information.current_lifestyle_habits.sleep"
                                    as={TextField}
                                    label="Sleep"
                                    fullWidth
                                    error={touched.personal_information?.current_lifestyle_habits?.sleep && !!errors.personal_information?.current_lifestyle_habits?.sleep}
                                    helperText={touched.personal_information?.current_lifestyle_habits?.sleep && errors.personal_information?.current_lifestyle_habits?.sleep}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.work_hours.start_time"
                                    as={TextField}
                                    label="Work Start Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.work_hours?.start_time && !!errors.personal_information?.work_hours?.start_time}
                                    helperText={touched.personal_information?.work_hours?.start_time && errors.personal_information?.work_hours?.start_time}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    name="personal_information.work_hours.end_time"
                                    as={TextField}
                                    label="Work End Time"
                                    type="time"
                                    fullWidth
                                    error={touched.personal_information?.work_hours?.end_time && !!errors.personal_information?.work_hours?.end_time}
                                    helperText={touched.personal_information?.work_hours?.end_time && errors.personal_information?.work_hours?.end_time}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Goals
                        </Typography>
                        <FieldArray
                            name="goals"
                            render={(arrayHelpers) => (
                                <Box>
                                    {arrayHelpers.form.values.goals.map((goal, index) => (
                                        <Box key={index} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Field
                                                        name={`goals.${index}.goal_name`}
                                                        as={TextField}
                                                        label="Goal Name"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_name && !!errors.goals?.[index]?.goal_name}
                                                        helperText={touched.goals?.[index]?.goal_name && errors.goals?.[index]?.goal_name}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        name={`goals.${index}.goal_description`}
                                                        as={TextField}
                                                        label="Goal Description"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_description && !!errors.goals?.[index]?.goal_description}
                                                        helperText={touched.goals?.[index]?.goal_description && errors.goals?.[index]?.goal_description}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.goal_type`}
                                                        as={TextField}
                                                        label="Goal Type"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.goal_type && !!errors.goals?.[index]?.goal_type}
                                                        helperText={touched.goals?.[index]?.goal_type && errors.goals?.[index]?.goal_type}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
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
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.priority_level`}
                                                        as={TextField}
                                                        label="Priority Level"
                                                        select
                                                        fullWidth
                                                        error={touched.goals?.[index]?.priority_level && !!errors.goals?.[index]?.priority_level}
                                                        helperText={touched.goals?.[index]?.priority_level && errors.goals?.[index]?.priority_level}
                                                    >
                                                        <MenuItem value="high">High</MenuItem>
                                                        <MenuItem value="medium">Medium</MenuItem>
                                                        <MenuItem value="low">Low</MenuItem>
                                                    </Field>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        name={`goals.${index}.time_commitment.duration`}
                                                        as={TextField}
                                                        label="Time Commitment"
                                                        type="number"
                                                        fullWidth
                                                        error={touched.goals?.[index]?.time_commitment?.duration && !!errors.goals?.[index]?.time_commitment?.duration}
                                                        helperText={touched.goals?.[index]?.time_commitment?.duration && errors.goals?.[index]?.time_commitment?.duration}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Field as={TextField} select name={`goals.${index}.time_commitment.unit`}>
                                                                        <MenuItem value="minutes">minutes</MenuItem>
                                                                        <MenuItem value="hours">hours</MenuItem>
                                                                    </Field>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
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
                        <Typography variant="h4" component="h2" gutterBottom>
                            Tasks
                        </Typography>
                        <FieldArray
                            name="tasks"
                            render={(arrayHelpers) => (
                                <Box>
                                    {arrayHelpers.form.values.tasks.map((task, index) => (
                                        <Box key={index} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={4}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.goal_name`}
                                                        as={TextField}
                                                        label="Goal Name"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.goal_name && !!errors.tasks?.[index]?.goal_name}
                                                        helperText={touched.tasks?.[index]?.goal_name && errors.tasks?.[index]?.goal_name}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.task_name`}
                                                        as={TextField}
                                                        label="Task Name"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_name && !!errors.tasks?.[index]?.task_name}
                                                        helperText={touched.tasks?.[index]?.task_name && errors.tasks?.[index]?.task_name}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        name={`tasks.${index}.task_description`}
                                                        as={TextField}
                                                        label="Task Description"
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_description && !!errors.tasks?.[index]?.task_description}
                                                        helperText={touched.tasks?.[index]?.task_description && errors.tasks?.[index]?.task_description}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        name={`tasks.${index}.task_frequency`}
                                                        as={TextField}
                                                        label="Task Frequency"
                                                        select
                                                        fullWidth
                                                        error={touched.tasks?.[index]?.task_frequency && !!errors.tasks?.[index]?.task_frequency}
                                                        helperText={touched.tasks?.[index]?.task_frequency && errors.tasks?.[index]?.task_frequency}
                                                    >
                                                        <MenuItem value="daily">Daily</MenuItem>
                                                        <MenuItem value="weekly">Weekly</MenuItem>
                                                        <MenuItem value="monthly">Monthly</MenuItem>
                                                    </Field>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
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
                                                                <InputAdornment position="end">
                                                                    <Field as={TextField} select name={`tasks.${index}.estimated_duration.unit`}>
                                                                        <MenuItem value="minutes">minutes</MenuItem>
                                                                    </Field>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
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
                        <Typography variant="h4" component="h2" gutterBottom>
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
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.day`}
                                                            as={TextField}
                                                            label="Day"
                                                            select
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.day && !!errors.constraints?.unavailable_time_blocks?.[index]?.day}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.day && errors.constraints?.unavailable_time_blocks?.[index]?.day}
                                                        >
                                                            <MenuItem value="Monday">Monday</MenuItem>
                                                            <MenuItem value="Tuesday">Tuesday</MenuItem>
                                                            <MenuItem value="Wednesday">Wednesday</MenuItem>
                                                            <MenuItem value="Thursday">Thursday</MenuItem>
                                                            <MenuItem value="Friday">Friday</MenuItem>
                                                            <MenuItem value="Saturday">Saturday</MenuItem>
                                                            <MenuItem value="Sunday">Sunday</MenuItem>
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.start_time`}
                                                            as={TextField}
                                                            label="Start Time"
                                                            type="time"
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.start_time && !!errors.constraints?.unavailable_time_blocks?.[index]?.start_time}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.start_time && errors.constraints?.unavailable_time_blocks?.[index]?.start_time}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Field
                                                            name={`constraints.unavailable_time_blocks.${index}.end_time`}
                                                            as={TextField}
                                                            label="End Time"
                                                            type="time"
                                                            fullWidth
                                                            error={touched.constraints?.unavailable_time_blocks?.[index]?.end_time && !!errors.constraints?.unavailable_time_blocks?.[index]?.end_time}
                                                            helperText={touched.constraints?.unavailable_time_blocks?.[index]?.end_time && errors.constraints?.unavailable_time_blocks?.[index]?.end_time}
                                                        />
                                                    </Grid>
                                                </Grid>
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.morning"
                                        as={TextField}
                                        label="Morning Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.morning && !!errors.constraints?.daily_energy_levels?.morning}
                                        helperText={touched.constraints?.daily_energy_levels?.morning && errors.constraints?.daily_energy_levels?.morning}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.afternoon"
                                        as={TextField}
                                        label="Afternoon Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.afternoon && !!errors.constraints?.daily_energy_levels?.afternoon}
                                        helperText={touched.constraints?.daily_energy_levels?.afternoon && errors.constraints?.daily_energy_levels?.afternoon}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="constraints.daily_energy_levels.evening"
                                        as={TextField}
                                        label="Evening Energy Level"
                                        select
                                        fullWidth
                                        error={touched.constraints?.daily_energy_levels?.evening && !!errors.constraints?.daily_energy_levels?.evening}
                                        helperText={touched.constraints?.daily_energy_levels?.evening && errors.constraints?.daily_energy_levels?.evening}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Field>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Preferences
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Breaks
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    name="preferences.breaks.frequency.interval"
                                    as={TextField}
                                    label="Break Frequency Interval"
                                    type="number"
                                    fullWidth
                                    error={touched.preferences?.breaks?.frequency?.interval && !!errors.preferences?.breaks?.frequency?.interval}
                                    helperText={touched.preferences?.breaks?.frequency?.interval && errors.preferences?.breaks?.frequency?.interval}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Field as={TextField} select name="preferences.breaks.frequency.unit">
                                                    <MenuItem value="minutes">minutes</MenuItem>
                                                    <MenuItem value="hours">hours</MenuItem>
                                                </Field>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    name="preferences.breaks.duration.duration"
                                    as={TextField}
                                    label="Break Duration"
                                    type="number"
                                    fullWidth
                                    error={touched.preferences?.breaks?.duration?.duration && !!errors.preferences?.breaks?.duration?.duration}
                                    helperText={touched.preferences?.breaks?.duration?.duration && errors.preferences?.breaks?.duration?.duration}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Field as={TextField} select name="preferences.breaks.duration.unit">
                                                    <MenuItem value="minutes">minutes</MenuItem>
                                                </Field>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    name="preferences.activity_variety"
                                    as={TextField}
                                    label="Activity Variety"
                                    select
                                    fullWidth
                                    error={touched.preferences?.activity_variety && !!errors.preferences?.activity_variety}
                                    helperText={touched.preferences?.activity_variety && errors.preferences?.activity_variety}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Field>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    name="preferences.social_time.duration"
                                    as={TextField}
                                    label="Social Time"
                                    type="number"
                                    fullWidth
                                    error={touched.preferences?.social_time?.duration && !!errors.preferences?.social_time?.duration}
                                    helperText={touched.preferences?.social_time?.duration && errors.preferences?.social_time?.duration}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Field as={TextField} select name="preferences.social_time.unit">
                                                    <MenuItem value="minutes">minutes</MenuItem>
                                                    <MenuItem value="hours">hours</MenuItem>
                                                </Field>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    name="preferences.personal_time.duration"
                                    as={TextField}
                                    label="Personal Time"
                                    type="number"
                                    fullWidth
                                    error={touched.preferences?.personal_time?.duration && !!errors.preferences?.personal_time?.duration}
                                    helperText={touched.preferences?.personal_time?.duration && errors.preferences?.personal_time?.duration}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Field as={TextField} select name="preferences.personal_time.unit">
                                                    <MenuItem value="minutes">minutes</MenuItem>
                                                    <MenuItem value="hours">hours</MenuItem>
                                                </Field>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>


                    <Box mt={4} textAlign="center">
                        <Button disabled={isLoading} type="submit" variant="contained" color="primary" size="large">
                            Submit
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default InputForm;
