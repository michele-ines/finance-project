"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { Box, Input, Button } from "../ui";
import { ForgotPasswordData } from "interfaces/dashboard";
import { forgotPasswordValidations } from "utils/forms-validations/formValidations";
import { ROUTES } from "config-routes/routes";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      // Chame sua API para enviar e-mail de recuperação
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className="max-w-md">
      {submitted ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
          Um link para redefinição de senha foi enviado para seu e-mail.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
        >
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
              <span className="text-red-500 text-sm">
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
