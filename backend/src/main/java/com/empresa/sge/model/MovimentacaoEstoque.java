package com.empresa.sge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimentacaoEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;
    
    @Column(nullable = false, length = 20)
    private String tipo;
    
    @Column(nullable = false)
    private Integer quantidade;
    
    @Column(length = 200)
    private String motivo;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;
    
    @Column(name = "data_movimentacao")
    private LocalDateTime dataMovimentacao = LocalDateTime.now();
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
