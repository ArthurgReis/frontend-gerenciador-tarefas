export interface Tarefa {
  id?: number;
  descricao: string;
  
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'; 
  dataLimite?: string; 
  projetoId?: number; 
}