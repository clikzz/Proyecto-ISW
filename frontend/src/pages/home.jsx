import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
    };

    checkToken();
  }, [router]);

  return (
    <div>
      <h1>Bienvenido a la página protegida</h1>
      <p>Solo puedes ver esta página si tienes un token válido.</p>
    </div>
  );
};

export default Home;
