package com.empresa.sge.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemVendaDTO {
    private Long id;
    
    @NotNull(message = "Produto é obrigatório")
    private Long produtoId;
    private String produtoNome;
    private String produtoCodigo;
    
    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private Integer quantidade;
    
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
    private BigDecimal desconto;
    private BigDecimal total;
} 
