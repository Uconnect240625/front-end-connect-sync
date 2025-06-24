// Settings JS goes here
  const toggle = document.getElementById('darkToggle');
    const isDark = localStorage.getItem('cuconnectDarkMode') === 'true';

    if (isDark) {
      document.body.classList.add('dark');
      toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('cuconnectDarkMode', 'true');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('cuconnectDarkMode', 'false');
      }
    });