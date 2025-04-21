"use client";
import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  MenuIcon,
  Image,
  Link,
} from "../ui/index";

import { useRouter } from "next/navigation";

import styles from "./Header.module.scss";

export default function Header() {
  // Estado para controlar a abertura/fechamento do menu mobile
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const router = useRouter(); 

  return (
    <AppBar
    position="static"
    className={`${styles.header} shadow-none`}
    sx={{ color: "black" }}
  >
    <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
      {/* MOBILE: Exibe somente em xs */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Ícone de menu à esquerda */}
        <Box>
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{
              color: {
                xs: "var(--byte-color-green-500)", // para mobile
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        {/* Logo à direita (no mobile continua o header-logo) */}
        <Box>
          <Link href="/">
            <Image
              src="/header/header-logo.svg"
              alt="Bite Bank Logo"
              width={120}
              height={40}
            />
          </Link>
        </Box>
      </Box>

      {/* DESKTOP/TABLET: Exibe somente em sm ou maior */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Logo e itens de menu à esquerda */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/">
            {/* Exibe:
                  - Em telas tablet (sm a md): o ícone grupo (icon-group.svg);
                  - Em telas desktop (md ou maior): o logo tradicional (header-logo.svg).
            */}
            <Box sx={{ display: { sm: "block", md: "none" } }}>
              <Image
                src="/header/icon-group.svg"
                alt="Grupo de Ícones"
                width={26}
                height={26}
              />
            </Box>
            <Box sx={{ display: { sm: "none", md: "block" } }}>
              <Image
                src="/header/header-logo.svg"
                alt="Bite Bank Logo"
                width={120}
                height={40}
              />
            </Box>
          </Link>
          <Button
            color="inherit"
            className={styles.menuItemText}
            onClick={() => router.push("/dashboard")}
            sx={{ textTransform: "none" }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            className={styles.menuItemText}
            sx={{ textTransform: "none" }}
          >
            Sobre
          </Button>
          <Button
            color="inherit"
            className={styles.menuItemText}
            sx={{ textTransform: "none" }}
          >
            Serviços
          </Button>
        </Box>

        {/* Botões de ação à direita */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            className={styles.openAccountButton}
            sx={{
              textTransform: "none",
              borderRadius: "8px", // Aplica border-radius
            }}
          >
            Abrir Conta
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            className={styles.loginButton}
            sx={{
              textTransform: "none",
              borderRadius: "8px", // Aplica border-radius
            }}
          >
            Já tenho conta
          </Button>
        </Box>
      </Box>

      {/* MENU MOBILE (xs): Itens do menu exibidos quando o usuário clica no ícone */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", sm: "none" },
        }}
      >
        <MenuItem onClick={handleCloseNavMenu}>
            <Link href="/dashboard" passHref legacyBehavior>
              <Typography textAlign="center">Dashboard</Typography>
            </Link>
          </MenuItem>
        <MenuItem onClick={handleCloseNavMenu}>
          <Typography textAlign="center">Sobre</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseNavMenu}>
          <Typography textAlign="center">Serviços</Typography>
        </MenuItem>
        {/* Botões de ação também para o Mobile */}
        <MenuItem onClick={handleCloseNavMenu}>
          <Box sx={{ display: "flex", gap: 2, width: "100%", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="success"
              className={styles.openAccountButton}
              sx={{
                textTransform: "none",
                borderRadius: "8px", // Aplica border-radius
              }}
            >
              Abrir Conta
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              className={styles.loginButton}
              sx={{
                textTransform: "none",
                borderRadius: "8px", // Aplica border-radius
              }}
            >
              Já tenho conta
            </Button>
          </Box>
        </MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
  );
}
