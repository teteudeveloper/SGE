package com.empresa.sge.repository;

import com.empresa.sge.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim);
    
    @Query("SELECT COUNT(v) FROM Venda v WHERE v.dataVenda BETWEEN :inicio AND :fim")
    Long contarVendasPorPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
    
    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venda v WHERE v.dataVenda BETWEEN :inicio AND :fim AND v.status = 'CONCLUIDA'")
    java.math.BigDecimal somarVendasPorPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}
