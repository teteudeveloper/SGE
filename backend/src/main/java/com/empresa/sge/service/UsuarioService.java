package com.empresa.sge.service;

import com.empresa.sge.dto.UsuarioDTO;
import com.empresa.sge.model.Perfil;
import com.empresa.sge.model.Usuario;
import com.empresa.sge.repository.PerfilRepository;
import com.empresa.sge.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return toDTO(usuario);
    }

    public UsuarioDTO criar(UsuarioDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe um usuário com este e-mail");
        }

        Perfil perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);

        usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    public UsuarioDTO atualizar(Long id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.getEmail().equals(dto.getEmail())
                && usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe um usuário com este e-mail");
        }

        Perfil perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        usuario.setPerfil(perfil);

        usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    public void alterarStatus(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setAtivo(!usuario.getAtivo());
        usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setPerfilId(
                usuario.getPerfil() != null ? usuario.getPerfil().getId() : null
        );
        dto.setPerfilNome(
                usuario.getPerfil() != null ? usuario.getPerfil().getNome() : null
        );
        dto.setAtivo(usuario.getAtivo());
        return dto;
    }
}
