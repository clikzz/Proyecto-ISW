// pages/_app.js
import { Montserrat } from 'next/font/google';
import Layout from '@components/Layout';
import '@styles/globals.css'; // Asegúrate de que la ruta es correcta
import { AuthProvider } from '../context/authContext';
import { useRouter } from 'next/router'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Puedes ajustar los pesos según tus necesidades
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <Layout key={router.asPath}>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}