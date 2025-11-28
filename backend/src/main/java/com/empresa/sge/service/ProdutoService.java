package com.empresa.sge.service;

import com.empresa.sge.dto.ProdutoDTO;
import com.empresa.sge.exception.BusinessException;
import com.empresa.sge.exception.ResourceNotFoundException;
import com.empresa.sge.model.Categoria;
import com.empresa.sge.model.Produto;
import com.empresa.sge.repository.CategoriaRepository;
import com.empresa.sge.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    
    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarAtivos() {
        return produtoRepository.findByAtivo(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarEstoqueBaixo() {
        return produtoRepository.findProdutosEstoqueBaixo().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return convertToDTO(produto);
    }
    
    @Transactional
    public ProdutoDTO criar(ProdutoDTO dto) {
        if (produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Código de produto já cadastrado");
        }
        
        Produto produto = new Produto();
        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPrecoCusto(dto.getPrecoCusto());
        produto.setPrecoVenda(dto.getPrecoVenda());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo() != null ? dto.getEstoqueMinimo() : 10);
        produto.setAtivo(true);
        
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
            produto.setCategoria(categoria);
        }
        
        produto = produtoRepository.save(produto);
        return convertToDTO(produto);
    }
    
    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        
        if (!produto.getCodigo().equals(dto.getCodigo()) && 
            produtoRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Código de produto já cadastrado");
        }
        
        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPrecoCusto(dto.getPrecoCusto());
        produto.setPrecoVenda(dto.getPrecoVenda());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo());
        
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
            produto.setCategoria(categoria);
        }
        
        if (dto.getAtivo() != null) {
            produto.setAtivo(dto.getAtivo());
        }
        
        produto.setAtualizadoEm(LocalDateTime.now());
        produto = produtoRepository.save(produto);
        return convertToDTO(produto);
    }
    
    @Transactional
    public void deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        produtoRepository.delete(produto);
    }
    
    private ProdutoDTO convertToDTO(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setCodigo(produto.getCodigo());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPrecoCusto(produto.getPrecoCusto());
        dto.setPrecoVenda(produto.getPrecoVenda());
        dto.setQuantidadeEstoque(produto.getQuantidadeEstoque());
        dto.setEstoqueMinimo(produto.getEstoqueMinimo());
        dto.setAtivo(produto.getAtivo());
        
        if (produto.getCategoria() != null) {
            dto.setCategoriaId(produto.getCategoria().getId());
            dto.setCategoriaNome(produto.getCategoria().getNome());
        }
        
        return dto;
    }
}
