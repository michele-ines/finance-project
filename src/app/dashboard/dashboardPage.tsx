"use client";
import React from "react";
import { Box, Typography, Button } from "../../components/ui/index";

export default function Dashboard() {
  return (
    <Box
      component="section"
      className="w-full min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--byte-gradient-light)" }}
    >
      <Typography
        variant="h3"
        component="h1"
        className="text-center mb-8 font-bold"
      >
        Bem‑vinda ao seu Dashboard 🚀
      </Typography>

      <Typography
        variant="body1"
        className="max-w-xl text-center mb-12 leading-relaxed"
      >
        Aqui você vai encontrar os resumos das suas contas, cartões,
        investimentos e muito mais, tudo em um só lugar.
      </Typography>

      <Button
        variant="contained"
        sx={{ textTransform: "none", borderRadius: "8px" }}
      >
        Ver meu saldo
      </Button>
    </Box>
  );
}
