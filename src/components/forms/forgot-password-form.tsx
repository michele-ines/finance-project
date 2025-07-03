// src/components/forms/forgot-password-form.tsx

"use client"; // ✅ DIRETIVA ADICIONADA AQUI

import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

import { Box, Button, Input } from "../ui";

import { ROUTES } from "../../config-routes/routes";
import { ForgotPasswordData } from "../../interfaces/dashboard";
import { forgotPasswordValidations } from "../../utils/forms-validations/formValidations";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
  } = useForm<ForgotPasswordData>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula a chamada da API

      // Simulação de um erro de API para teste
      if (data.email === "erro@exemplo.com") {
        throw new Error("Este e-mail não foi encontrado.");
      }
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

      setError("email", { type: "manual", message });
      setFocus("email");
    }
  };

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.focus();
    }
  }, [submitted]);

  return (
    <Box className="max-w-md">
      {submitted ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Um link para redefinição de senha foi enviado para seu e-mail.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
          aria-busy={isSubmitting}
          noValidate
        >
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
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={clsx(
                "w-full px-4 py-3 rounded-lg focus-within:ring-2",
                {
                  "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
                    !errors.email,
                  "bg-gray-100 border border-red-500 focus-within:ring-red-300":
                    !!errors.email,
                }
              )}
              {...register("email", forgotPasswordValidations.email)}
            />
            {errors.email && (
              <span
                id="email-error"
                role="alert"
                className="text-red-500 text-sm mt-1"
              >
                {errors.email.message}
              </span>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
            {isSubmitting && (
              <span className="sr-only">. Enviando sua solicitação.</span>
            )}
          </Button>

          <Box className="text-center my-6">
            <a href={ROUTES.HOME} className="text-sm text-green-600 underline">
              Voltar ao login
            </a>
          </Box>
        </form>
      )}
    </Box>
  );
}
