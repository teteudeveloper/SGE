import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = ({
  columns = [],
  data,
  rows,          
  onEdit,
  onDelete,
  actions = true,
}) => {
  const safeColumns = Array.isArray(columns) ? columns : [];

  const source = data !== undefined ? data : rows;
  const safeData = Array.isArray(source) ? source : [];

  return (
    <div className="table-responsive">
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size="small">
        <TableHead>
          <TableRow>
            {safeColumns.map((column) => (
              <TableCell key={column.field} align={column.align || 'left'}>
                {column.headerName}
              </TableCell>
            ))}
            {actions && <TableCell align="center">Ações</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {safeData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={safeColumns.length + (actions ? 1 : 0)}
                align="center"
              >
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            safeData.map((row) => (
              <TableRow key={row.id} hover>
                {safeColumns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align || 'left'}
                  >
                    {column.render
                      ? column.render(row[column.field], row)
                      : row[column.field]}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell align="center">
                    {onEdit && (
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
