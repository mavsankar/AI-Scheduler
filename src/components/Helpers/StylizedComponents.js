import { Button, Paper, Container, TextField, MenuItem, Grid, InputAdornment, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Styled TextField
const StyledTextField = styled(TextField)({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '5px',
    '& .MuiInputBase-input': {
        color: '#fff',
    },
    '& .MuiInputLabel-root': {
        color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#fff',
        },
        '&:hover fieldset': {
            borderColor: '#6a11cb',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6a11cb',
        }, 
    },
    '& .MuiFormHelperText-root': {
        color: '#ff7961', // Error text color if needed
    },
});
const BackgroundContainer = styled(Container)({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
});

// Styled MenuItem
const StyledMenuItem = styled(MenuItem)({
    color: '#000',
    backgroundColor: '#f5f5f5',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
});

// Styled Grid
const StyledGrid = styled(Grid)({
    padding: '10px',
    '& .MuiGrid-item': {
        padding: '10px',
    },
});

// Styled InputAdornment
const StyledInputAdornment = styled(InputAdornment)({
    '& .MuiTypography-root': {
        color: '#fff',
    },
});

// Styled Typography
const StyledTypography = styled(Typography)({
    color: '#fff',
    marginBottom: '16px',
});

// Styled Box
const StyledBox = styled(Box)({
    borderRadius: '15px',
    padding: '40px',
    margin: '20px 0',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#3E4249', // Darker background color for better contrast
});


const StyledPaper = styled(Paper)({
    padding: '40px',
    maxWidth: '600px',
    textAlign: 'center',
    backgroundColor: '#3E4249', // Lighten the background slightly with more transparency
    borderRadius: '15px',
    backdropFilter: 'blur(10px)', // Apply blur for a frosted glass effect
    color: '#fff', // Ensure the text is white for legibility
});

const GradientButton = styled(Button)({
    margin: '20px',
    padding: '12px 30px',
    fontSize: '1.2em',
    borderRadius: '50px',
    background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)', // Cooler gradient for a more modern look
    color: '#fff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #6a11cb 60%, #2575fc 110%)',
    },
});

export {
    GradientButton,
    StyledTextField,
    StyledMenuItem,
    StyledGrid,
    StyledInputAdornment,
    StyledTypography,
    StyledBox,
    StyledPaper,
    BackgroundContainer
};
