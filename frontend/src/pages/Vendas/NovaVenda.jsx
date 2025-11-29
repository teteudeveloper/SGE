import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import produtoService from '../../services/produtoService';
import vendaService from '../../services/vendaService';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const NovaVenda = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteCpf: '',
    formaPagamento: 'DINHEIRO',
    observacoes: '',
  });

  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({
    produtoId: '',
    quantidade: 1,
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const data = await produtoService.listarAtivos();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar produtos');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!novoItem.produtoId || novoItem.quantidade <= 0) {
      setError('Selecione um produto e quantidade válida');
      return;
    }

    const produto = produtos.find(
      (p) => p.id === parseInt(novoItem.produtoId, 10)
    );
    if (!produto) return;

    if (produto.quantidadeEstoque < novoItem.quantidade) {
      setError('Quantidade em estoque insuficiente');
      return;
    }

    const itemExistente = itens.find((i) => i.produtoId === produto.id);
    if (itemExistente) {
      setError('Produto já adicionado');
      return;
    }

    const item = {
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoCodigo: produto.codigo,
      quantidade: parseInt(novoItem.quantidade, 10),
      precoUnitario: produto.precoVenda,
    };

    setItens([...itens, item]);
    setNovoItem({ produtoId: '', quantidade: 1 });
    setError('');
  };

  const handleRemoveItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const calcularSubtotal = () =>
    itens.reduce(
      (total, item) => total + item.quantidade * item.precoUnitario,
      0
    );

  const handleSubmit = async () => {
    if (itens.length === 0) {
      setError('Adicione pelo menos um item à venda');
      return;
    }

    try {
      const vendaData = {
        usuarioId: user.id,
        clienteNome: formData.clienteNome || 'Cliente não identificado',
        clienteCpf: formData.clienteCpf,
        formaPagamento: formData.formaPagamento,
        observacoes: formData.observacoes,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          desconto: 0,
        })),
        desconto: 0,
      };

      await vendaService.criar(vendaData);
      setSuccess('Venda realizada com sucesso!');
      setTimeout(() => navigate('/vendas'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar venda');
    }
  };

  if (loading)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );

  const subtotal = calcularSubtotal();

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Nova Venda
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Registre uma nova venda no sistema
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informações do Cliente
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  value={formData.clienteNome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clienteNome: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.clienteCpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clienteCpf: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Forma de Pagamento"
                  value={formData.formaPagamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      formaPagamento: e.target.value,
                    })
                  }
                >
                  <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                  <MenuItem value="CARTAO_CREDITO">Cartão de Crédito</MenuItem>
                  <MenuItem value="CARTAO_DEBITO">Cartão de Débito</MenuItem>
                  <MenuItem value="PIX">PIX</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observacoes: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Adicionar Produto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Produto"
                  value={novoItem.produtoId}
                  onChange={(e) =>
                    setNovoItem({
                      ...novoItem,
                      produtoId: e.target.value,
                    })
                  }
                >
                  {produtos.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.codigo} - {produto.nome} -{' '}
                      {formatCurrency(produto.precoVenda)} (Estoque:{' '}
                      {produto.quantidadeEstoque})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  value={novoItem.quantidade}
                  onChange={(e) =>
                    setNovoItem({
                      ...novoItem,
                      quantidade: e.target.value,
                    })
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  sx={{ height: '100%' }}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Itens da Venda
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Preço Unit.</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum item adicionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.produtoCodigo}</TableCell>
                        <TableCell>{item.produtoNome}</TableCell>
                        <TableCell align="right">{item.quantidade}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.precoUnitario)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(
                            item.quantidade * item.precoUnitario
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(subtotal)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="outlined" onClick={() => navigate('/vendas')}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={itens.length === 0}
              >
                Finalizar Venda
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default NovaVenda;