import { useState } from "react";

import {
  Image,
  Box,
  FormControl,
  Input,
  Button,
  CardMyAccountStyles as styles,
} from "../ui";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};

export function CardMyAccount() {
  const [infoUser, setInfoUser] = useState<UserInfo>({
    name: "Joana da Silva Oliveira",
    email: "joanadasilvaoliveira@email.com.br",
    password: "******",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInfoUser((prevState: UserInfo) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box className={`${styles.cardContainer} w-full h-full`}>
      <section className="flex flex-col gap-6 w-full h-full">
        <h3 className={styles.myAccountTitle}>Minha conta</h3>
        <Box className="flex flex-col lg:flex-row-reverse w-full h-full">
          <Box className="flex flex-col gap-6 w-full h-full mx-3">
            <FormControl>
              <p className={styles.myAccountLabel}>Nome</p>
              <Input
                placeholder="Joana da Silva Oliveira"
                value={infoUser.name}
                className={`${styles.myAcccountInput}`}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <p className={styles.myAccountLabel}>Email</p>
              <Input
                placeholder="joanadasilvaoliveira@email.com.br"
                value={infoUser.email}
                name="email"
                onChange={handleInputChange}
                className={`${styles.myAcccountInput}`}
              />
            </FormControl>
            <FormControl>
              <p className={styles.myAccountLabel}>Senha</p>
              <Input
                placeholder="******"
                value={infoUser.password}
                name="password"
                onChange={handleInputChange}
                type="password"
                className={`${styles.myAcccountInput}`}
              />
            </FormControl>

            <Button
              variant="contained"
              style={{
                background: "var( --byte-color-orange-500)",
                color: "var(--byte-bg-default)",
                maxWidth: "200px",
                margin: "0 auto",
              }}
              onClick={() => console.log("Salvando alterações...")}
            >
              Salvar alterações
            </Button>
          </Box>

          <Image
            src="/dash-card-my-account/Ilustração.svg"
            alt="Ilustração de uma mulher com cabelo castanho claro, usando um vestido azul e segurando um celular"
            width={600}
            height={400}
            priority
            className="max-w-full h-auto max-h-[381px] text-center w-full m-7 lg:mt-0"
          />
        </Box>
      </section>
    </Box>
  );
}
