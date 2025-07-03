"use client";

import { Button, Image, React } from "../../components/ui/index";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen"
      style={{ background: "var(--byte-gradient-teal)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Gráfico financeiro */}
        <section className="mt-16">
          <h2
            className="
              vantagem-title
              mb-8
              text-left
              text-[20px]
              md:text-[25px]
              text-[var(--byte-color-black)]
            "
          >
            Análise Financeira
          </h2>
        </section>
        <section className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-4">
          <div className="w-full lg:w-1/2">
            {/* Mobile: telas menores que md */}
            <h1 className="banner-title-mobile block md:hidden  text-center mb-4 whitespace-pre-line">
              Experimente mais <br />
              liberdade no controle da
              <br />
              vida financeira. Crie <br />
              sua conta com a gente!
            </h1>

            {/* Tablet: de md até lg */}
            <h1 className="banner-title hidden md:block lg:hidden text-center mb-4 whitespace-pre-line">
              Experimente mais liberdade no
              <br />
              controle da sua vida financeira.
              <br />
              Crie sua conta com a gente!
            </h1>

            {/* Desktop: a partir de lg */}
            <h1 className="banner-title  text-center hidden lg:block mb-4 whitespace-pre-line">
              Experimente mais liberdade no
              <br />
              controle da sua vida financeira.
              <br />
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
          <h2
            className="
              vantagem-title
              mb-8
              text-left
              text-[20px]
              md:text-[25px]
              text-[var(--byte-color-black)]
            "
          >
            Vantagens do nosso banco
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4  text-[var(--byte-color-green-500)]">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src="/page/icon-presente.svg"
                alt="Ícone de presente"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="vantagem-title mb-2
              text-[20px]
              ">Conta e cartão gratuitos</h3>
              <p className="vantagem-description text-center text-[var(--byte-text-medium-gray)]">
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
              <h3 className="vantagem-title mb-2 text-[20px]">Saques sem custo</h3>
              <p className="vantagem-description text-center text-[var(--byte-text-medium-gray)]">
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
              <h3 className="vantagem-title mb-2 text-[20px]">Programa de pontos</h3>
              <p className="vantagem-description text-center text-[var(--byte-text-medium-gray)]">
                Acumule pontos com suas compras no crédito sem pagar
                mensalidade!
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
              <h3 className="vantagem-title mb-2 text-[20px]">Seguro Dispositivos</h3>
              <p className="vantagem-description text-center text-[var(--byte-text-medium-gray)]">
                Proteção para seus dispositivos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
