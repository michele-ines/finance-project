"use client";
import { Box, Button, React, PersonalCardsStyles as styles } from "../../ui";
import Image from "next/image";

export default function PersonalCards() {
  return (
    <Box
      className={`${styles.cardPersonalCards} cardTransacao w-full min-h-[478px]`}
    >
      <h3 className={`${styles.cardTitle} w-full text-center md:text-start`}>
        Meus Cartões
      </h3>
      <Box className="flex flex-col gap-4 w-full">
        <h4 className={`${styles.descriptionCard} text-center md:text-start`}>
          Cartão físico
        </h4>
        <Box className="w-full flex flex-col items-center md:flex-row gap-8">
          <Image
            src="/dash-card-my-cards/cartao-fisico.svg"
            alt="Ilustração de um cartão bancário na cor azul com nome do banco e do titular visíveis na frente"
            width={327}
            height={164}
            priority
            className="max-w-[280px] 2xl:max-w-none max-h-[148px] 2xl:max-h-none text-center"
          />
          <Box className="flex flex-col items-center gap-4 w-full">
            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 font-medium text-base"
              style={{
                background: "var(--byte-color-orange-500)",
                color: "var(--byte-bg-default)",
              }}
            >
              Configurar
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={`w-full py-3 font-medium text-base ${styles.buttonBlock}`}
            >
              Bloquear
            </Button>
            <span className={styles.descriptionFunctionCard}>
              Função: Débito/Crédito
            </span>
          </Box>
        </Box>
        <h4 className={`${styles.descriptionCard} text-center md:text-start`}>
          Cartão digital
        </h4>
        <Box className="w-full flex flex-col items-center md:flex-row gap-8">
          <Image
            src="/dash-card-my-cards/cartao-digital.svg"
            alt="Ilustração de um cartão bancário na cor cinza com nome do banco e do titular visíveis na frente"
            width={327}
            height={164}
            priority
            className="max-w-[280px] 2xl:max-w-none max-h-[148px] 2xl:max-h-none text-center"
          />

          <Box className="flex flex-col items-center gap-4 w-full">
            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 font-medium text-base"
              style={{
                background: "var(--byte-color-orange-500)",
                color: "var(--byte-bg-default)",
              }}
            >
              Configurar
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={`w-full py-3 font-medium text-base ${styles.buttonBlock}`}
            >
              Bloquear
            </Button>

            <span className={styles.descriptionFunctionCard}>
              Função: Débito
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
