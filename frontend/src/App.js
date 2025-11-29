import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProdutosList from './pages/Produtos/ProdutosList';
import VendasList from './pages/Vendas/VendasList';
import NovaVenda from './pages/Vendas/NovaVenda';
import UsuariosList from './pages/Usuarios/UsuariosList';
import Estoque from './pages/Estoque/Estoque';
import Financeiro from './pages/Financeiro/Financeiro';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/produtos"
              element={
                <ProtectedRoute>
                  <ProdutosList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendas"
              element={
                <ProtectedRoute roles={['ADMIN', 'VENDAS']}>
                  <VendasList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendas/nova"
              element={
                <ProtectedRoute roles={['ADMIN', 'VENDAS']}>
                  <NovaVenda />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UsuariosList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/estoque"
              element={
                <ProtectedRoute roles={['ADMIN', 'ESTOQUE_FINANCEIRO']}>
                  <Estoque />
                </ProtectedRoute>
              }
            />

            <Route
              path="/financeiro"
              element={
                <ProtectedRoute roles={['ADMIN', 'ESTOQUE_FINANCEIRO']}>
                  <Financeiro />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;
