import '../styles/globals.css'

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventosApp | Invitaciones Digitales Elegantes",
  description: "Plataforma para crear y gestionar invitaciones digitales para tus eventos especiales",
  keywords: "invitaciones digitales, eventos, bodas, cumpleaños, celebraciones",
  openGraph: {
    title: "EventosApp | Invitaciones Digitales",
    description: "Crea invitaciones digitales elegantes para tus momentos especiales",
    type: "website",
    locale: "es_ES",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}