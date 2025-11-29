import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/Common/PageHeader';
import DateRangeFilter from '../../components/Common/DateRangeFilter';
import DataTable from '../../components/Common/DataTable';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import financeiroService from '../../services/financeiroService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Financeiro = () => {
  const [lancamentos, setLancamentos] = useState([]);
  const [filteredLancamentos, setFilteredLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await financeiroService.listarLancamentos();
        setLancamentos(data || []);
      } catch (err) {
        setError('Erro ao carregar lançamentos financeiros');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    let result = lancamentos;

    if (statusFilter) {
      result = result.filter((l) => (l.status || '') === statusFilter);
    }

    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter((l) => {
        const d = l.dataVencimento ? new Date(l.dataVencimento) : null;
        return d ? d >= from : false;
      });
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((l) => {
        const d = l.dataVencimento ? new Date(l.dataVencimento) : null;
        return d ? d <= to : false;
      });
    }

    setFilteredLancamentos(result);
  }, [lancamentos, statusFilter, fromDate, toDate]);

  const columns = [
    { field: 'tipo', headerName: 'Tipo' },
    { field: 'categoria', headerName: 'Categoria' },
    { field: 'descricao', headerName: 'Descrição' },
    {
      field: 'valor',
      headerName: 'Valor',
      align: 'right',
      render: (value) => (value != null ? formatCurrency(value) : '-'),
    },
    {
      field: 'dataVencimento',
      headerName: 'Vencimento',
      render: (value) => (value ? formatDate(value) : '-'),
    },
    {
      field: 'dataPagamento',
      headerName: 'Pagamento',
      render: (value) => (value ? formatDate(value) : '-'),
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (value) => (
        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: value === 'PAGO' ? '#e8f5e9' : value === 'PENDENTE' ? '#fff3e0' : '#f5f5f5', color: value === 'PAGO' ? '#2e7d32' : value === 'PENDENTE' ? '#e65100' : '#666' }}>
          {value}
        </span>
      ),
    },
    { field: 'formaPagamento', headerName: 'Forma Pagamento' },
    { field: 'usuarioNome', headerName: 'Usuário' },
  ];

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Financeiro" subtitle="Lançamentos e resumo financeiro" />

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
          onApply={() => {}} // no-op, filters are reactive
          onClear={() => { setFromDate(''); setToDate(''); }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PAGO">Pago</MenuItem>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" size="small" onClick={() => { setStatusFilter(''); setFromDate(''); setToDate(''); }}>
          Limpar
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={filteredLancamentos}
        actions={false}
      />
    </Layout>
  );
};

export default Financeiro;
