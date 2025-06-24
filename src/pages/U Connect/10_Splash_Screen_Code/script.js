const dotsElement = document.getElementById("dots");
let dotCount = 0;

setInterval(() => {
  dotCount = (dotCount + 1) % 4; // cycles through 0, 1, 2, 3
  dotsElement.textContent = '.'.repeat(dotCount);
}, 500);


