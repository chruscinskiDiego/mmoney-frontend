export const formatCurrency = (value:any) => {
    if (!value) return "R$ 0,00";
    
    const number = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);
  };

  export const formatExpenseCurrency = (value:any) => {
    if (!value) return "0,00"; // Retorna valor padrão se vazio
    const numberValue = parseFloat(value) / 100; // Converte para número real com duas casas decimais
    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  }