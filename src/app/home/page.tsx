"use client";
import React from "react";
import { Button, Image } from "../../components/ui/index";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen"
      style={{ background: "var(--byte-gradient-teal)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <section className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-4">
          <div className="w-full lg:w-1/2">
            <h1 className="banner-title whitespace-pre-line mb-4 text-center block md:hidden">
              Experimente mais liberdade e controle da sua vida financeira.
              Crie sua conta com a gente!
            </h1>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/page/banner-ilustracao.svg"
              alt="Banner ilustrativo do ByteBank"
              width={600}
              height={400}
              priority
              className="max-w-full h-auto"
            />
          </div>
        </section>

        <section className="mt-8 block md:hidden">
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="contained"
              className="px-6 py-2"
              style={{
                background: "var(--byte-color-black)",
                color: "var(--byte-bg-default)",
              }}
              sx={{ textTransform: "none" }}
            >
              Abrir Conta
            </Button>
            <Button
              variant="outlined"
              className="px-6 py-2"
              style={{
                border: "2px solid var(--byte-color-black)",
                color: "var(--byte-color-black)",
                background: "transparent",
              }}
              sx={{ textTransform: "none" }}
            >
              Já tenho conta
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="vantagens-titulo mb-8 text-left">
            Vantagens do nosso banco
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src="/page/icon-presente.svg"
                alt="Ícone de presente"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="vantagem-title mb-2">Conta e cartão gratuitos</h3>
              <p className="vantagem-description">
                Conta digital sem custo fixo e sem tarifa de manutenção.
              </p>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src="/page/icon-saque.svg"
                alt="Ícone de saque"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="vantagem-title mb-2">Saques sem custo</h3>
              <p className="vantagem-description">
                Saques grátis 4x por mês em qualquer Banco 24h.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src="/page/icon-pontos.svg"
                alt="Ícone de pontos"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="vantagem-title mb-2">Programa de pontos</h3>
              <p className="vantagem-description">
                Acumule pontos com suas compras no crédito sem pagar mensalidade!
              </p>
            </div>
            {/* Card 4 */}
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src="/page/icon-dispositivos.svg"
                alt="Ícone de dispositivos"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="vantagem-title mb-2">Seguro Dispositivos</h3>
              <p className="vantagem-description">
                Proteção para seus dispositivos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
