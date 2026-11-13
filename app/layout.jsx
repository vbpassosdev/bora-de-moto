import "./globals.css";

export const metadata = { title: "Bora de Moto | Seu próximo horizonte" };

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
