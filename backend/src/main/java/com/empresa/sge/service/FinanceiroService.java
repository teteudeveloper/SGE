package com.empresa.sge.service;

import com.empresa.sge.dto.LancamentoFinanceiroDTO;
import com.empresa.sge.model.LancamentoFinanceiro;
import com.empresa.sge.repository.LancamentoFinanceiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceiroService {

    private final LancamentoFinanceiroRepository lancamentoFinanceiroRepository;

    public List<LancamentoFinanceiroDTO> listarLancamentos() {
        List<LancamentoFinanceiro> lancamentos = lancamentoFinanceiroRepository.findAll();
        return lancamentos.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private LancamentoFinanceiroDTO toDTO(LancamentoFinanceiro lanc) {
        return new LancamentoFinanceiroDTO(
                lanc.getId(),
                lanc.getTipo(),
                lanc.getCategoria(),
                lanc.getDescricao(),
                lanc.getValor(),
                lanc.getDataVencimento(),
                lanc.getDataPagamento(),
                lanc.getStatus(),
                lanc.getFormaPagamento(),
                lanc.getVenda() != null ? lanc.getVenda().getId() : null,
                lanc.getUsuario() != null ? lanc.getUsuario().getId() : null,
                lanc.getUsuario() != null ? lanc.getUsuario().getNome() : null,
                lanc.getObservacoes()
        );
    }
}
