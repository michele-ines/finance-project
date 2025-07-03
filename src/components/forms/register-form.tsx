"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Input,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../ui";

import { RegisterData } from "../../interfaces/dashboard";
import { registerValidations } from "../../utils/forms-validations/formValidations";

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
    // A11Y: Adicionar validação no envio para garantir que todos os erros sejam capturados.
    reValidateMode: "onChange",
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
      // A11Y: Adicionar novalidate para impedir a validação HTML5 padrão e usar apenas a do React Hook Form.
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
          {...register("name", registerValidations.name)}
          // A11Y: Indica que o campo é inválido quando há um erro.
          aria-invalid={!!errors.name}
          // A11Y: Associa o input à sua mensagem de erro.
          aria-describedby="name-error"
        />
        {errors.name && (
          <span
            id="name-error"
            // A11Y: Garante que leitores de tela anunciem o erro quando ele aparecer.
            role="alert"
            className="text-red-500 text-sm"
          >
            {errors.name.message}
          </span>
        )}
      </Box>

      {/* Email */}
      <Box className="flex flex-col">
        <label
          htmlFor="email"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          E-mail cadastrado
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email cadastrado"
          disableUnderline
          className={clsx("w-full px-4 py-3 rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.email,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.email,
          })}
          {...register("email", registerValidations.email)}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <span id="email-error" role="alert" className="text-red-500 text-sm">
            {errors.email.message}
          </span>
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
            {...register("password", registerValidations.password)}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          {passwordValue.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-4 focus:outline-none"
              // A11Y: Adiciona um rótulo acessível para o botão de ícone.
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
          <span
            id="password-error"
            role="alert"
            className="text-red-500 text-sm"
          >
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
            {...register(
              "confirmPassword",
              registerValidations.confirmPassword(passwordValue)
            )}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby="confirmPassword-error"
          />
          {confirmValue.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="px-4 focus:outline-none"
              aria-label={
                showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
              }
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
          <span
            id="confirmPassword-error"
            role="alert"
            className="text-red-500 text-sm"
          >
            {errors.confirmPassword.message}
          </span>
        )}
      </Box>

      {/* Checkbox */}
      <Box className="flex flex-col">
        <div className="flex items-start mt-2">
            <Checkbox
              id="terms"
              {...register("terms", registerValidations.terms)}
              // A11Y: Associa o checkbox ao seu erro.
              aria-invalid={!!errors.terms}
              aria-describedby="terms-error"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Li e estou ciente quanto às condições de tratamento dos meus dados
              conforme descrito na Política de Privacidade do banco.
            </label>
        </div>
        {errors.terms && (
            <span id="terms-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.terms.message}
            </span>
        )}
      </Box>
      
      {/* Botão */}
      <Box className="mt-6">
        {/* A11Y: Lembre-se de verificar o contraste de cor.
            A cor do texto (var(--byte-bg-default)) deve ter um contraste
            de pelo menos 4.5:1 com o fundo (var(--byte-color-orange-500)).
            Use uma ferramenta online de "contrast checker".
        */}
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