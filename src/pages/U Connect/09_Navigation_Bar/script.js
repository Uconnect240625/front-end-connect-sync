// Navigation_Bar JS goes here
function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('overlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    }