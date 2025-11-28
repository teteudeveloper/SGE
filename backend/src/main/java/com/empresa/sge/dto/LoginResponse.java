package com.empresa.sge.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private Long id;
    private String nome;
    private String email;
    private String perfil;
}
