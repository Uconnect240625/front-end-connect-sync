// Event_Calendar JS goes here
function switchTab(tab) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.event-list').forEach(list => list.classList.remove('active'));

  document.getElementById(tab).classList.add('active');
  event.target.classList.add('active');
}