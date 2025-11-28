package com.empresa.sge.service;

import com.empresa.sge.dto.DashboardDTO;
import com.empresa.sge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final LancamentoFinanceiroRepository lancamentoFinanceiroRepository;
    private final ItemVendaRepository itemVendaRepository;
    
    @Transactional(readOnly = true)
    public DashboardDTO getDashboardData() {
        DashboardDTO dashboard = new DashboardDTO();
        
        LocalDateTime inicioDia = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime fimDia = LocalDateTime.now().with(LocalTime.MAX);
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime fimMes = LocalDateTime.now().with(LocalTime.MAX);
        
        // Vendas de hoje
        BigDecimal totalHoje = vendaRepository.somarVendasPorPeriodo(inicioDia, fimDia);
        Long quantidadeHoje = vendaRepository.contarVendasPorPeriodo(inicioDia, fimDia);
        dashboard.setTotalVendasHoje(totalHoje != null ? totalHoje : BigDecimal.ZERO);
        dashboard.setQuantidadeVendasHoje(quantidadeHoje != null ? quantidadeHoje : 0L);
        
        // Vendas do mês
        BigDecimal totalMes = vendaRepository.somarVendasPorPeriodo(inicioMes, fimMes);
        Long quantidadeMes = vendaRepository.contarVendasPorPeriodo(inicioMes, fimMes);
        dashboard.setTotalVendasMes(totalMes != null ? totalMes : BigDecimal.ZERO);
        dashboard.setQuantidadeVendasMes(quantidadeMes != null ? quantidadeMes : 0L);
        
        // Financeiro do mês
        LocalDate inicioMesDate = LocalDate.now().withDayOfMonth(1);
        LocalDate fimMesDate = LocalDate.now();
        
        BigDecimal receitas = lancamentoFinanceiroRepository.somarPorTipoEPeriodo("RECEITA", inicioMesDate, fimMesDate);
        BigDecimal despesas = lancamentoFinanceiroRepository.somarPorTipoEPeriodo("DESPESA", inicioMesDate, fimMesDate);
        
        dashboard.setReceitasMes(receitas != null ? receitas : BigDecimal.ZERO);
        dashboard.setDespesasMes(despesas != null ? despesas : BigDecimal.ZERO);
        dashboard.setSaldoMes(dashboard.getReceitasMes().subtract(dashboard.getDespesasMes()));
        
        // Produtos com estoque baixo
        dashboard.setProdutosEstoqueBaixo(produtoRepository.findProdutosEstoqueBaixo().size());
        
        // Produtos mais vendidos (últimos 30 dias)
        LocalDateTime inicio30Dias = LocalDateTime.now().minusDays(30);
        List<Object[]> produtosMaisVendidos = itemVendaRepository.findProdutosMaisVendidos(inicio30Dias, fimMes);
        List<Map<String, Object>> produtos = new ArrayList<>();
        for (Object[] row : produtosMaisVendidos) {
            Map<String, Object> produto = new HashMap<>();
            produto.put("nome", row[0]);
            produto.put("quantidade", row[1]);
            produtos.add(produto);
            if (produtos.size() >= 5) break; // Top 5
        }
        dashboard.setProdutosMaisVendidos(produtos);
        
        return dashboard;
    }
}
