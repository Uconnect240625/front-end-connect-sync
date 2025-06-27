
import { useEffect } from 'react';

const DarkModeInit = () => {
  useEffect(() => {
    const isDark = localStorage.getItem('uconnectDarkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
};

export default DarkModeInit;
