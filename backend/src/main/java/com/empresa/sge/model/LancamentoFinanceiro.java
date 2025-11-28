package com.empresa.sge.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lancamentos_financeiros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoFinanceiro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 20)
    private String tipo; 
    
    @Column(nullable = false, length = 100)
    private String categoria;
    
    @Column(nullable = false, length = 200)
    private String descricao;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;
    
    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;
    
    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;
    
    @Column(length = 20)
    private String status = "PENDENTE";
    
    @Column(name = "forma_pagamento", length = 50)
    private String formaPagamento;
    
    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm = LocalDateTime.now();
}
