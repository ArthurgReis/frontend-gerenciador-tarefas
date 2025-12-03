import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { Projeto } from './models/projeto';
import { Tarefa } from './models/tarefa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  
  meusProjetos: Projeto[] = [];
  novoProjeto: Projeto = { nome: '', descricao: '' };
  
  projetoSelecionado: Projeto | null = null;
  tarefasDoProjeto: Tarefa[] = [];
  novaTarefa: Tarefa = { descricao: '', status: 'PENDENTE' };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.apiService.listarProjetos().subscribe(dados => {
      this.meusProjetos = dados;
      this.cdr.detectChanges(); 
    });
  }

  salvarProjeto() {
    if (this.novoProjeto.id) {
      this.apiService.atualizarProjeto(this.novoProjeto).subscribe(() => {
        alert('Projeto atualizado!');
        this.limparFormProjeto();
        this.carregarProjetos();
      });
    } else {
      this.apiService.criarProjeto(this.novoProjeto).subscribe(() => {
        alert('Projeto criado!');
        this.limparFormProjeto();
        this.carregarProjetos();
      });
    }
  }

  excluirProjeto(id: number) {
    if(confirm('Tem certeza? Isso pode apagar as tarefas também.')) {
      this.apiService.deletarProjeto(id).subscribe({
        next: () => {
          if (this.projetoSelecionado?.id === id) {
            this.projetoSelecionado = null;
          }
          this.carregarProjetos();
        },
        error: (erro) => alert('Erro ao excluir. Verifique se existem tarefas vinculadas.')
      });
    }
  }

  editarProjeto(p: Projeto) {
    this.novoProjeto = { ...p }; 
  }

  limparFormProjeto() {
    this.novoProjeto = { nome: '', descricao: '' };
  }


  selecionarProjeto(projeto: Projeto) {
    this.projetoSelecionado = projeto;
    this.carregarTarefas(projeto.id!);
  }

  carregarTarefas(idProjeto: number) {
    this.apiService.listarTarefas(idProjeto).subscribe(dados => {
      this.tarefasDoProjeto = dados;
      this.cdr.detectChanges(); 
    });
  }

  adicionarTarefa() {
    if (!this.projetoSelecionado?.id || !this.novaTarefa.descricao) return;

    this.apiService.criarTarefa(this.projetoSelecionado.id, this.novaTarefa).subscribe(() => {
      this.carregarTarefas(this.projetoSelecionado!.id!);
      this.novaTarefa = { descricao: '', status: 'PENDENTE' }; 
    });
  }

  
  excluirTarefa(tarefa: Tarefa) {
    if (!this.projetoSelecionado?.id || !tarefa.id) return;
    
    if(confirm('Excluir tarefa?')) {
      this.apiService.deletarTarefa(this.projetoSelecionado.id, tarefa.id).subscribe(() => {
        this.carregarTarefas(this.projetoSelecionado!.id!);
      });
    }
  }

  concluirTarefa(tarefa: Tarefa) {
    if (!this.projetoSelecionado?.id) return;

    const novoStatus = tarefa.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
    
    const tarefaAtualizada: Tarefa = { ...tarefa, status: novoStatus };

    this.apiService.atualizarTarefa(this.projetoSelecionado.id, tarefaAtualizada).subscribe({
      next: () => {
        this.carregarTarefas(this.projetoSelecionado!.id!);
      },
      error: (e) => console.error('Erro ao atualizar:', e)
    });
  }
}