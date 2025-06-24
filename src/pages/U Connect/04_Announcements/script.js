// Announcements JS goes here
function showTab(tabId) {
      const tabs = document.querySelectorAll(".tab");
      const contents = document.querySelectorAll(".tab-content");

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      document.getElementById(tabId).classList.add("active");
      event.target.classList.add("active");
    }
