"use client";
import { Box, Typography } from "../../../components/ui";

export default function MyAccountPage() {
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
        <Typography variant="h5" className="text-black">
            Minha Conta - Página renderizada com sucesso!
        </Typography>
        </Box>
      </Box>
    </Box>
  );
}
