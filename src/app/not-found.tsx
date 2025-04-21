"use client";
import React from "react";
import { Button, Image } from "../components/ui/index"; // Ajuste o import se necessário

export default function NotFound() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center text-center"
      // Mude esse estilo de fundo para algo que lembre o gradient do seu design
      style={{
        background: "var(--byte-gradient-teal)",
        color: "var(--byte-color-black)",
      }}
    >
      {/* Título e texto */}
      <h1 className="vantagens-titulo text-3xl font-bold mt-10">
      Ops! Não encontramos a página...
      </h1>
      <p className="vantagem-description mt-6">
      E olha que exploramos o universo procurando por ela! 
      Que tal voltar e tentar novamente?
      </p>

      {/* Botão para voltar à Home */}
      <div className="mt-8">
        <Button
          variant="contained"
          style={{
            background: "var( --byte-color-orange-500)",
            color: "var(--byte-bg-default)",
          }}
          onClick={() => (window.location.href = "/home")}
        >
          Voltar ao Início
        </Button>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Ilustração do OVNI 404 */}
        <Image
          src="/page/ilustração-error-404.svg"
          alt="Ilustração de OVNI para página 404"
          width={470}
          height={354}
          priority
          className="mx-auto"
        />
      </div>
    </div>
  );
}
