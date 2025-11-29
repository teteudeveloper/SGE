import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { hasAnyRole, hasRole } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['ADMIN', 'VENDAS', 'ESTOQUE_FINANCEIRO'],
    },
    {
      text: 'Produtos',
      icon: <InventoryIcon />,
      path: '/produtos',
      roles: ['ADMIN', 'VENDAS', 'ESTOQUE_FINANCEIRO'],
    },
    {
      text: 'Vendas',
      icon: <ShoppingCartIcon />,
      path: '/vendas',
      roles: ['ADMIN', 'VENDAS'],
    },
    {
      text: 'Estoque',
      icon: <WarehouseIcon />,
      path: '/estoque',
      roles: ['ADMIN', 'ESTOQUE_FINANCEIRO'],
    },
    {
      text: 'Financeiro',
      icon: <AttachMoneyIcon />,
      path: '/financeiro',
      roles: ['ADMIN', 'ESTOQUE_FINANCEIRO'],
    },
    {
      text: 'Usuários',
      icon: <PeopleIcon />,
      path: '/usuarios',
      roles: ['ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    hasAnyRole(item.roles)
  );

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;