// src/utils/formatters.js

// Máscara de telefone: (11) 99999-9999
export const formatPhone = (value) => {
  if (!value) return "";
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");
  
  // Aplica máscara
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
};

// Máscara de CPF: 999.999.999-99
export const formatCPF = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Máscara de CEP: 99999-999
export const formatCEP = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

// Máscara de dinheiro: R$ 1.000,00
export const formatCurrency = (value) => {
  if (!value) return "R$ 0,00";
  
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, "");
  
  // Converte para número
  const number = parseInt(numbers) / 100;
  
  // Formata para moeda brasileira
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

// Validação de email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de telefone (mínimo 10 dígitos)
export const validatePhone = (phone) => {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10;
};

// Validação de CPF (apenas formato)
export const validateCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, "");
  return numbers.length === 11;
};

// Função para remover máscara (devolve apenas números)
export const removeMask = (value) => {
  return value.replace(/\D/g, "");
};