import React from 'react';
import { Typography,  Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BackgroundContainer, StyledPaper, GradientButton } from '../Helpers/StylizedComponents';


const HomePage = () => {
    const navigate = useNavigate();

    return (
        <BackgroundContainer maxWidth={false}>
            <StyledPaper elevation={6}>
                <Typography variant="h3" gutterBottom>
                    Welcome to AI Scheduler
                </Typography>
                <Typography variant="h6" color="inherit" gutterBottom>
                    Your personalized scheduling assistant
                </Typography>
                <Box mt={4}>
                    <GradientButton
                        variant="contained"
                        onClick={() => navigate('/create')}
                    >
                        Create New Schedule
                    </GradientButton>
                    <GradientButton
                        variant="contained"
                        onClick={() => navigate('/view')}
                    >
                        View Existing Schedule
                    </GradientButton>
                </Box>
            </StyledPaper>
        </BackgroundContainer>
    );
};

export default HomePage;
