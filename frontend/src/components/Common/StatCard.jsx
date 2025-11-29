import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatCard = ({ title, value, icon, bg = '#e6eef8', iconSize = 36 }) => {
  const renderIcon = () => {
    try {
      return React.isValidElement(icon)
        ? React.cloneElement(icon, { fontSize: 'small' })
        : icon;
    } catch (e) {
      return icon;
    }
  };

  return (
    <Card className="card-neutral">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: bg,
              borderRadius: '50%',
              width: iconSize + 12,
              height: iconSize + 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
            }}
          >
            <Box sx={{ fontSize: iconSize }}>{renderIcon()}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
