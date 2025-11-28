package com.empresa.sge.service;

import com.empresa.sge.dto.ItemVendaDTO;
import com.empresa.sge.dto.VendaDTO;
import com.empresa.sge.exception.BusinessException;
import com.empresa.sge.exception.ResourceNotFoundException;
import com.empresa.sge.model.*;
import com.empresa.sge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendaService {
    
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemVendaRepository itemVendaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final LancamentoFinanceiroRepository lancamentoFinanceiroRepository;
    
    @Transactional(readOnly = true)
    public List<VendaDTO> listarTodas() {
        return vendaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public VendaDTO buscarPorId(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada"));
        return convertToDTO(venda);
    }
    
    @Transactional
    public VendaDTO criar(VendaDTO dto) {
        // Validar usuário
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        // Criar venda
        Venda venda = new Venda();
        venda.setNumeroVenda(gerarNumeroVenda());
        venda.setUsuario(usuario);
        venda.setClienteNome(dto.getClienteNome());
        venda.setClienteCpf(dto.getClienteCpf());
        venda.setFormaPagamento(dto.getFormaPagamento());
        venda.setObservacoes(dto.getObservacoes());
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal descontoTotal = dto.getDesconto() != null ? dto.getDesconto() : BigDecimal.ZERO;
        
        // Processar itens
        for (ItemVendaDTO itemDTO : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + itemDTO.getProdutoId()));
            
            // Verificar estoque
            if (produto.getQuantidadeEstoque() < itemDTO.getQuantidade()) {
                throw new BusinessException("Estoque insuficiente para o produto: " + produto.getNome());
            }
            
            // Criar item da venda
            ItemVenda item = new ItemVenda();
            item.setVenda(venda);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(produto.getPrecoVenda());
            
            BigDecimal subtotalItem = produto.getPrecoVenda().multiply(new BigDecimal(itemDTO.getQuantidade()));
            BigDecimal descontoItem = itemDTO.getDesconto() != null ? itemDTO.getDesconto() : BigDecimal.ZERO;
            BigDecimal totalItem = subtotalItem.subtract(descontoItem);
            
            item.setSubtotal(subtotalItem);
            item.setDesconto(descontoItem);
            item.setTotal(totalItem);
            
            venda.getItens().add(item);
            subtotal = subtotal.add(subtotalItem);
            
            // Atualizar estoque
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDTO.getQuantidade());
            produtoRepository.save(produto);
            
            // Registrar movimentação de estoque
            MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
            movimentacao.setProduto(produto);
            movimentacao.setTipo("SAIDA");
            movimentacao.setQuantidade(itemDTO.getQuantidade());
            movimentacao.setMotivo("Venda");
            movimentacao.setUsuario(usuario);
            movimentacao.setVenda(venda);
            movimentacaoEstoqueRepository.save(movimentacao);
        }
        
        BigDecimal total = subtotal.subtract(descontoTotal);
        venda.setSubtotal(subtotal);
        venda.setDesconto(descontoTotal);
        venda.setTotal(total);
        venda.setStatus("CONCLUIDA");
        
        venda = vendaRepository.save(venda);
        
        // Criar lançamento financeiro (receita)
        LancamentoFinanceiro lancamento = new LancamentoFinanceiro();
        lancamento.setTipo("RECEITA");
        lancamento.setCategoria("Venda");
        lancamento.setDescricao("Venda " + venda.getNumeroVenda());
        lancamento.setValor(total);
        lancamento.setDataVencimento(LocalDateTime.now().toLocalDate());
        lancamento.setDataPagamento(LocalDateTime.now().toLocalDate());
        lancamento.setStatus("PAGO");
        lancamento.setFormaPagamento(venda.getFormaPagamento());
        lancamento.setVenda(venda);
        lancamento.setUsuario(usuario);
        lancamentoFinanceiroRepository.save(lancamento);
        
        return convertToDTO(venda);
    }
    
    private String gerarNumeroVenda() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "VND-" + timestamp;
    }
    
    private VendaDTO convertToDTO(Venda venda) {
        VendaDTO dto = new VendaDTO();
        dto.setId(venda.getId());
        dto.setNumeroVenda(venda.getNumeroVenda());
        dto.setDataVenda(venda.getDataVenda());
        dto.setUsuarioId(venda.getUsuario().getId());
        dto.setUsuarioNome(venda.getUsuario().getNome());
        dto.setClienteNome(venda.getClienteNome());
        dto.setClienteCpf(venda.getClienteCpf());
        dto.setSubtotal(venda.getSubtotal());
        dto.setDesconto(venda.getDesconto());
        dto.setTotal(venda.getTotal());
        dto.setFormaPagamento(venda.getFormaPagamento());
        dto.setObservacoes(venda.getObservacoes());
        dto.setStatus(venda.getStatus());
        
        List<ItemVendaDTO> itensDTO = venda.getItens().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setItens(itensDTO);
        
        return dto;
    }
    
    private ItemVendaDTO convertItemToDTO(ItemVenda item) {
        ItemVendaDTO dto = new ItemVendaDTO();
        dto.setId(item.getId());
        dto.setProdutoId(item.getProduto().getId());
        dto.setProdutoNome(item.getProduto().getNome());
        dto.setProdutoCodigo(item.getProduto().getCodigo());
        dto.setQuantidade(item.getQuantidade());
        dto.setPrecoUnitario(item.getPrecoUnitario());
        dto.setSubtotal(item.getSubtotal());
        dto.setDesconto(item.getDesconto());
        dto.setTotal(item.getTotal());
        return dto;
    }
}
