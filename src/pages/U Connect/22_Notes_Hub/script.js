// Notes_Hub JS goes here
document.addEventListener('DOMContentLoaded', () => {
  const subjectsList = document.getElementById('subjectsList');
  const newSubjectInput = document.getElementById('newSubjectInput');
  const searchInput = document.getElementById('searchInput');
  const uploadNotesBtn = document.getElementById('uploadNotesBtn');

  const defaultSubjects = ['DSA', 'Mathematics', 'Physics', 'DBMS', 'Operating Systems', 'English'];

  function addSubjectCard(name) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerText = name;

    card.addEventListener('dblclick', () => {
      if (confirm(`Delete "${name}"?`)) {
        card.remove();
        saveSubjects();
      }
    });

    subjectsList.appendChild(card);
  }

  function saveSubjects() {
    const names = Array.from(subjectsList.children).map(c => c.innerText);
    localStorage.setItem('subjects', JSON.stringify(names));
  }

  function loadSubjects() {
    const stored = JSON.parse(localStorage.getItem('subjects'));
    const names = stored && stored.length ? stored : defaultSubjects;
    subjectsList.innerHTML = '';
    names.forEach(addSubjectCard);
  }

  function addSubject() {
    const name = newSubjectInput.value.trim();
    if (!name) return;
    addSubjectCard(name);
    newSubjectInput.value = '';
    saveSubjects();
  }

  // Trigger add on Enter key
  newSubjectInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSubject();
  });

  // Search filter
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    subjectsList.querySelectorAll('.subject-card').forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
  });

  uploadNotesBtn.addEventListener('click', () => {
    addSubject(); // Handles input from field
    alert('Upload feature is coming soon! 🚀');
  });

  loadSubjects();
});