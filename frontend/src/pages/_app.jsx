// pages/_app.js
import { Montserrat } from 'next/font/google';
import Layout from '@components/Layout';
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

  return (
    <AuthProvider>
      <RoleProvider>
        <Layout key={router.asPath} className={montserrat.variable}>
          <Component {...pageProps} />
        </Layout>
      </RoleProvider>
    </AuthProvider>
  );
}
