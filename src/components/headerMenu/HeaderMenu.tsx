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

import styles from "./HeaderMenu.module.scss";

export default function HeaderMenu() {
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

  return (
    <AppBar
    position="static"
    className={`${styles.headerMenu} shadow-none`}
    sx={{ color: "black" }}
  >
    <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
      {/* MOBILE: Exibe somente em xs */}
   
    </Toolbar>
  </AppBar>
  );
}
