package com.empresa.sge.controller;

import com.empresa.sge.dto.LancamentoFinanceiroDTO;
import com.empresa.sge.service.FinanceiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/financeiro")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','ESTOQUE_FINANCEIRO')")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    @GetMapping("/lancamentos")
    public List<LancamentoFinanceiroDTO> listarLancamentos() {
        return financeiroService.listarLancamentos();
    }
}
