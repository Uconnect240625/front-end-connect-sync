// Mess_Menu_Admin JS goes here
    function saveMenu() {
      const day = document.getElementById('day').value;
      const meal = document.getElementById('meal').value;
      const items = document.getElementById('items').value;

      alert(`✅ Menu Updated for ${day} – ${meal}:\n${items}`);

      // Here you'd actually send this data to a backend or database
    }