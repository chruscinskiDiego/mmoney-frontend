export interface IExpense {
  id: number;
  value: number;
  situation: 'P' | 'Q'; // Situação da despesa ('Pendente' ou 'Quitada')
  obs: string; // Observação
  date: string; // Data da transação no formato ISO (YYYY-MM-DD)
  category: {
    id: number; // ID da categoria
    name: string; // Nome da categoria
    user: string; // Usuário associado à categoria
  };
  bank_account: {
    id: number; // ID da conta bancária
    number: string; // Número da conta bancária
    type: string; // Tipo da conta bancária (ex: Poupança, Corrente)
  };
}
