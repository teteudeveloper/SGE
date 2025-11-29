import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h4" className="page-title">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className="page-subtitle">
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && <Stack direction="row" spacing={1}>{actions}</Stack>}
    </Box>
  );
};

export default PageHeader;
