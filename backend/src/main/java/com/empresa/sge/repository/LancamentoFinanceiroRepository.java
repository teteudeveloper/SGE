package com.empresa.sge.repository;

import com.empresa.sge.model.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {
    List<LancamentoFinanceiro> findByDataVencimentoBetween(LocalDate inicio, LocalDate fim);
    List<LancamentoFinanceiro> findByStatus(String status);
    
    @Query("SELECT COALESCE(SUM(lf.valor), 0) FROM LancamentoFinanceiro lf " +
           "WHERE lf.tipo = :tipo AND lf.status = 'PAGO' " +
           "AND lf.dataPagamento BETWEEN :inicio AND :fim")
    BigDecimal somarPorTipoEPeriodo(@Param("tipo") String tipo, 
                                    @Param("inicio") LocalDate inicio, 
                                    @Param("fim") LocalDate fim);
}
