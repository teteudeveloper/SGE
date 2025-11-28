package com.empresa.sge.repository;

import com.empresa.sge.model.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
    
    @Query("SELECT iv.produto.nome, SUM(iv.quantidade) as total " +
           "FROM ItemVenda iv " +
           "WHERE iv.venda.dataVenda BETWEEN :inicio AND :fim " +
           "GROUP BY iv.produto.id, iv.produto.nome " +
           "ORDER BY total DESC")
    List<Object[]> findProdutosMaisVendidos(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}
