import { useState } from "react";

import {
  Box,
  FormControl,
  Button,
  CardMyAccountStyles as styles,
  IconButton,
} from "../../ui";

import {
  OutlinedInput,
  FormHelperText,
  InputAdornment,
} from "@mui/material";

import {
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { registerValidations } from "utils/forms-validations/formValidations";
import { RegisterData } from "interfaces/dashboard";
import { useForm } from "react-hook-form";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};


const initialUser: UserInfo = {
  name: "Joana da Silva Oliveira",
  email: "joanadasilvaoliveira@email.com.br",
  password: "(@79Tp6840)",
};


export function CardMyAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    password: false,
  });

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    mode: "onBlur",
    defaultValues: initialUser,
  });

  const passwordValue = watch("password", "");

  const toggleEdit = (field: keyof typeof isEditable) =>
    setIsEditable((prev) => ({ ...prev, [field]: !prev[field] }));

  // const onSubmit = (data: RegisterData) => {
  //   console.log("Cadastro:", data);
  // };

  // === Funções de estilo ===
  const inputSx = (field: keyof typeof isEditable) => {
    const editing = isEditable[field];
    const hasError = !!errors[field];
    return {
      backgroundColor: editing
        ? "var(--byte-bg-default)"
        : "var(--byte-gray-200)",
      color: editing ? "var(--byte-color-black)" : "var(--byte-gray-800)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError
          ? "var(--byte-color-error)"
          : editing
          ? "var(--byte-color-green-500)"
          : "rgba(0,0,0,0.23)",
        borderWidth: hasError || editing ? 1 : undefined,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError
          ? "var(--byte-color-error)"
          : editing
          ? "var(--byte-color-green-500)"
          : undefined,
      },
    };
  };

  const iconSx = (field: keyof typeof isEditable) => {
    const editing = isEditable[field];
    const hasError = !!errors[field];
    if (!editing) {
      return { color: "var(--byte-gray-800)", backgroundColor: "transparent" };
    }
    if (hasError) {
      return {
        color: "var(--byte-color-error)",
        backgroundColor: "rgba(191,19,19,0.1)",
        ml: 2,
      };
    }
    return {
      color: "var(--byte-color-green-500)",
      backgroundColor: "rgba(71,161,56,0.1)",
      ml: 2,
    };
  };

  const visibilityIconSx = () => {
    const hasError = !!errors.password;
    if (hasError) {
      return {
        color: "var(--byte-color-error)",
        backgroundColor: "rgba(191,19,19,0.1)",
      };
    }
    if (showPassword) {
      return {
        color: "var(--byte-color-green-500)",
        backgroundColor: "rgba(71,161,56,0.1)",
      };
    }
    return { color: "var(--byte-gray-800)", backgroundColor: "transparent" };
  };
  // =========================


  return (
    <Box className={`${styles.cardContainer} w-full h-full`}>
      <section className="flex flex-col gap-6 w-full h-full">
        <h3 className={styles.myAccountTitle}>Minha conta</h3>
        <Box className="flex flex-col lg:flex-row-reverse w-full h-full">
          <Box className="flex flex-col gap-6 w-full h-full mx-3">
     {/* Nome */}
      <FormControl variant="outlined" fullWidth error={!!errors.name}>
        <label
          htmlFor="name"
          className="text-md font-bold text-gray-700"
        >
          Nome
        </label>
        <OutlinedInput
          id="name"
          disabled={!isEditable.name}
          sx={inputSx("name")}
          {...register("name", registerValidations.name)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => toggleEdit("name")}
                edge="end"
                sx={iconSx("name")}
              >
                <EditIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{errors.name?.message}</FormHelperText>
      </FormControl>

      {/* E-mail */}
      <FormControl variant="outlined" fullWidth error={!!errors.email}>
        <label
          htmlFor="email"
          className="text-md font-bold text-gray-700"
        >
          E-mail
        </label>
        <OutlinedInput
          id="email"
          disabled={!isEditable.email}
          sx={inputSx("email")}
          {...register("email", registerValidations.email)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => toggleEdit("email")}
                edge="end"
                sx={iconSx("email")}
              >
                <EditIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{errors.email?.message}</FormHelperText>
      </FormControl>

      {/* Senha */}
      <FormControl variant="outlined" fullWidth error={!!errors.password}>
        <label
          htmlFor="password"
          className="text-md font-bold text-gray-700"
        >
          Senha
        </label>
        <OutlinedInput
          id="password"
          type={showPassword ? "text" : "password"}
          disabled={!isEditable.password}
          sx={inputSx("password")}
          {...register("password", registerValidations.password)}
          endAdornment={
            <InputAdornment position="end" className="flex items-center">
              {isEditable.password && passwordValue && (
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  edge="end"
                  sx={visibilityIconSx()}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              <IconButton
                onClick={() => toggleEdit("password")}
                edge="end"
                sx={iconSx("password")}
              >
                <EditIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{errors.password?.message}</FormHelperText>
      </FormControl>

       {/* Botão Salvar */}
      <Box>
        <Button
          type="submit"
          variant="contained"
          className="w-full py-3 font-medium text-base"
          style={{
            background: "var(--byte-color-orange-500)",
            color: "var(--byte-bg-default)",
          }}
        >
          Salvar alterações
        </Button>
      </Box>
          </Box>

          {/* <Image
            src="/dash-card-my-account/ilustracao-card-accout.svg"
            alt="Ilustração de uma mulher com cabelo castanho claro, usando um vestido azul e segurando um celular"
            width={600}
            height={400}
            priority
            className="max-w-full h-auto max-h-[381px] text-center w-full m-7 lg:mt-0"
          /> */}
        </Box>
      </section>
    </Box>
  );
}