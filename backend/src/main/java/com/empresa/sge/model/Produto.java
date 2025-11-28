package com.empresa.sge.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String codigo;
    
    @Column(nullable = false, length = 200)
    private String nome;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
    
    @Column(name = "preco_custo", precision = 10, scale = 2)
    private BigDecimal precoCusto;
    
    @Column(name = "preco_venda", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoVenda;
    
    @Column(name = "quantidade_estoque", nullable = false)
    private Integer quantidadeEstoque = 0;
    
    @Column(name = "estoque_minimo")
    private Integer estoqueMinimo = 10;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm = LocalDateTime.now();
}
