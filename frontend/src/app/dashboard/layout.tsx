// app/layout.tsx
//import '../globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'My Web App',
  description: 'Description of my web app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dashboardbg bg-cover bg-center flex justify-center items-center min-h-screen ">
        {children}
      </body>
    </html>
  );
}
