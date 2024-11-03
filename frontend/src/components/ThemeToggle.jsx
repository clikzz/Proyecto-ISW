import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-accent"
    >
      {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
