import React, { useState, useEffect } from 'react';
import {
  Button,
  Alert,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/Common/PageHeader';
import DateRangeFilter from '../../components/Common/DateRangeFilter';
import DataTable from '../../components/Common/DataTable';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import vendaService from '../../services/vendaService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const VendasList = () => {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadVendas();
  }, []);

  // Apply filters client-side
  useEffect(() => {
    let result = vendas;

    // Filter by search (cliente nome ou número venda)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          (v.clienteNome || '').toLowerCase().includes(term) ||
          String(v.numeroVenda || '').toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((v) => (v.status || '') === statusFilter);
    }

    // Filter by date range
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter((v) => {
        const d = v.dataVenda ? new Date(v.dataVenda) : null;
        return d ? d >= from : false;
      });
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((v) => {
        const d = v.dataVenda ? new Date(v.dataVenda) : null;
        return d ? d <= to : false;
      });
    }

    setFilteredVendas(result);
  }, [vendas, searchTerm, statusFilter, fromDate, toDate]);

  const loadVendas = async () => {
    try {
      const data = await vendaService.listarTodas();
      const list = Array.isArray(data) ? data : [];
      setVendas(list);
    } catch (err) {
      setError('Erro ao carregar vendas');
      setVendas([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'numeroVenda', headerName: 'Número' },
    {
      field: 'dataVenda',
      headerName: 'Data',
      render: (value) => formatDateTime(value),
    },
    { field: 'clienteNome', headerName: 'Cliente' },
    {
      field: 'total',
      headerName: 'Total',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento' },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={value}
          color={value === 'CONCLUIDA' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  if (loading)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );

  return (
    <Layout>
      <PageHeader
        title="Vendas"
        subtitle="Histórico de vendas realizadas"
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/vendas/nova')}>Nova Venda</Button>}
      />

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <DateRangeFilter
          from={fromDate}
          to={toDate}
          onChangeFrom={setFromDate}
          onChangeTo={setToDate}
          onApply={() => {}} 
          onClear={() => { setFromDate(''); setToDate(''); }}
        />

        <TextField
          size="small"
          label="Buscar (cliente ou número)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para filtrar..."
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="CONCLUIDA">Concluída</MenuItem>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="CANCELADA">Cancelada</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" size="small" onClick={() => { setSearchTerm(''); setStatusFilter(''); setFromDate(''); setToDate(''); }}>
          Limpar
        </Button>
      </Box>

      <DataTable columns={columns} data={filteredVendas} actions={false} />
    </Layout>
  );
};

export default VendasList;
