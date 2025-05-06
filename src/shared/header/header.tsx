// "use client";
// import { ROUTES } from "constants/routes.constant";
// import {
//   React,
//   useRouter,
//   usePathname,
//   AppBar,
//   Box,
//   Toolbar,
//   IconButton,
//   Typography,
//   Menu,
//   MenuItem,
//   Button,
//   MenuIcon,
//   Image,
//   Link,
//   HeaderStyles as styles,
// } from "../../components/ui/index";
// import { getBgColor, useHeaderFlags } from "utils/routeMatcher";

// export default function Header() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const bgColor = getBgColor(pathname);
//   const { showPublicLinks, showInternalLinks, showDashboardBtn } =
//     useHeaderFlags();

//   const [isMounted, setIsMounted] = React.useState(false);
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
//     null
//   );

//   React.useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
//     setAnchorElNav(event.currentTarget);
//   const handleCloseNavMenu = () => setAnchorElNav(null);

//   return (
//     <AppBar
//       position="static"
//       className={`${styles.header} shadow-none`}
//       sx={{ backgroundColor: bgColor }}
//     >
//       <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
//         {/* ===================  MOBILE (xs)  ============================== */}
//         <Box
//           sx={{
//             display: { xs: "flex", sm: "none" },
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           <IconButton
//             size="large"
//             aria-label="menu"
//             onClick={handleOpenNavMenu}
//             sx={{ color: "var(--byte-color-green-500)" }}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* <Link href="/"> */}
//           <Link href={ROUTES.ROOT}>
//             <Image
//               src="/header/header-logo.svg"
//               alt="Bite Bank Logo"
//               width={120}
//               height={40}
//             />
//           </Link>
//         </Box>

//         {/* ===================  DESKTOP / TABLET (sm+)  =================== */}
//         <Box
//           sx={{
//             display: { xs: "none", sm: "flex" },
//             alignItems: "center",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           {/* --------  ESQUERDA  ------------------------------------------ */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             {/* <Link href="/"> */}
//             <Link href={ROUTES.ROOT}>
//               <Box sx={{ display: { sm: "block", md: "none" } }}>
//                 <Image
//                   src="/header/icon-group.svg"
//                   alt="Grupo de Ícones"
//                   width={26}
//                   height={26}
//                 />
//               </Box>
//               <Box sx={{ display: { sm: "none", md: "block" } }}>
//                 <Image
//                   src="/header/header-logo.svg"
//                   alt="Bite Bank Logo"
//                   width={120}
//                   height={40}
//                 />
//               </Box>
//             </Link>

//             {showDashboardBtn && (
//               <Button
//                 color="inherit"
//                 className={styles.menuItemText}
//                 onClick={() => router.push(ROUTES.DASHBOARD)}
//                 sx={{ textTransform: "none" }}
//               >
//                 Dashboard
//               </Button>
//             )}

//             {showPublicLinks && (
//               <>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Sobre
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   onClick={() => router.push(ROUTES.SERVICES)}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Serviços
//                 </Button>
//               </>
//             )}

//             {showInternalLinks && (
//               <>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   onClick={() => router.push(ROUTES.DASHBOARD)}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Início
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   onClick={() => router.push(ROUTES.MY_CARDS)}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Meus cartões
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Transferências
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   onClick={() => router.push(ROUTES.INVESTMENTS)}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Investimentos
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   onClick={() => router.push(ROUTES.ACCOUNT)}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Minha Conta
//                 </Button>
//                 <Button
//                   color="inherit"
//                   className={styles.menuItemText}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Outros serviços
//                 </Button>
//               </>
//             )}
//           </Box>

//           {/* --------  DIREITA (botões públicos)  ------------------------- */}
//           {showPublicLinks && (
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 variant="contained"
//                 color="success"
//                 className={styles.openAccountButton}
//                 onClick={() => router.push(ROUTES.REGISTER)}
//                 sx={{ textTransform: "none", borderRadius: "8px" }}
//               >
//                 Abrir Conta
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 className={styles.loginButton}
//                 onClick={() => router.push(ROUTES.LOGIN)}
//                 sx={{ textTransform: "none", borderRadius: "8px" }}
//               >
//                 Já tenho conta
//               </Button>
//             </Box>
//           )}
//         </Box>

//         {/* ===================  MENU MOBILE  ============================== */}
//         <Menu
//           id="menu-appbar"
//           anchorEl={anchorElNav}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           open={Boolean(anchorElNav)}
//           onClose={handleCloseNavMenu}
//           sx={{ display: { xs: "block", sm: "none" } }}
//         >
//           {showDashboardBtn && (
//             <MenuItem onClick={handleCloseNavMenu}>
//               {/* <Link href="/dashboard" passHref legacyBehavior> */}
//               <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
//                 <Typography textAlign="center">Dashboard</Typography>
//               </Link>
//             </MenuItem>
//           )}

