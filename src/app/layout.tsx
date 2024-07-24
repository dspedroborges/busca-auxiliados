import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BsGithub, BsSearch } from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Busca Auxiliados",
  description: "Realize buscas dentro de uma base de dados de 68 milhões de pessoas que receberam auxílio emergencial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <nav className="py-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 bg-blue-800">
          <h1 className="text-white font-bold text-2xl w-full text-center flex items-center gap-2 justify-center"><BsSearch/> Busca Auxiliados</h1>
        </nav>
        {children}
        <footer className="flex items-center justify-center bg-blue-800 py-16">
          <Link href="https://github.com/dspedroborges" target="_blank" className="hover:underline text-white flex items-center gap-2"><BsGithub/> dspedroborges</Link>
        </footer>
      </body>
    </html>
  );
}
