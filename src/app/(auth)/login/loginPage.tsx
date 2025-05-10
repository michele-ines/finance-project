"use client";
import Image from "next/image";
import { Box, Typography } from "../../../components/ui";
import LoginForm from "components/forms/login-form";

export default function LoginPage() {
  return (
    <Box className="flex items-center justify-center min-h-screen bg-[var(--byte-bg-dashboard)] px-4 ">
      <Box className="flex flex-col bg-white rounded-2xl shadow-lg max-w-3xl w-full overflow-hidden my-6">
        {/* Ilustração */}
        <Box className="w-full flex items-center justify-center bg-[var(--byte-bg-light)] pt-6 px-6">
          <Image
            src="/login/ilustracao-login.svg"
            alt="Ilustração de login"
            width={250}
            height={250}
            className="object-contain"
          />
        </Box>

        {/* Formulário - sempre abaixo da imagem */}
        <Box className="w-full p-8 lg:p-12 flex flex-col">
          <Typography
            variant="h5"
            className="font-bold text-center text-black mb-8"
          >
            Login
          </Typography>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}
