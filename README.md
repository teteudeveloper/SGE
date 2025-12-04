# SGE - Sistema de Gestão de Estoque

> Uma aplicação web desenvolvida para gerenciar estoques, produtos, vendas, usuários e funcionalidades financeiras de forma eficiente e intuitiva.

## 📋 Sobre o Projeto

O SGE (Sistema de Gestão de Estoque) é uma solução completa para pequenas e médias empresas que desejam otimizar o gerenciamento de seus estoques, controlar vendas, gerenciar usuários e acompanhar dados financeiros em um único lugar.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces de usuário interativas
- **JavaScript/CSS**: Desenvolvimento frontend moderno
- **Axios**: Cliente HTTP para comunicação com a API backend
- **Componentes Reutilizáveis**: Arquitetura componentizada para melhor manutenção e escalabilidade

### Backend
- **Java**: Linguagem de programação principal
- **Spring Boot**: Framework para desenvolvimento rápido de aplicações Java
- **Spring Security**: Framework de segurança para autenticação e autorização
- **JWT (JSON Web Tokens)**: Autenticação segura baseada em tokens
- **Maven**: Gerenciador de dependências e construção do projeto
- **JPA/Hibernate**: ORM para persistência de dados

### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional

### Infraestrutura & DevOps
- **Docker Compose**: Orquestração de containers para ambiente de desenvolvimento

## 📁 Estrutura do Projeto

```
sge/
├── frontend/                          # Aplicação React
│   ├── public/                       # Arquivos estáticos
│   ├── src/
│   │   ├── components/               # Componentes reutilizáveis
│   │   │   ├── Common/              # Componentes comuns (dialogs, tabelas, etc)
│   │   │   └── Layout/              # Layout principal (header, sidebar)
│   │   ├── context/                 # Context API para estado global
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Estoque/
│   │   │   ├── Financeiro/
│   │   │   ├── Produtos/
│   │   │   ├── Usuarios/
│   │   │   └── Vendas/
│   │   ├── services/                # Serviços de API
│   │   ├── utils/                   # Utilitários (formatadores, validadores)
│   │   └── App.js                   # Componente principal
│   └── package.json                 # Dependências do frontend
│
├── backend/                           # Aplicação Java Spring Boot
│   ├── src/main/java/com/empresa/sge/
│   │   ├── SgeApplication.java      # Classe principal da aplicação
│   │   ├── config/                  # Configurações
│   │   │   ├── CorsConfig.java     # Configuração CORS
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/              # Controllers REST
│   │   │   ├── AuthController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── EstoqueController.java
│   │   │   ├── FinanceiroController.java
│   │   │   ├── ProdutoController.java
│   │   │   ├── UsuarioController.java
│   │   │   └── VendaController.java
│   │   ├── service/                 # Serviços de negócio
│   │   ├── repository/              # Repositórios (acesso a dados)
│   │   ├── model/                   # Entidades JPA
│   │   ├── dto/                     # Data Transfer Objects
│   │   └── exception/               # Classes de exceção customizadas
│   ├── src/main/resources/
│   │   └── application.properties   # Configurações da aplicação
│   └── pom.xml                      # Dependências Maven
│
└── README.md                         # Este arquivo
```

## 🎯 Funcionalidades Principais

- **Autenticação e Autorização**: Sistema seguro de login com JWT
- **Gestão de Estoque**: Controle completo de produtos em estoque
- **Gestão de Produtos**: Cadastro, edição e exclusão de produtos
- **Gestão de Vendas**: Registro e acompanhamento de vendas
- **Gestão de Usuários**: Administração de usuários do sistema
- **Dashboard**: Visualização de métricas e dados importantes
- **Funcionalidades Financeiras**: Controle de receitas e despesas