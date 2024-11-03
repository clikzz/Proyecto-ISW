'use client';

import { Montserrat } from 'next/font/google';
import PublicLayout from '@layouts/PublicLayout';
import PrivateLayout from '@layouts/PrivateLayout';
import { AuthProvider } from '../context/authContext';
import { useRouter } from 'next/router';
import { AlertProvider } from '@context/alertContext';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import '@styles/globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Evita renderizar hasta que el componente esté montado en el cliente
    return null;
  }

  // Determine which layout to use based on the current route
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];
  const LayoutComponent = publicRoutes.includes(router.pathname)
    ? PublicLayout
    : PrivateLayout;

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AlertProvider>
        <AuthProvider>
          <LayoutComponent
            key={router.asPath}
            className={`${montserrat.variable}`}
          >
            <Component {...pageProps} />
          </LayoutComponent>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
