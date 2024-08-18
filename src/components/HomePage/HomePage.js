import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h3" gutterBottom>
                Welcome to AI Scheduler
            </Typography>
            <Typography variant="h6" gutterBottom>
                Choose an option below:
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/create')}
                    style={{ margin: '20px' }}
                >
                    Create New Schedule
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/view')}
                >
                    View Existing Schedule
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;
