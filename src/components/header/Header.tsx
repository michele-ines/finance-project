"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";

import styles from "./Header.module.scss";

export default function Header() {
  // Estado para controlar a abertura/fechamento do menu mobile
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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
          {/* Logo à direita */}
          <Box>
            <Link href="/">
              <Image
                src="/bite-bank-logo.svg"
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
              <Image
                src="/bite-bank-logo.svg"
                alt="Bite Bank Logo"
                width={120}
                height={40}
              />
            </Link>
            <Button color="inherit" className={styles.menuItemText}>
              Sobre
            </Button>
            <Button color="inherit" className={styles.menuItemText}>
              Serviços
            </Button>
          </Box>

          {/* Botões de ação à direita */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              className={styles.openAccountButton}
            >
              Abrir Conta
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              className={styles.loginButton}
            >
              Já tenho conta
            </Button>
          </Box>
        </Box>

        {/* MENU MOBILE (xs): Ítens do menu exibidos quando o usuário clica no ícone */}
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
            <Typography textAlign="center">Sobre</Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseNavMenu}>
            <Typography textAlign="center">Serviços</Typography>
          </MenuItem>
          {/* Se desejar também adicionar os botões de ação no mobile, descomente: */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
