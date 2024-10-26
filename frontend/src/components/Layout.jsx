// components/Layout.js
import { Bike } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <header className="absolute px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Bike className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Nombre</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6"></nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
