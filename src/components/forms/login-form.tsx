"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useState, useId } from "react"; 

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Box, Button, Input } from "../ui";

import { ROUTES } from "config-routes/routes";
import { LoginData } from "interfaces/dashboard";
import { loginValidations } from "utils/forms-validations/formValidations";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const emailErrorId = useId();
  const passwordErrorId = useId();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    mode: "onBlur",
  });

  const passwordValue = watch("password", "");

  const processSubmit = async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 1000));
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(processSubmit)(e);
      }}
      className="flex flex-col space-y-6 flex-1"
      aria-busy={isSubmitting}
      noValidate // Impede a validação nativa do navegador
    >
      {/* Email */}
      <Box className="flex flex-col">
        <label
          htmlFor="email"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email cadastrado"
          disableUnderline
          // ✅ aria-invalid sinaliza um campo inválido
          aria-invalid={!!errors.email}
          // ✅ aria-describedby conecta o campo à sua mensagem de erro
          aria-describedby={errors.email ? emailErrorId : undefined}
          className={clsx("w-full px-4 py-3 rounded-lg focus-within:ring-2", {
            "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
              !errors.email,
            "bg-gray-100 border border-red-500 focus-within:ring-red-300":
              !!errors.email,
          })}
          {...register("email", loginValidations.email)}
        />
        {errors.email && (
          // ✅ A mensagem de erro tem um id e role="alert" para ser anunciada
          <span
            id={emailErrorId}
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
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
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? passwordErrorId : undefined}
            className="flex-1 bg-transparent px-4 py-3 placeholder-gray-400 focus:outline-none"
            {...register("password", loginValidations.password)}
          />
          {passwordValue.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-4 focus:outline-none"
              // ✅ aria-label dá um nome acessível ao botão de ícone
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
            id={passwordErrorId}
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
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
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? "Acessando..." : "Acessar"}
          {/* ✅ Texto adicional para leitores de tela durante o envio */}
          {isSubmitting && (
            <span className="sr-only">. O formulário está sendo enviado.</span>
          )}
        </Button>
      </Box>
    </form>
  );
}
