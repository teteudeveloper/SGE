import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from '@mui/material';

import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/Common/PageHeader';
import DateRangeFilter from '../../components/Common/DateRangeFilter';
import DataTable from '../../components/Common/DataTable';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import estoqueService from '../../services/estoqueService';
import { formatDateTime } from '../../utils/formatters';

const Estoque = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [filteredMovimentacoes, setFilteredMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [produtoFilter, setProdutoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await estoqueService.listarMovimentacoes();
        setMovimentacoes(data || []);
      } catch (err) {
        setError('Erro ao carregar movimentações de estoque');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Apply filters client-side
  useEffect(() => {
    let result = movimentacoes;

    // Filter by produto (nome ou código)
    if (produtoFilter.trim()) {
      const term = produtoFilter.toLowerCase();
      result = result.filter(
        (m) =>
          (m.produtoNome || '').toLowerCase().includes(term) ||
          (m.produtoCodigo || '').toLowerCase().includes(term)
      );
    }

    // Filter by tipo (ENTRADA/SAIDA)
    if (tipoFilter) {
      result = result.filter((m) => (m.tipo || '') === tipoFilter);
    }

    // Filter by date range
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter((m) => {
        const d = m.dataMovimentacao ? new Date(m.dataMovimentacao) : null;
        return d ? d >= from : false;
      });
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((m) => {
        const d = m.dataMovimentacao ? new Date(m.dataMovimentacao) : null;
        return d ? d <= to : false;
      });
    }

    setFilteredMovimentacoes(result);
  }, [movimentacoes, produtoFilter, tipoFilter, fromDate, toDate]);

  const columns = [
    {
      field: 'dataMovimentacao',
      headerName: 'Data',
      render: (value) => (value ? formatDateTime(value) : '-'),
    },
    { field: 'produtoCodigo', headerName: 'Código' },
    { field: 'produtoNome', headerName: 'Produto' },
    { field: 'tipo', headerName: 'Tipo' },
    { field: 'quantidade', headerName: 'Quantidade', align: 'right' },
    { field: 'motivo', headerName: 'Motivo' },
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
      <PageHeader
        title="Movimentações de Estoque"
        subtitle="Entradas e saídas de estoque registradas automaticamente pelas vendas."
      />

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters bar - client-side only */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <DateRangeFilter
          from={fromDate}
          to={toDate}
          onChangeFrom={setFromDate}
          onChangeTo={setToDate}
          onApply={() => {}} // no-op, filters are reactive
          onClear={() => { setFromDate(''); setToDate(''); }}
        />

        <TextField
          size="small"
          label="Produto (nome/código)"
          value={produtoFilter}
          onChange={(e) => setProdutoFilter(e.target.value)}
          placeholder="Digite para filtrar..."
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tipo</InputLabel>
          <Select value={tipoFilter} label="Tipo" onChange={(e) => setTipoFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ENTRADA">Entrada</MenuItem>
            <MenuItem value="SAIDA">Saída</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" size="small" onClick={() => { setProdutoFilter(''); setTipoFilter(''); setFromDate(''); setToDate(''); }}>
          Limpar
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={filteredMovimentacoes}
        actions={false}
      />
    </Layout>
  );
};

export default Estoque;
