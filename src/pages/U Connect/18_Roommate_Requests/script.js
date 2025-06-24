// Roommate_Requests JS goes here
    const buttons = document.querySelectorAll('.verify-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        button.innerText = '✅ Verified';
        button.classList.remove('btn');
        button.classList.add('verified');
        button.disabled = true;
      });
    });