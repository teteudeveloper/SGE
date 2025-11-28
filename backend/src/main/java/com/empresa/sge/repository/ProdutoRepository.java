package com.empresa.sge.repository;

import com.empresa.sge.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByCodigo(String codigo);
    List<Produto> findByAtivo(Boolean ativo);
    List<Produto> findByQuantidadeEstoqueLessThanEqualAndAtivo(Integer quantidade, Boolean ativo);
    
    @Query("SELECT p FROM Produto p WHERE p.quantidadeEstoque <= p.estoqueMinimo AND p.ativo = true")
    List<Produto> findProdutosEstoqueBaixo();
    
    boolean existsByCodigo(String codigo);
}
