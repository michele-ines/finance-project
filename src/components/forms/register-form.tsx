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

import { RegisterData } from "interfaces/dashboard";
import { registerValidations } from "utils/forms-validations/formValidations";

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
            {...register("password", registerValidations.password)}
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
            {...register(
              "confirmPassword",
              registerValidations.confirmPassword(passwordValue)
            )}
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
          {...register("terms", registerValidations.terms)}
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
