package com.empresa.sge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    private String senha;
    
    @NotNull(message = "Perfil é obrigatório")
    private Long perfilId;
    
    private String perfilNome;
    private Boolean ativo;
}
