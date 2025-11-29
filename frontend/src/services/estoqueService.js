import api from './api';

const estoqueService = {
  listarMovimentacoes: async () => {
    const response = await api.get('/estoque/movimentacoes');
    return response.data;
  },
};

export default estoqueService;
