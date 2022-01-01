const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreDisplay = document.getElementById('score')
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 10
let pumpkinIndex = 0
let ghostIndex = 0
let coins = 0
let intervalTime = 1000
let speed = 0.9
let timerId = 0
const myPumpkin = new Audio('audio/my-pumpkin.mp3')
const lostPumpkin = new Audio('audio/pumpkin-lost.mp3')
const gameOver = new Audio('audio/game-over.mp3')
const gameAudio = new Audio('audio/halloween.mp3')




function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into our grid
    grid.appendChild(square)
    //push it into a new squares array    
    squares.push(square)
    }
}
createGrid()

currentSnake.forEach(index => squares[index].classList.add('snake'))

function startGame() {
    // play gameAudio
    gameAudio.volume = .1 
    gameAudio.play()
    gameAudio.loop = true
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    //remove the pumpkin
    squares[pumpkinIndex].classList.remove('pumpkin')
    squares[ghostIndex].classList.remove('ghost')
    clearInterval(timerId)
    currentSnake = [2,1,0]
    coins = 0
    //re add new score to browser
    scoreDisplay.textContent = coins
    direction = 1
    intervalTime = 1000
    generatePumpkin()
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, intervalTime)
}

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
        
    ) {
        // Stop gameAudio
        gameAudio.pause()
        gameAudio.currentTime = 0
        gameOver.play()
    return clearInterval(timerId)

    
    }
    
    //remove last element from our currentSnake array
    const tail = currentSnake.pop()
    //remove styling from last element
    squares[tail].classList.remove('snake')
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    //add styling so we can see it
    
    //deal with snake head gets pumpkin
    if (squares[currentSnake[0]].classList.contains('pumpkin')) {
        // play myPumpkin
        myPumpkin.play()
        
        //remove the class of pumpkin
        squares[currentSnake[0]].classList.remove('pumpkin')
        // squares[ghostIndex].classList.remove('ghost')
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake')
        //grow our snake array
        currentSnake.push(tail)
        //generate new pumpkin
        generatePumpkin()
        //add one to the score
        coins++
        //display our score
        scoreDisplay.textContent = coins
        //speed up our snake
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
        
        // Deal with ghost haunting snake
    } else if (squares[currentSnake[0]].classList.contains('ghost')) {
        
        // Play pumpkin-lost
        lostPumpkin.play()
        // Remove the ghost
        squares[currentSnake[0]].classList.remove('ghost')
        squares[pumpkinIndex].classList.remove('pumpkin')
        // Haunt and take away a coin
        coins--
        // Display new amount of coins
        scoreDisplay.textContent = coins
        // Generate new pumpkin and Ghost
        generatePumpkin()
    }
    
    
    
    squares[currentSnake[0]].classList.add('snake')
}






function generatePumpkin() {
    do {
        pumpkinIndex = Math.floor(Math.random() * squares.length)
        ghostIndex = Math.floor(Math.random() * squares.length)
    } while (squares[pumpkinIndex].classList.contains('snake'))
    squares[pumpkinIndex].classList.add('pumpkin')
    squares[ghostIndex].classList.add('ghost')
} 
generatePumpkin()

//MOVEMENT
function control(e) {
    switch (event.key) {
    case "ArrowLeft":
        direction = -1
        break;
    case "ArrowRight":
        direction = 1
        break;
    case "ArrowUp":
        direction = -width
        break;
    case "ArrowDown":
        direction = +width
        break;
}

}



document.addEventListener('keyup', control)
startButton.addEventListener('click', startGame)

