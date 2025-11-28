package com.empresa.sge.controller;

import com.empresa.sge.dto.VendaDTO;
import com.empresa.sge.service.VendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendaController {

    private final VendaService vendaService;

    @GetMapping
    public ResponseEntity<List<VendaDTO>> listarTodas() {
        return ResponseEntity.ok(vendaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<VendaDTO> criar(@Valid @RequestBody VendaDTO dto) {
        VendaDTO criado = vendaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }
}
