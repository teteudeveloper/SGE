package com.empresa.sge.repository;

import com.empresa.sge.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByDataMovimentacaoBetween(LocalDateTime inicio, LocalDateTime fim);
    List<MovimentacaoEstoque> findByProdutoId(Long produtoId);
}
