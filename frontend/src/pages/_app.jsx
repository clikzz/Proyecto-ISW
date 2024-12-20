import { Montserrat } from 'next/font/google';
import PublicLayout from '@layouts/PublicLayout';
import PrivateLayout from '@layouts/PrivateLayout';
import { AuthProvider } from '../context/authContext';
import { useRouter } from 'next/router';
import { AlertProvider } from '@context/alertContext';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import '@styles/globals.css';
import 'cropperjs/dist/cropper.css';
import Head from 'next/head';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'bikefy',
  description: 'Gracias por usar bikefy!',
};

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
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
