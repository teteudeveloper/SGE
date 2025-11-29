/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import produtoService from '../../services/produtoService';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const ProdutosList = () => {
  const { hasAnyRole } = useAuth();
  const canEdit = hasAnyRole(['ADMIN', 'ESTOQUE_FINANCEIRO']);

  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    precoCusto: '',
    precoVenda: '',
    quantidadeEstoque: '',
    estoqueMinimo: '10',
    categoriaNome: '',
    ativo: true,
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    let result = produtos;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          (p.nome || '').toLowerCase().includes(term) ||
          (p.codigo || '').toLowerCase().includes(term)
      );
    }

    if (categoriaFilter) {
      result = result.filter((p) => (p.categoriaNome || '') === categoriaFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'ATIVO';
      result = result.filter((p) => Boolean(p.ativo) === isActive);
    }

    setFilteredProdutos(result);
  }, [produtos, searchTerm, categoriaFilter, statusFilter]);

  const loadProdutos = async () => {
    try {
      const data = await produtoService.listarTodos();
      const list = Array.isArray(data) ? data : [];
      setProdutos(list);
    } catch (err) {
      setError('Erro ao carregar produtos');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (produto = null) => {
    if (produto) {
      setSelectedProduto(produto);
      setFormData({
        codigo: produto.codigo,
        nome: produto.nome,
        descricao: produto.descricao || '',
        precoCusto: produto.precoCusto || '',
        precoVenda: produto.precoVenda,
        quantidadeEstoque: produto.quantidadeEstoque,
        estoqueMinimo: produto.estoqueMinimo,
        categoriaNome: produto.categoriaNome || '',
        ativo: produto.ativo !== undefined ? produto.ativo : true,
      });
    } else {
      setSelectedProduto(null);
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        precoCusto: '',
        precoVenda: '',
        quantidadeEstoque: '0',
        estoqueMinimo: '10',
        categoriaNome: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduto(null);
  };

  const handleSubmit = async () => {
    if (!formData.codigo || !formData.codigo.trim()) {
      setError('Código é obrigatório');
      return;
    }
    if (!formData.nome || !formData.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!formData.precoCusto || formData.precoCusto <= 0) {
      setError('Preço de Custo é obrigatório e deve ser maior que 0');
      return;
    }
    if (!formData.precoVenda || formData.precoVenda <= 0) {
      setError('Preço de Venda é obrigatório e deve ser maior que 0');
      return;
    }
    if (formData.ativo) {
      if (!formData.quantidadeEstoque || formData.quantidadeEstoque < 0) {
        setError('Quantidade em Estoque é obrigatória e não pode ser negativa');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado. Faça login novamente.');
        return;
      }

      if (selectedProduto) {
        await produtoService.atualizar(selectedProduto.id, formData);
        setSuccess('Produto atualizado com sucesso!');
      } else {
        await produtoService.criar(formData);
        setSuccess('Produto criado com sucesso!');
      }
      handleCloseDialog();
      loadProdutos();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Erro ao salvar produto';
      setError(status ? `${status} - ${message}` : message);
    }
  };

  const handleDelete = async () => {
    try {
      await produtoService.deletar(selectedProduto.id);
      setSuccess('Produto excluído com sucesso!');
      setConfirmOpen(false);
      loadProdutos();
    } catch (err) {
      setError('Erro ao excluir produto');
    }
  };

  const columns = [
    { field: 'codigo', headerName: 'Código' },
    { field: 'nome', headerName: 'Nome' },
    { field: 'categoriaNome', headerName: 'Categoria' },
    {
      field: 'precoVenda',
      headerName: 'Preço',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      field: 'quantidadeEstoque',
      headerName: 'Estoque',
      align: 'right',
      render: (value, row) => (
        <Chip
          label={value}
          color={value <= row.estoqueMinimo ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'ativo',
      headerName: 'Status',
      render: (value) => (
        <Chip
          label={value ? 'Ativo' : 'Inativo'}
          color={value ? 'success' : 'default'}
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
        title="Produtos"
        subtitle="Gerenciamento de produtos do sistema"
        actions={
          canEdit ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              Novo Produto
            </Button>
          ) : null
        }
      />

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          label="Buscar (nome ou código)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para filtrar..."
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoriaFilter}
            label="Categoria"
            onChange={(e) => setCategoriaFilter(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {Array.from(new Set(produtos.map((p) => p.categoriaNome).filter(Boolean))).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ATIVO">Ativo</MenuItem>
            <MenuItem value="INATIVO">Inativo</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" size="small" onClick={() => { setSearchTerm(''); setCategoriaFilter(''); setStatusFilter(''); }}>
          Limpar
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={filteredProdutos}
        onEdit={canEdit ? handleOpenDialog : null}
        onDelete={
          canEdit
            ? (produto) => {
                setSelectedProduto(produto);
                setConfirmOpen(true);
              }
            : null
        }
        actions={canEdit}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categoria"
                value={formData.categoriaNome}
                onChange={(e) =>
                  setFormData({ ...formData, categoriaNome: e.target.value })
                }
                placeholder="Ex: Eletrônicos, Alimentos, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço de Custo"
                type="number"
                value={formData.precoCusto}
                onChange={(e) =>
                  setFormData({ ...formData, precoCusto: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço de Venda"
                type="number"
                value={formData.precoVenda}
                onChange={(e) =>
                  setFormData({ ...formData, precoVenda: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade em Estoque"
                type="number"
                value={formData.quantidadeEstoque}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidadeEstoque: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estoque Mínimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estoqueMinimo: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formData.ativo ? 'ATIVO' : 'INATIVO'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ativo: e.target.value === 'ATIVO',
                    })
                  }
                >
                  <MenuItem value="ATIVO">Ativo</MenuItem>
                  <MenuItem value="INATIVO">Inativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o produto "${selectedProduto?.nome}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Layout>
  );
};

export default ProdutosList;
