const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
resultsDisplay.innerText = "0";
let currentShipPosition = 217; // Updated variable name
let width = 15;
let height = 15;
let direction = 1;
let alienID;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
}

draw();

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

squares[currentShipPosition].classList.add('shooter');

function moveShooter(e) {
  squares[currentShipPosition].classList.remove('shooter');
  console.log(e.key);

  switch (e.key) {
    case 'ArrowLeft':
      if (currentShipPosition % width !== 0) currentShipPosition -= 1;
      break;
    case 'ArrowRight':
      if (currentShipPosition % width < width - 1) currentShipPosition += 1;
      break;
  }

  squares[currentShipPosition].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  if (squares[currentShipPosition].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER!';
    clearInterval(alienID);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] >= 210) {
      resultsDisplay.innerHTML = 'GAME OVER!';
      clearInterval(alienID);
    }
  }

  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN! ';
    clearInterval(alienID);
  }
}

alienID = setInterval(moveInvaders, 100);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShipPosition;

  function moveLaser() {
    if (currentLaserIndex > 14) {
      squares[currentLaserIndex].classList.remove('laser');
      currentLaserIndex -= width;
      console.log(currentLaserIndex);
      squares[currentLaserIndex].classList.add('laser');
    } else if (currentLaserIndex <= 14) {
      squares[currentLaserIndex].classList.remove('laser');
    }
    
    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultsDisplay.innerHTML = results;
    }
  }

  switch (e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 300);
  }
}

document.addEventListener('keydown', shoot);
