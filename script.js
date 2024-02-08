
    const grid = document.querySelector('.grid')
    const resultsDisplay = document.querySelector('.results')
    resultsDisplay.innerText = "0";
    let currentShooterIndex = 217 // Why is this set to 202 specifically?
    let width = 15
    let height = 15 // Only for readability.
    let direction = 1
    let invadersId
    let goingRight = true
    let aliensRemoved = []
    let results = 0


    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    } 

    const squares = Array.from(document.querySelectorAll('.grid div'));
    
    // Create 40 space invaders. Should do this as a loop rather than hand code.
    // const alienInvaders = []
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ]

    function draw() {
        for (let i = 0; i < alienInvaders.length; i++) {
            if(!aliensRemoved.includes(i)){
                // Add the class invader to every invader div. 
                // Could be done as part of the loop mentioned in the comment above.
                squares[alienInvaders[i]].classList.add('invader')
            }
        }
    } 

    // call the draw() function above.
    draw()

    // Function to remove an alienInvader
    function remove() {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove ('invader')
        }
    }

    squares[currentShooterIndex].classList.add('shooter') 
    // Function that moves the shooter.
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter') 
        console.log(e.key)
        // Only listening for arrowLeft and arrowRight.
        switch(e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -=1
                break
            case 'ArrowRight':
                if (currentShooterIndex % width < width -1) currentShooterIndex +=1
                break
        }
        // Adds the class 'shooter' to the correct square.
        squares[currentShooterIndex].classList.add('shooter') 
    }
    // Instantiating moveShooter.
    document.addEventListener('keydown', moveShooter)

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0 
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
        remove()

        if(rightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width +1
                direction = -1
                goingRight = false
            }
        }

        if(leftEdge && !goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width -1
                direction = 1
                goingRight = true
            }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction     
        }

        draw()

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter' )) {
            // let gameRunning = false;
            resultsDisplay.innerHTML = 'GAME OVER!'
            clearInterval(invadersId)
        }

        for (let i = 0; i < alienInvaders.length; i++) { 
            if (alienInvaders[i] >= 200) {
            // let gameRunning = false;
            resultsDisplay.innerHTML = 'GAME OVER!'
            clearInterval(invadersId)
        }        
        } 

        if (aliensRemoved.length === alienInvaders.length) {
            resultsDisplay.innerHTML = 'YOU WIN! '
            clearInterval(invadersId)
        }
    } 

    invadersId = setInterval(moveInvaders, 100) 

    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex

        function moveLaser() {
            // If currentLazerIndex is more than 0
            // Then proceed
            // remove class 'lazer'
            
            if (currentLaserIndex > 14) {
                squares[currentLaserIndex].classList.remove('laser')
                // calculate the new position.
                currentLaserIndex -= width // because width is the same as height (aka a square)
                // if within the confines of the grid, proceed with moving the laser.
                // otherwise just remove the laser class
                console.log(currentLaserIndex)
                squares[currentLaserIndex].classList.add('laser')
            } else if(currentLaserIndex <= 14){
                    squares[currentLaserIndex].classList.remove('laser')
                } if (squares[currentLaserIndex].classList.contains('invader')){
                    squares[currentLaserIndex].classList.remove('laser')
                    squares[currentLaserIndex].classList.remove('invader')
                    squares[currentLaserIndex].classList.add('boom')

                    setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
                    clearInterval(laserId)

                    const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
                    aliensRemoved.push(alienRemoved)
                    results++
                    resultsDisplay.innerHTML = results        
                } 
            
        }

        switch(e.key){
            case 'ArrowUp':
                laserId = setInterval(moveLaser, 300)
        }
    }

    document.addEventListener('keydown', shoot)



