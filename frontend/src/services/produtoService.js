import api from './api';

const produtoService = {
  listarTodos: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },

  listarAtivos: async () => {
    const response = await api.get('/produtos/ativos');
    return response.data;
  },

  listarEstoqueBaixo: async () => {
    const response = await api.get('/produtos/estoque-baixo');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  criar: async (produto) => {
    const response = await api.post('/produtos', produto);
    return response.data;
  },

  atualizar: async (id, produto) => {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  },

  deletar: async (id) => {
    await api.delete(`/produtos/${id}`);
  },
};

export default produtoService;