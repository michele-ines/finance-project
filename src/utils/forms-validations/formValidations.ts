import { RegisterOptions } from "react-hook-form";
import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
} from "../../interfaces/dashboard";

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
        hasUpper && hasLower && hasNumber ||
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

// Regras de validação para o LoginForm
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

// Regras de validação para o ForgotPasswordForm
export const forgotPasswordValidations = {
  email: loginValidations.email as RegisterOptions< // reaproveita a mesma regra de email
    ForgotPasswordData,
    "email"
  >,
};
