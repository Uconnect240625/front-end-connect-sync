// Help_Center_Dashboard JS goes here
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const statusDiv = button.previousElementSibling;
        statusDiv.textContent = 'Status: Resolved';
        statusDiv.classList.remove('pending');
        statusDiv.classList.add('resolved');
        button.remove(); // remove button after marking resolved
      });
    });