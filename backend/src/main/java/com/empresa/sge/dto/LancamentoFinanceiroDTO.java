package com.empresa.sge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoFinanceiroDTO {

    private Long id;
    private String tipo;
    private String categoria;
    private String descricao;
    private BigDecimal valor;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private String status;
    private String formaPagamento;
    private Long vendaId;
    private Long usuarioId;
    private String usuarioNome;
    private String observacoes;
}
