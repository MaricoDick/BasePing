import "./globals.css";
import { Providers } from "@/lib/providers";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="base:app_id" content="69c9f0ae0e56240fea198ee9" />
        <meta
          name="talentapp:project_verification"
          content="92e1ff2f6c1fb2a1b20156dab8545693331746e3b369028ecfc32176ee8b7da7f002677cfda4eddd8c391d54202e800eed33812ff84bda7390519466e62c8010"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