//           {showPublicLinks && [
//             <MenuItem onClick={handleCloseNavMenu} key="sobre">
//               <Typography textAlign="center">Sobre</Typography>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="servicos">
//               <Link href={ROUTES.SERVICES} passHref legacyBehavior>
//                 <Typography textAlign="center">Serviços</Typography>
//               </Link>{" "}
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="botoes">
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 2,
//                   width: "100%",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="success"
//                   className={styles.openAccountButton}
//                   onClick={() => router.push(ROUTES.REGISTER)}
//                   sx={{ textTransform: "none", borderRadius: "8px" }}
//                 >
//                   Abrir Conta
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="inherit"
//                   className={styles.loginButton}
//                   onClick={() => router.push(ROUTES.LOGIN)}
//                   sx={{ textTransform: "none", borderRadius: "8px" }}
//                 >
//                   Já tenho conta
//                 </Button>
//               </Box>
//             </MenuItem>,
//           ]}

//           {showInternalLinks && [
//             <MenuItem onClick={handleCloseNavMenu} key="inicio">
//               <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
//                 <Typography textAlign="center">Início</Typography>
//               </Link>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="meuscartoes">
//               <Link href={ROUTES.MY_CARDS} passHref legacyBehavior>
//                 <Typography textAlign="center">Meus Cartões</Typography>
//               </Link>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="transferencias">
//               <Typography textAlign="center">Transferências</Typography>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="investimentos">
//               <Link href={ROUTES.INVESTMENTS} passHref legacyBehavior>
//                 <Typography textAlign="center">Investimentos</Typography>
//               </Link>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="minha-conta">
//               <Link href={ROUTES.ACCOUNT} passHref legacyBehavior>
//                 <Typography textAlign="center">Minha Conta</Typography>
//               </Link>
//             </MenuItem>,
//             <MenuItem onClick={handleCloseNavMenu} key="outros">
//               <Typography textAlign="center">Outros serviços</Typography>
//             </MenuItem>,
//           ]}
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// }
"use client";
import { ROUTES } from "constants/routes.constant";
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
  HeaderStyles as styles,
} from "../../components/ui/index";
import { getBgColor, useHeaderFlags } from "utils/routeMatcher";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const bgColor = getBgColor(pathname);
  const { showPublicLinks, showInternalLinks, showDashboardBtn } =
    useHeaderFlags();

  const [isMounted, setIsMounted] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <AppBar
      position="static"
      className={`${styles.header} shadow-none`}
      sx={{ backgroundColor: bgColor }}
    >
      <Toolbar className="max-w-[1280px] w-full mx-auto px-4 tablet:px-6 desktop:px-8">
        {/* ========== MOBILE (xs) ========== */}
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

          <Link href={ROUTES.ROOT}>
            <Image
              src="/header/header-logo.svg"
              alt="Bite Bank Logo"
              width={120}
              height={40}
            />
          </Link>
        </Box>

        {/* ========== DESKTOP / TABLET (sm+) ========== */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* ----- ESQUERDA ----- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href={ROUTES.ROOT}>
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
                <Button color="inherit" className={styles.menuItemText}>
                  Sobre
                </Button>
                <Button
                  color="inherit"
                  className={styles.menuItemText}
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
                <Button color="inherit" className={styles.menuItemText}
                  onClick={() => router.push(ROUTES.OTHER_SERVICES)}>
                  Outros serviços
                </Button>
              </>
            )}
          </Box>

          {/* ----- DIREITA (botões públicos) ----- */}
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

        {/* ========== MENU MOBILE ========== */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          {showDashboardBtn && (
            <MenuItem onClick={handleCloseNavMenu}>
              <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
                <Typography textAlign="center">Dashboard</Typography>
              </Link>
            </MenuItem>
          )}

          {showPublicLinks && [
            <MenuItem onClick={handleCloseNavMenu} key="sobre">
              <Typography textAlign="center">Sobre</Typography>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="servicos">
              {/* <Link href={ROUTES.SERVICES} passHref legacyBehavior> */}
                <Typography textAlign="center">Serviços</Typography>
              {/* </Link> */}
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
            </MenuItem>,
          ]}

          {showInternalLinks && [
            <MenuItem onClick={handleCloseNavMenu} key="inicio">
              <Link href={ROUTES.DASHBOARD} passHref legacyBehavior>
                <Typography textAlign="center">Início</Typography>
              </Link>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="meuscartoes">
              <Link href={ROUTES.MY_CARDS} passHref legacyBehavior>
                <Typography textAlign="center">Meus Cartões</Typography>
              </Link>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="transferencias">
              <Typography textAlign="center">Transferências</Typography>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="investimentos">
              <Link href={ROUTES.INVESTMENTS} passHref legacyBehavior>
                <Typography textAlign="center">Investimentos</Typography>
              </Link>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="minha-conta">
              <Link href={ROUTES.ACCOUNT} passHref legacyBehavior>
                <Typography textAlign="center">Minha Conta</Typography>
              </Link>
            </MenuItem>,
            <MenuItem onClick={handleCloseNavMenu} key="outros">
              <Link href={ROUTES.OTHER_SERVICES} passHref legacyBehavior> 
                <Typography textAlign="center">Outros serviços</Typography>
              </Link> 
            </MenuItem>,
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
