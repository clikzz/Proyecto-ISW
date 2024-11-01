// pages/_app.js
import '@styles/globals.css';
import { Montserrat } from 'next/font/google';
import PublicLayout from '@layouts/PublicLayout';
import PrivateLayout from '@layouts/PrivateLayout';
import { AuthProvider } from '../context/authContext';
import { useRouter } from 'next/router';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

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
    <AuthProvider>
      <LayoutComponent key={router.asPath} className={montserrat.variable}>
        <Component {...pageProps} />
      </LayoutComponent>
    </AuthProvider>
  );
}
