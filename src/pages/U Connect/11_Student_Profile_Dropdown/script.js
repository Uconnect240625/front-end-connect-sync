// Student_Profile_Dropdown JS goes here
function toggleDropdown() {
      const dropdown = document.getElementById("dropdownMenu");
      dropdown.classList.toggle("show");
    }

    window.onclick = function(e) {
      if (!e.target.matches('.profile-icon')) {
        const dropdown = document.getElementById("dropdownMenu");
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    }