package com.empresa.sge.controller;

import com.empresa.sge.dto.ProdutoDTO;
import com.empresa.sge.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProdutoController {
    
    private final ProdutoService produtoService;
    
    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }
    
    @GetMapping("/ativos")
    public ResponseEntity<List<ProdutoDTO>> listarAtivos() {
        return ResponseEntity.ok(produtoService.listarAtivos());
    }
    
    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<ProdutoDTO>> listarEstoqueBaixo() {
        return ResponseEntity.ok(produtoService.listarEstoqueBaixo());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ESTOQUE_FINANCEIRO')")
    public ResponseEntity<ProdutoDTO> criar(@Valid @RequestBody ProdutoDTO dto) {
        ProdutoDTO criado = produtoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESTOQUE_FINANCEIRO')")
    public ResponseEntity<ProdutoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoDTO dto) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
