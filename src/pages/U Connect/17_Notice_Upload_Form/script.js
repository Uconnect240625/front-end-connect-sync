// Notice_Upload_Form JS goes here
    const form = document.getElementById('noticeForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Notice submitted successfully! (Backend coming soon)');
      form.reset();
    });