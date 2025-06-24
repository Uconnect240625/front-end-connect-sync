// Notifications JS goes here
    const filters = document.querySelectorAll('.filter');
    const notices = document.querySelectorAll('.notice');

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const type = filter.textContent;

        notices.forEach(notice => {
          if (type === 'All' || notice.dataset.type === type) {
            notice.style.display = 'block';
          } else {
            notice.style.display = 'none';
          }
        });
      });
    });