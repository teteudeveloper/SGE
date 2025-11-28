package com.empresa.sge.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardDTO {
    private BigDecimal totalVendasHoje;
    private BigDecimal totalVendasMes;
    private Long quantidadeVendasHoje;
    private Long quantidadeVendasMes;
    private BigDecimal receitasMes;
    private BigDecimal despesasMes;
    private BigDecimal saldoMes;
    private Integer produtosEstoqueBaixo;
    private List<Map<String, Object>> produtosMaisVendidos;
    private List<Map<String, Object>> vendasUltimosDias;
} 
