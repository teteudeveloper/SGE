import api from './api';

const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.perfil === role;
  },

  hasAnyRole: (roles) => {
    const user = authService.getCurrentUser();
    return user && roles.includes(user.perfil);
  },
};

export default authService;