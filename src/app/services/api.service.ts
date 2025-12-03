import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Projeto } from '../models/projeto'; 
import { Tarefa } from '../models/tarefa'; 

@Injectable({
  providedIn: 'root' 
})
export class ApiService {
  
  private apiUrl = 'http://localhost:8080/trabalho/projeto';

  constructor(private http: HttpClient) { }


  listarProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.apiUrl);
  }

  criarProjeto(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(`${this.apiUrl}/cadastrar`, projeto);
  }

  deletarProjeto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`);
  }

  atualizarProjeto(projeto: Projeto): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.apiUrl}/atualizar/${projeto.id}`, projeto);
  }

  criarTarefa(idProjeto: number, tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${this.apiUrl}/${idProjeto}/tarefa`, tarefa);
  }

  listarTarefas(idProjeto: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/${idProjeto}/tarefa`);
  }
  
  deletarTarefa(idProjeto: number, idTarefa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idProjeto}/tarefa/deletar/${idTarefa}`);
  }
  
  atualizarTarefa(idProjeto: number, tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${idProjeto}/tarefa/atualizar/${tarefa.id}`, tarefa);
  }
}