// Mess_Menu JS goes here
function switchDay(dayId) {
  document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.menu-day').forEach(day => day.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(dayId).classList.add('active');
}