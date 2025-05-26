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
  PermIdentityIcon,
} from "../../components/ui/index";
import { ROUTES } from "../../config-routes/routes";
import { getBgColor, useHeaderFlags } from "../../utils/route-matcher/route-matcher";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const bgColor = getBgColor(pathname);
  const { showPublicLinks, showInternalLinks, showDashboardBtn } =
    useHeaderFlags();

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(route + "/");

  const [mounted, setMounted] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(e.currentTarget);
  const closeMenu = () => setAnchorElNav(null);

  const underlineStyle = {
    borderBottom: `2px solid var(--byte-color-green-500)`,
    borderRadius: 0,
    paddingBottom: "4px",
  };

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
            <Image
              src="/header/header-logo.svg"
              alt="Logo"
              width={120}
              height={40}
            />
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
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <Link href={ROUTES.ROOT}>
              <Box sx={{ display: { sm: "block", md: "none" } }}>
                <Image
                  src="/header/icon-group.svg"
                  alt="Ícone"
                  width={26}
                  height={26}
                />
              </Box>
              <Box sx={{ display: { sm: "none", md: "block" } }}>
                <Image
                  src="/header/header-logo.svg"
                  alt="Logo"
                  width={120}
                  height={40}
                />
              </Box>
            </Link>

            {showDashboardBtn && (
              <Button
                color="inherit"
                className={styles.menuItemText}
                onClick={() => router.push(ROUTES.DASHBOARD)}
                sx={{
                  ...(isActive(ROUTES.NOT_FOUND) ? underlineStyle : {}),
                }}
              >
                Dashboard
              </Button>
            )}

            {showPublicLinks && (
              <>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.NOT_FOUND)}
                  sx={{
                    ...(isActive(ROUTES.NOT_FOUND) ? underlineStyle : {}),
                  }}
                >
                  Sobre
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.NOT_FOUND)}
                  sx={{
                    ...(isActive(ROUTES.NOT_FOUND) ? underlineStyle : {}),
                  }}
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
                  sx={{
                    ...(isActive(ROUTES.DASHBOARD) ? underlineStyle : {}),
                  }}
                >
                  Início
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.PERSONAL_CARDS)}
                  sx={{
                    ...(isActive(ROUTES.PERSONAL_CARDS) ? underlineStyle : {}),
                  }}
                >
                  Meus cartões
                </Button>

                {/** NÃO REMOVER, VAI SER ULTILIZADO NO FUTURO */}
                {/* <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.NOT_FOUND)}
                >
                  Transferências
                </Button> */}
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.INVESTMENTS)}
                  sx={{
                    ...(isActive(ROUTES.INVESTMENTS) ? underlineStyle : {}),
                  }}
                >
                  Investimentos
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.OTHER_SERVICES)}
                  sx={{
                    ...(isActive(ROUTES.OTHER_SERVICES) ? underlineStyle : {}),
                  }}
                >
                  Outros serviços
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { md: 4, xs: 2 },
                    marginLeft: "auto",
                  }}
                >
                  <Typography
                    className={styles.userName}
                    onClick={() => router.push(ROUTES.MY_ACCOUNT)}
                  >
                    Joana da Silva Oliveira
                  </Typography>
                  <IconButton
                    size="large"
                    onClick={() => router.push(ROUTES.MY_ACCOUNT)}
                    className={styles.userButton}
                    title="Minha conta"
                    aria-label="Ícone de usuário"
                  >
                    <PermIdentityIcon
                      fontSize="small"
                      onClick={() => router.push("/dashboard")}
                      className={styles.userIcon}
                    />
                  </IconButton>
                </Box>
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
                sx={{
                  ...(isActive(ROUTES.REGISTER) ? underlineStyle : {}),
                }}
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
                <Typography
                  textAlign="center"
                  sx={isActive(ROUTES.DASHBOARD) ? underlineStyle : {}}
                >
                  Dashboard
                </Typography>
              </Link>
            </MenuItem>
          )}

          {/* Links Públicos */}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="sobre-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.ABOUT) ? underlineStyle : {}}
              >
                Sobre
              </Typography>
            </MenuItem>
          )}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="servicos-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.SERVICES) ? underlineStyle : {}}
              >
                Serviços
              </Typography>
            </MenuItem>
          )}
          {showPublicLinks && (
            <MenuItem onClick={closeMenu} key="botoes-mobile">
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  className={styles.openAccountButton}
                  onClick={() => {
                    closeMenu();
                    router.push(ROUTES.REGISTER);
                  }}
                  sx={isActive(ROUTES.REGISTER) ? underlineStyle : {}}
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
                  sx={isActive(ROUTES.LOGIN) ? underlineStyle : {}}
                >
                  Já tenho conta
                </Button>
              </Box>
            </MenuItem>
          )}

          {/* Links Internos */}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="inicio-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.DASHBOARD) ? underlineStyle : {}}
                onClick={() => router.push(ROUTES.DASHBOARD)}
              >
                Início
              </Typography>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="meus-cartoes-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.PERSONAL_CARDS) ? underlineStyle : {}}
                onClick={() => router.push(ROUTES.PERSONAL_CARDS)}
              >
                Meus Cartões
              </Typography>
            </MenuItem>
          )}
          {/** NÃO REMOVER, VAI SER ULTILIZADO NO FUTURO */}
          {/* {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="transferencias-mobile">
              <Typography textAlign="center">Transferências</Typography>
            </MenuItem>
          )} */}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="investimentos-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.INVESTMENTS) ? underlineStyle : {}}
                onClick={() => router.push(ROUTES.INVESTMENTS)}
              >
                Investimentos
              </Typography>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="outros-mobile">
              <Typography
                textAlign="center"
                sx={isActive(ROUTES.OTHER_SERVICES) ? underlineStyle : {}}
                onClick={() => router.push(ROUTES.OTHER_SERVICES)}
              >
                Outros serviços
              </Typography>
            </MenuItem>
          )}
          {showInternalLinks && (
            <MenuItem onClick={closeMenu} key="minha-conta-mobile">
              <Typography
                className={styles.userName}
                textAlign="center"
                sx={isActive(ROUTES.MY_ACCOUNT) ? underlineStyle : {}}
                onClick={() => router.push(ROUTES.MY_ACCOUNT)}
              >
                Joana da Silva Oliveira
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
