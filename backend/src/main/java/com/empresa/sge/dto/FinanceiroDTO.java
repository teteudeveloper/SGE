package com.empresa.sge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FinanceiroDTO {
    private Long id;
    
    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;
    
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;
    
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;
    
    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;
    
    @NotNull(message = "Data de vencimento é obrigatória")
    private LocalDate dataVencimento;
    
    private LocalDate dataPagamento;
    private String status;
    private String formaPagamento;
    private Long vendaId;
    private Long usuarioId;
    private String observacoes;
}
