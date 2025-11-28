package com.empresa.sge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimentacaoEstoqueDTO {

    private Long id;
    private Long produtoId;
    private String produtoCodigo;
    private String produtoNome;
    private String tipo;
    private Integer quantidade;
    private String motivo;
    private Long usuarioId;
    private String usuarioNome;
    private Long vendaId;
    private LocalDateTime dataMovimentacao;
    private String observacoes;
}
