"use client";

import ForgotPasswordForm from "components/forms/forgot-password-form";
import Image from "next/image";
import { Box, Typography } from "../../../components/ui";


export default function ForgotPasswordPage() {
  return (
    <Box className="flex items-center justify-center bg-[var(--byte-bg-dashboard)] px-4">
      <Box className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden my-6">
        <Box className="lg:w-1/2 w-full flex items-center justify-center py-12 pl-12">
          <Image
            src="/login/ilustracao-esqueci-senha.svg"
            alt="Ilustração de esqueci senha"
            width={600}
            height={600}
            className="object-cover"
          />
        </Box>

        <Box className="lg:w-1/2 w-full flex items-center justify-center p-8 lg:p-12">
          <Box className="w-full max-w-md">
            <Typography variant="h5" className="font-bold text-black pb-2">
              Esqueci minha senha
            </Typography>
            <ForgotPasswordForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
