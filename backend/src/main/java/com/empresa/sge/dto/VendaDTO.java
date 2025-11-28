package com.empresa.sge.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VendaDTO {
    private Long id;
    private String numeroVenda;
    private LocalDateTime dataVenda;
    
    @NotNull(message = "Usuário é obrigatório")
    private Long usuarioId;
    private String usuarioNome;
    
    private String clienteNome;
    private String clienteCpf;
    
    @NotEmpty(message = "A venda deve conter pelo menos um item")
    private List<ItemVendaDTO> itens;
    
    private BigDecimal subtotal;
    private BigDecimal desconto;
    private BigDecimal total;
    private String formaPagamento;
    private String observacoes;
    private String status;
}
