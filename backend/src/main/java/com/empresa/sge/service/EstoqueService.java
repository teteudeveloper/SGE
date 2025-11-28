package com.empresa.sge.service;

import com.empresa.sge.dto.MovimentacaoEstoqueDTO;
import com.empresa.sge.model.MovimentacaoEstoque;
import com.empresa.sge.repository.MovimentacaoEstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public List<MovimentacaoEstoqueDTO> listarMovimentacoes() {
        List<MovimentacaoEstoque> movimentacoes = movimentacaoEstoqueRepository.findAll();
        return movimentacoes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MovimentacaoEstoqueDTO toDTO(MovimentacaoEstoque mov) {
        return new MovimentacaoEstoqueDTO(
                mov.getId(),
                mov.getProduto() != null ? mov.getProduto().getId() : null,
                mov.getProduto() != null ? mov.getProduto().getCodigo() : null,
                mov.getProduto() != null ? mov.getProduto().getNome() : null,
                mov.getTipo(),
                mov.getQuantidade(),
                mov.getMotivo(),
                mov.getUsuario() != null ? mov.getUsuario().getId() : null,
                mov.getUsuario() != null ? mov.getUsuario().getNome() : null,
                mov.getVenda() != null ? mov.getVenda().getId() : null,
                mov.getDataMovimentacao(),
                mov.getObservacoes()
        );
    }
}
