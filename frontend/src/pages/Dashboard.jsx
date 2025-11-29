/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import StatCard from '../components/Common/StatCard';
import Layout from '../components/Layout/Layout';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardData = await dashboardService.getDashboard();
      setData(dashboardData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Visão geral do sistema
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vendas Hoje"
            value={formatCurrency(data?.totalVendasHoje || 0)}
            icon={<ShoppingCartIcon />}
            bg="#eaf3ff"
            iconSize={36}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vendas do Mês"
            value={formatCurrency(data?.totalVendasMes || 0)}
            icon={<TrendingUpIcon />}
            bg="#e6f4ea"
            iconSize={36}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Saldo do Mês"
            value={formatCurrency(data?.saldoMes || 0)}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            icon={<AttachMoneyIcon />}
            bg="#fef3e0"
            iconSize={36}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estoque Baixo"
            value={data?.produtosEstoqueBaixo || 0}
            icon={<WarningIcon />}
            bg="#fdecea"
            iconSize={36}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Produtos Mais Vendidos
            </Typography>
            {data?.produtosMaisVendidos?.length > 0 ? (
              data.produtosMaisVendidos.map((produto, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <Typography>{produto.nome}</Typography>
                  <Typography color="primary">
                    {produto.quantidade} unidades
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">
                Nenhum dado disponível
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo Financeiro do Mês
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                }}
              >
                <Typography>Receitas:</Typography>
                <Typography color="success.main">
                  {formatCurrency(data?.receitasMes || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                }}
              >
                <Typography>Despesas:</Typography>
                <Typography color="error.main">
                  {formatCurrency(data?.despesasMes || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderTop: '2px solid #000',
                  mt: 1,
                }}
              >
                <Typography variant="h6">Saldo:</Typography>
                <Typography
                  variant="h6"
                  color={data?.saldoMes >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(data?.saldoMes || 0)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;