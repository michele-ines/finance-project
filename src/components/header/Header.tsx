"use client";
import {
  React,
  useRouter,
  usePathname,
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
import styles from "./header.module.scss";

export default function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const pathname = usePathname();
  const router = useRouter();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const isDashboard = pathname.startsWith("/dashboard");
  const isHome = pathname === "/" || pathname.startsWith("/home");
  const showPublicLinks = isHome; // ← flag única

  const bgColor = isDashboard
    ? "var(--byte-color-dash)"
    : isHome
    ? "var(--byte-color-black)"
    : undefined;

  return (
    <AppBar
      position="static"
      className={`${styles.header} shadow-none`}
      sx={{ backgroundColor: bgColor }}
    >
      <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
        {/* MOBILE (xs) ------------------------------------------------------ */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            sx={{ color: "var(--byte-color-green-500)" }}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/">
            <Image
              src="/header/header-logo.svg"
              alt="Bite Bank Logo"
              width={120}
              height={40}
            />
          </Link>
        </Box>

        {/* DESKTOP/TABLET (sm+) ------------------------------------------- */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Esquerda ------------------------------------------------------- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/">
              {/* tablet: ícone; desktop: logo */}
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

            {/* Sobre e Serviços só na home */}
            {showPublicLinks && (
              <>
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
              </>
            )}
          </Box>

          {/* Direita ------------------------------------------------------- */}
          {showPublicLinks && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                className={styles.openAccountButton}
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                Abrir Conta
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                className={styles.loginButton}
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                Já tenho conta
              </Button>
            </Box>
          )}
        </Box>

        {/* MENU MOBILE ----------------------------------------------------- */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          <MenuItem onClick={handleCloseNavMenu}>
            <Link href="/dashboard" passHref legacyBehavior>
              <Typography textAlign="center">Dashboard</Typography>
            </Link>
          </MenuItem>

          {/* 🔑 use array, não Fragment */}
          {showPublicLinks && [
            <MenuItem onClick={handleCloseNavMenu} key="sobre">
              <Typography textAlign="center">Sobre</Typography>
            </MenuItem>,

            <MenuItem onClick={handleCloseNavMenu} key="servicos">
              <Typography textAlign="center">Serviços</Typography>
            </MenuItem>,

            <MenuItem onClick={handleCloseNavMenu} key="botoes">
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  className={styles.openAccountButton}
                  sx={{ textTransform: "none", borderRadius: "8px" }}
                >
                  Abrir Conta
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  className={styles.loginButton}
                  sx={{ textTransform: "none", borderRadius: "8px" }}
                >
                  Já tenho conta
                </Button>
              </Box>
            </MenuItem>,
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
