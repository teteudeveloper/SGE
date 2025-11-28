package com.empresa.sge.controller;

import com.empresa.sge.dto.MovimentacaoEstoqueDTO;
import com.empresa.sge.service.EstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/estoque")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','ESTOQUE_FINANCEIRO')")
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping("/movimentacoes")
    public List<MovimentacaoEstoqueDTO> listarMovimentacoes() {
        return estoqueService.listarMovimentacoes();
    }
}
