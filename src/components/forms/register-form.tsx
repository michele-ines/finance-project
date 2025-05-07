"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Input,
  Checkbox,
  Button,
  VisibilityOffIcon,
  VisibilityIcon,
} from "../ui";
import clsx from "clsx";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    mode: "onBlur",
  });

  const passwordValue = watch("password", "");
  const confirmValue = watch("confirmPassword", "");

  const onSubmit = (data: RegisterData) => {
    console.log("Cadastro:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 flex-1"
      noValidate
    >
      {/* Nome */}
      <Box className="flex flex-col">
        <label
          htmlFor="name"
          className="my-2 text-sm font-medium text-gray-700"
        >
          Nome
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Digite seu nome completo"
          disableUnderline
          className={clsx("w-full px-4 py-3 rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.name,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.name,
          })}
          {...register("name", {
            required: "Nome é obrigatório",
            minLength: {
              value: 3,
              message: "Nome deve ter ao menos 3 caracteres",
            },
            maxLength: { value: 50, message: "Nome muito longo" },
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+$/,
              message: "Nome deve conter apenas letras e espaços",
            },
          })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </Box>

      {/* Email */}
      <Box className="flex flex-col">
        <label
          htmlFor="email"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          disableUnderline
          className={clsx("w-full px-4 py-3 rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.email,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.email,
          })}
          {...register("email", {
            required: "Email é obrigatório",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de email inválido",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </Box>

      {/* Senha */}
      <Box className="flex flex-col">
        <label
          htmlFor="password"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <div
          className={clsx("flex items-center rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.password,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.password,
          })}
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            disableUnderline
            className="flex-1 bg-transparent px-4 py-3 placeholder-gray-400 focus:outline-none"
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: {
                value: 8,
                message: "Senha deve ter ao menos 8 caracteres",
              },
              validate: (value) => {
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                if (!hasUpper || !hasLower || !hasNumber) {
                  return "Use letras maiúsculas, minúsculas e números";
                }
                return true;
              },
            })}
          />
          {passwordValue.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-4 focus:outline-none"
            >
              {showPassword ? (
                <VisibilityOffIcon className="text-green-700" />
              ) : (
                <VisibilityIcon className="text-green-700" />
              )}
            </button>
          )}
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </Box>

      {/* Confirmar Senha */}
      <Box className="flex flex-col">
        <label
          htmlFor="confirmPassword"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Confirmar senha
        </label>
        <div
          className={clsx("flex items-center rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.confirmPassword,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.confirmPassword,
          })}
        >
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repita sua senha"
            disableUnderline
            className="flex-1 bg-transparent px-4 py-3 placeholder-gray-400 focus:outline-none"
            {...register("confirmPassword", {
              required: "Confirmação de senha é obrigatória",
              validate: (value) =>
                value === passwordValue || "As senhas não coincidem",
            })}
          />
          {confirmValue.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="px-4 focus:outline-none"
            >
              {showConfirmPassword ? (
                <VisibilityOffIcon className="text-green-700" />
              ) : (
                <VisibilityIcon className="text-green-700" />
              )}
            </button>
          )}
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}
      </Box>

      {/* Checkbox */}
      <Box className="flex items-start mt-2">
        <Checkbox
          id="terms"
          {...register("terms", {
            required: "Você precisa aceitar os termos",
          })}
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          Li e estou ciente quanto às condições de tratamento dos meus dados
          conforme descrito na Política de Privacidade do banco.
        </label>
      </Box>
      {errors.terms && (
        <span className="text-red-500 text-sm">{errors.terms.message}</span>
      )}

      {/* Botão */}
      <Box className="mt-6">
        <Button
          type="submit"
          variant="contained"
          style={{
            background: "var(--byte-color-orange-500)",
            color: "var(--byte-bg-default)",
          }}
          className="w-full justify-center py-3"
        >
          Criar conta
        </Button>
      </Box>
    </form>
  );
}
