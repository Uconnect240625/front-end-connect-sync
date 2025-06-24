// Help_Centre JS goes here
document.getElementById('submitIssueBtn').addEventListener('click', () => {
  const studentName = document.getElementById('studentName').value.trim();
  const category = document.getElementById('issueCategory').value.trim();
  const title = document.getElementById('issueTitle').value.trim();
  const description = document.getElementById('description').value.trim();
  const screenshot = document.getElementById('screenshot').files[0];

  if (!studentName || !category || !title || !description) {
    alert('Please fill in all required fields.');
    return;
  }

  alert('✅ Issue submitted successfully!');
  console.log({
    studentName,
    category,
    title,
    description,
    screenshot
  });

  // Add upload logic or form reset here if needed
});