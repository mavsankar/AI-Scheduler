import React from 'react';
import { Typography, Grid, Box } from '@mui/material';

const GoalLegend = ({ goalColors }) => (
  <Box sx={{ marginBottom: 2 }}>
    <Typography variant="h6">Legend</Typography>
    <Grid container spacing={1}>
      {Object.entries(goalColors).map(([goal, color]) => (
        <Grid item xs={12} sm={6} md={4} key={goal}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                marginRight: 1,
                borderRadius: '50%',
              }}
            />
            <Typography>{goal || 'Same as above / Leisure'}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default GoalLegend;
