import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const DateRangeFilter = ({ from, to, onChangeFrom, onChangeTo, onApply, onClear }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="De"
        type="date"
        value={from || ''}
        onChange={(e) => onChangeFrom(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        size="small"
        label="Até"
        type="date"
        value={to || ''}
        onChange={(e) => onChangeTo(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="outlined" size="small" onClick={onApply}>Aplicar</Button>
      <Button variant="text" size="small" onClick={onClear}>Limpar</Button>
    </Box>
  );
};

export default DateRangeFilter;
