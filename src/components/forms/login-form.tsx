"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { Box, Input, Button } from "../ui";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ROUTES } from "constants/routes.constant";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginData>();

  const passwordValue = watch("password", "");

  const onSubmit = (data: LoginData) => {
    console.log("Login:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 flex-1"
    >

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

      <Box className="text-right">
        <a
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-green-600 underline"
        >
          Esqueci a senha!
        </a>
      </Box>

      <Box className="mt-6">
        <Button
          variant="contained"
          color="success"
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Acessar
        </Button>
      </Box>
    </form>
  );
}
