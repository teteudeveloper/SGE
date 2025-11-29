import api from './api';

const vendaService = {
  listarTodas: async () => {
    const response = await api.get('/vendas');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  },

  criar: async (venda) => {
    const response = await api.post('/vendas', venda);
    return response.data;
  },
};

export default vendaService;