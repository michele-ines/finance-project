import {
	Metadata,
	React,
	geistMono,
	geistSans,
} from "../components/ui/index";

import "../styles/globals.css";

// Importe o Header
import Footer from "../shared/footer/footer";
import Header from "../shared/header/header";
import StoreProvider from "store/StoreProvider";


export const metadata: Metadata = {
	title: "ByteBank",
	description: "Seja bem-vindo ao ByteBank",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<StoreProvider>
					<Header />
					<main>{children}</main>
					<Footer />
				</StoreProvider>
			</body>
		</html>
	);
}
