"use client";
import Image from "next/image";
import { Box, Typography } from "../../../components/ui";
import RegisterForm from "components/forms/register-form";
// import { ROUTES } from "constants/routes.constant";

export default function RegisterPage() {
  return (
    <Box className="flex items-center justify-center min-h-screen bg-[var(--byte-bg-dashboard)] px-4">
      <Box className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden my-6">
        {/* Ilustração centralizada */}
        <Box className=" lg:flex lg:items-center lg:justify-center lg:w-1/2 py-12 pl-12">
          <Image
            src="/cadastro/ilustração-cadastro.svg"
            alt="Ilustração de cadastro"
            width={600}
            height={600}
            className="object-cover"
          />
        </Box>

        {/* Formulário */}
        <Box className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col ">
          <Typography variant="h5" className="font-bold text-black pb-2">
            Preencha os campos abaixo para criar sua conta corrente!
          </Typography>
          <RegisterForm />
        </Box>
      </Box>
    </Box>
  );
}
