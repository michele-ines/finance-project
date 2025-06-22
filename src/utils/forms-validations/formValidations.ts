import { RegisterOptions } from "react-hook-form";
import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  NewTransactionData,
} from "../../interfaces/dashboard";

/* ------------------------------------------------------------------ */
/* 1. Validações do formulário de registro                            */
/* ------------------------------------------------------------------ */
export const registerValidations = {
  name: {
    required: "Nome é obrigatório",
    minLength: { value: 3, message: "Nome deve ter ao menos 3 caracteres" },
    maxLength: { value: 50, message: "Nome muito longo" },
    pattern: {
      value: /^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+$/,
      message: "Nome deve conter apenas letras e espaços",
    },
  } as RegisterOptions<RegisterData, "name">,

  email: {
    required: "Email é obrigatório",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Formato de email inválido",
    },
  } as RegisterOptions<RegisterData, "email">,

  password: {
    required: "Senha é obrigatória",
    minLength: { value: 8, message: "Senha deve ter ao menos 8 caracteres" },
    validate: (value: string) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      return (
        (hasUpper && hasLower && hasNumber) ||
        "Use letras maiúsculas, minúsculas e números"
      );
    },
  } as RegisterOptions<RegisterData, "password">,

  confirmPassword: (passwordValue: string) =>
    ({
      required: "Confirmação de senha é obrigatória",
      validate: (value: string) =>
        value === passwordValue || "As senhas não coincidem",
    } as RegisterOptions<RegisterData, "confirmPassword">),

  terms: {
    required: "Você precisa aceitar os termos",
  } as RegisterOptions<RegisterData, "terms">,
};

/* ------------------------------------------------------------------ */
/* 2. Validações do LoginForm                                         */
/* ------------------------------------------------------------------ */
export const loginValidations = {
  email: {
    required: "Email é obrigatório",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Formato de email inválido",
    },
  } as RegisterOptions<LoginData, "email">,

  password: {
    required: "Senha é obrigatória",
  } as RegisterOptions<LoginData, "password">,
};

/* ------------------------------------------------------------------ */
/* 3. Validações do ForgotPasswordForm                                */
/* ------------------------------------------------------------------ */
export const forgotPasswordValidations = {
  email: loginValidations.email as RegisterOptions<ForgotPasswordData, "email">,
};

/* ------------------------------------------------------------------ */
/* 4. Validações do formulário de Nova Transação                      */
/* ------------------------------------------------------------------ */
/**
 * Até 999.999.999,99 — aceita “R$ ” opcional, separadores de milhar (.), vírgula
 * como decimal e **exige** 2 casas decimais.
 */
const currencyRegexMasked =
  /^(?:R\$\s)?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2})$/;

export const transactionValidations = {
  tipo: {
    required: "Tipo de transação é obrigatório",
  } as RegisterOptions<NewTransactionData, "tipo">,

  valor: {
    required: "Valor é obrigatório",
    pattern: {
      value: currencyRegexMasked,
      message: "Formato de valor inválido. Ex: R$ 1.234,56",
    },
    validate: (value: string) => {
      const numericValue = parseFloat(
        value.replace("R$", "").replace(/\./g, "").replace(",", ".")
      );
      if (isNaN(numericValue) || numericValue <= 0) {
        return "O valor deve ser positivo.";
      }
      if (numericValue > 999_999_999.99) {
        return "O valor máximo é 999.999.999,99.";
      }
      return true;
    },
  } as RegisterOptions<NewTransactionData, "valor">,

  categoria: {
    required: "Categoria é obrigatória",
  } as RegisterOptions<NewTransactionData, "categoria">,
};
