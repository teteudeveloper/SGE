/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../../components/Layout/Layout';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import api from '../../services/api';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [perfis] = useState([
    { id: 1, nome: 'ADMIN', descricao: 'Administrador' },
    { id: 2, nome: 'VENDAS', descricao: 'Funcionário de Vendas' },
    { id: 3, nome: 'ESTOQUE_FINANCEIRO', descricao: 'Estoque e Financeiro' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [perfilFilter, setPerfilFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfilId: '',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    let result = usuarios;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          (u.nome || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term)
      );
    }

    if (perfilFilter) {
      result = result.filter((u) => (u.perfilNome || '') === perfilFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'ATIVO';
      result = result.filter((u) => Boolean(u.ativo) === isActive);
    }

    setFilteredUsuarios(result);
  }, [usuarios, searchTerm, perfilFilter, statusFilter]);

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      const data = response.data;
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar usuários');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (usuario = null) => {
    if (usuario) {
      setSelectedUsuario(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        perfilId: usuario.perfilId,
      });
    } else {
      setSelectedUsuario(null);
      setFormData({
        nome: '',
        email: '',
        senha: '',
        perfilId: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUsuario(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedUsuario) {
        await api.put(`/usuarios/${selectedUsuario.id}`, formData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', formData);
        setSuccess('Usuário criado com sucesso!');
      }
      handleCloseDialog();
      loadUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/usuarios/${selectedUsuario.id}`);
      setSuccess('Usuário excluído com sucesso!');
      setConfirmOpen(false);
      loadUsuarios();
    } catch (err) {
      setError('Erro ao excluir usuário');
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome' },
    { field: 'email', headerName: 'Email' },
    { field: 'perfilNome', headerName: 'Perfil' },
    {
      field: 'ativo',
      headerName: 'Ativo',
      render: (value) =>
        value ? (
          <Chip label="Ativo" color="success" size="small" />
        ) : (
          <Chip label="Inativo" color="default" size="small" />
        ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Usuários"
          subtitle="Gerenciamento de usuários do sistema"
          actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Novo Usuário</Button>}
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

        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="Buscar (nome ou email)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite para filtrar..."
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Perfil</InputLabel>
            <Select value={perfilFilter} label="Perfil" onChange={(e) => setPerfilFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {perfis.map((p) => (
                <MenuItem key={p.id} value={p.nome}>{p.descricao}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ATIVO">Ativo</MenuItem>
              <MenuItem value="INATIVO">Inativo</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" size="small" onClick={() => { setSearchTerm(''); setPerfilFilter(''); setStatusFilter(''); }}>
            Limpar
          </Button>
        </Box>

        <DataTable
          columns={columns}
          data={filteredUsuarios}
          onEdit={handleOpenDialog}
          onDelete={(usuario) => {
            setSelectedUsuario(usuario);
            setConfirmOpen(true);
          }}
          actions={true}
        />

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  placeholder={selectedUsuario ? '(deixe em branco para não alterar)' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Perfil"
                  fullWidth
                  value={formData.perfilId}
                  onChange={(e) =>
                    setFormData({ ...formData, perfilId: e.target.value })
                  }
                >
                  {perfis.map((perfil) => (
                    <MenuItem key={perfil.id} value={perfil.id}>
                      {perfil.descricao}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          title="Confirmar Exclusão"
          message={`Deseja realmente excluir o usuário "${selectedUsuario?.nome}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </Box>
    </Layout>
  );
};

export default UsuariosList;
