package com.empresa.sge.config;

import com.empresa.sge.model.Perfil;
import com.empresa.sge.model.Usuario;
import com.empresa.sge.repository.PerfilRepository;
import com.empresa.sge.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (perfilRepository.count() == 0) {
            Perfil admin = new Perfil();
            admin.setNome("ADMIN");
            admin.setDescricao("Administrador com acesso total");
            perfilRepository.save(admin);
            
            Perfil vendas = new Perfil();
            vendas.setNome("VENDAS");
            vendas.setDescricao("Funcionário de vendas");
            perfilRepository.save(vendas);
            
            Perfil estoque = new Perfil();
            estoque.setNome("ESTOQUE_FINANCEIRO");
            estoque.setDescricao("Funcionário de estoque e financeiro");
            perfilRepository.save(estoque);
        }
        
        if (!usuarioRepository.existsByEmail("admin@empresa.com")) {
            Perfil perfilAdmin = perfilRepository.findByNome("ADMIN")
                .orElseThrow(() -> new RuntimeException("Perfil ADMIN não encontrado"));
            
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@empresa.com");
            admin.setSenha(passwordEncoder.encode("Admin@123"));
            admin.setPerfil(perfilAdmin);
            admin.setAtivo(true);
            usuarioRepository.save(admin);
            
            System.out.println("===========================================");
            System.out.println("Usuário Admin criado com sucesso!");
            System.out.println("Email: admin@empresa.com");
            System.out.println("Senha: Admin@123");
            System.out.println("===========================================");
        }
    }
} 
