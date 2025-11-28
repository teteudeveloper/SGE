package com.empresa.sge.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_venda", nullable = false, unique = true, length = 20)
    private String numeroVenda;
    
    @Column(name = "data_venda")
    private LocalDateTime dataVenda = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(name = "cliente_nome", length = 200)
    private String clienteNome;
    
    @Column(name = "cliente_cpf", length = 14)
    private String clienteCpf;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal desconto = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @Column(name = "forma_pagamento", length = 50)
    private String formaPagamento;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(length = 20)
    private String status = "CONCLUIDA";
    
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVenda> itens = new ArrayList<>();
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
