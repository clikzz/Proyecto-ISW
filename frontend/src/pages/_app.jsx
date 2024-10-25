// pages/_app.js
import { Montserrat } from 'next/font/google';
import Layout from '@components/Layout';
import '@styles/globals.css'; // Asegúrate de que la ruta es correcta

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Puedes ajustar los pesos según tus necesidades
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={montserrat.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}