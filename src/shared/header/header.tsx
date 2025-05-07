"use client";
import React from "react";
import {
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
  HeaderStyles as styles,
} from "../../components/ui/index";
import { ROUTES } from "constants/routes.constant";
import { getBgColor, useHeaderFlags } from "utils/routeMatcher";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const bgColor = getBgColor(pathname);
  const { showPublicLinks, showInternalLinks, showDashboardBtn } = useHeaderFlags();

  const [mounted, setMounted] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(e.currentTarget);
  const closeMenu = () => setAnchorElNav(null);

  return (
    <AppBar
      position="static"
      className={`${styles.header} shadow-none`}
      sx={{ backgroundColor: bgColor }}
    >
      <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
        {/* MOBILE LOGO + MENU ICON */}
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
            onClick={openMenu}
            sx={{ color: "var(--byte-color-green-500)" }}
          >
            <MenuIcon />
          </IconButton>
          <Link href={ROUTES.ROOT}>
            <Image src="/header/header-logo.svg" alt="Logo" width={120} height={40} />
          </Link>
        </Box>

        {/* DESKTOP */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href={ROUTES.ROOT}>
              <Box sx={{ display: { sm: "block", md: "none" } }}>
                <Image src="/header/icon-group.svg" alt="Ícone" width={26} height={26} />
              </Box>
              <Box sx={{ display: { sm: "none", md: "block" } }}>
                <Image src="/header/header-logo.svg" alt="Logo" width={120} height={40} />
              </Box>
            </Link>

            {showDashboardBtn && (
              <Button
                color="inherit"
                className={styles.menuItemText}
                onClick={() => router.push(ROUTES.DASHBOARD)}
                sx={{ textTransform: "none" }}
              >
                Dashboard
              </Button>
            )}

            {showPublicLinks && (
              <>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.SERVICES)}
                >
                  Sobre
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.SERVICES)}
                >
                  Serviços
                </Button>
              </>
            )}

            {showInternalLinks && (
              <>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                >
                  Início
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.MY_CARDS)}
                >
                  Meus cartões
                </Button>
                <Button color="inherit" className={styles.menuItemText}>
                  Transferências
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.INVESTMENTS)}
                >
                  Investimentos
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.ACCOUNT)}
                >
                  Minha Conta
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.OTHER_SERVICES)}
                >
                  Outros serviços
                </Button>
              </>
            )}
          </Box>

          {showPublicLinks && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                className={styles.openAccountButton}
                onClick={() => router.push(ROUTES.REGISTER)}
              >
                Abrir Conta
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                className={styles.loginButton}
                onClick={() => router.push(ROUTES.LOGIN)}
              >
                Já tenho conta
              </Button>
            </Box>
          )}
        </Box>

        {/* MENU MOBILE */}
        <Menu
          anchorEl={anchorElNav}
          open={Boolean(anchorElNav)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          {showDashboardBtn && (
            <MenuItem onClick={closeMenu} key="dashboard">
              <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
                <Typography textAlign="center">Dashboard</Typography>
              </Link>
            </MenuItem>
          )}

          {/* Links Públicos */}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="sobre-mobile">
              <Typography textAlign="center">Sobre</Typography>
            </MenuItem>
          )}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="servicos-mobile">
              <Typography textAlign="center">Serviços</Typography>
            </MenuItem>
          )}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="botoes-mobile">
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", width: "100%" }}>
                <Button
                  variant="contained"
                  color="success"
                  className={styles.openAccountButton}
                  onClick={() => {
                    closeMenu();
                    router.push(ROUTES.REGISTER);
                  }}
                >
                  Abrir Conta
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  className={styles.loginButton}
                  onClick={() => {
                    closeMenu();
                    router.push(ROUTES.LOGIN);
                  }}
                >
                  Já tenho conta
                </Button>
              </Box>
            </MenuItem>
          )}

          {/* Links Internos */}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="inicio-mobile">
              <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
                <Typography textAlign="center">Início</Typography>
              </Link>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="meus-cartoes-mobile">
              <Link href={ROUTES.MY_CARDS} passHref legacyBehavior>
                <Typography textAlign="center">Meus Cartões</Typography>
              </Link>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="transferencias-mobile">
              <Typography textAlign="center">Transferências</Typography>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="investimentos-mobile">
              <Link href={ROUTES.INVESTMENTS} passHref legacyBehavior>
                <Typography textAlign="center">Investimentos</Typography>
              </Link>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="minha-conta-mobile">
              <Link href={ROUTES.ACCOUNT} passHref legacyBehavior>
                <Typography textAlign="center">Minha Conta</Typography>
              </Link>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="outros-mobile">
              <Link href={ROUTES.OTHER_SERVICES} passHref legacyBehavior>
                <Typography textAlign="center">Outros serviços</Typography>
              </Link>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
