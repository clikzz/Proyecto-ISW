// pages/_app.js
import { Montserrat } from 'next/font/google';
import Layout from '@components/Layout';
import Layout2 from '@components/Layout2';
import '@styles/globals.css';
import { AuthProvider } from '../context/authContext';
import { RoleProvider } from '../context/roleContext';
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
  const LayoutComponent = router.pathname === '/home' ? Layout2 : Layout;

  return (
    <AuthProvider>
      <RoleProvider>
        <LayoutComponent key={router.asPath} className={montserrat.variable}>
          <Component {...pageProps} />
        </LayoutComponent>
      </RoleProvider>
    </AuthProvider>
  );
}
