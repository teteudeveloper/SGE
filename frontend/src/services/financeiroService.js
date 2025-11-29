import api from './api';

const financeiroService = {
  listarLancamentos: async () => {
    const response = await api.get('/financeiro/lancamentos');
    return response.data;
  },
};

export default financeiroService;
