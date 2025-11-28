package com.empresa.sge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProdutoDTO {
    private Long id;
    
    @NotBlank(message = "Código é obrigatório")
    private String codigo;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    private String descricao;
    
    private Long categoriaId;
    private String categoriaNome;
    
    @Positive(message = "Preço de custo deve ser positivo")
    private BigDecimal precoCusto;
    
    @NotNull(message = "Preço de venda é obrigatório")
    @Positive(message = "Preço de venda deve ser positivo")
    private BigDecimal precoVenda;
    
    @NotNull(message = "Quantidade em estoque é obrigatória")
    private Integer quantidadeEstoque;
    
    private Integer estoqueMinimo;
    private Boolean ativo;
}
