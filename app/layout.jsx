import "./globals.css";

export const viewport = { themeColor: "#244739" };
export const metadata = {
  manifest: "/manifest.webmanifest",
  icons: { apple: "/bora-180.png", icon: "/bora-192.png" },
  appleWebApp: { capable: true, title: "Bora de Moto" },
  title: "Bora de Moto | Seu próximo horizonte" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
