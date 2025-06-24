// Upload_Notes JS goes here
document.getElementById('uploadNowBtn').addEventListener('click', () => {
  const studentName = document.getElementById('studentName').value.trim();
  const semester = document.getElementById('semester').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const file = document.getElementById('notesFile').files[0];
  const description = document.getElementById('description').value.trim();

  if (!studentName || !semester || !subject || !file || !description) {
    alert('Please fill out all fields and upload a PDF.');
    return;
  }

  alert('✅ Notes uploaded successfully!');
  // You can now implement actual backend upload logic (Firebase, Google Drive, etc.)
});

document.getElementById('backBtn').addEventListener('click', () => {
  // Navigate back to your hub page
  window.location.href = "index.html"; // or whatever the hub path is
});