package com.empresa.sge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String nome;
    
    @Column(length = 200)
    private String descricao;
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
