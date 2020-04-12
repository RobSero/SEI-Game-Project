function init() {
 
  const grid = document.querySelector('.grid')
  const width = 10
  const cellCount = width * width
  const cells = []
  const wallCells = [0,1,2,3,4,5,6,7,8,9,10,19,20,22,23,24,26,27,29,30,32,33,34,36,37,39,40,49,50,52,53,54,55,56,57,59,60,62,63,64,65,66,67,69,70,72,73,74,75,76,77,79,80,89,90,91,92,93,94,95,96,97,98,99]
  const scoreDisplay = document.getElementById('score-display')
  const body = document.body


  // -------------------------------------------------------CREATE BOARD -------------------------------------- //

  function createCells(){
    for (let i = 0; i < cellCount; i++){
      const cell = document.createElement('div')
      cell.setAttribute('id', i)
      cell.textContent = i
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  createCells()

  function addCellWalls(){
    wallCells.forEach(item => {
      cells[item].classList.add('blueStuff')
    })
  }

  addCellWalls()

  // ----- ADD FRUIT TO BOARD
  function addFruitToGrid(){
    fruitCells.forEach(fruit => {
      cells[fruit].classList.add('fruit')
    })
    cells[85].classList.remove('fruit')
  }
 
  addFruitToGrid()



  // -------------------------------------------------------PACMAN OBJECT AND MOVEMENT -------------------------------------- //

  const pacman = {
    divNo: 85,
    move: 0
  }



  function movePacMan(){
    cells[pacman.divNo].classList.remove('pacman')
    //  CELLS[85]
    const newDiv = pacman.divNo + pacman.move
    //     86      =     85   +   1

    if (!wallCells.includes(newDiv)){
    //                     86
      pacman.divNo += pacman.move
      cells[pacman.divNo].classList.add('pacman')
    // cells[86]
    // console.log(pacman.divNo + ' no clash can move')
    } else {
      cells[pacman.divNo].classList.add('pacman')
    // console.log(pacman.divNo + ' CLASHED')
    }
  }
  setInterval(movePacMan, 130)

  // ------------------------------------------- VALIDATE KEY PRESS AND UPDATE PACMAN MOVE -------------------------------------- 

  function validatePress(event){
    let moveDirection
    switch (event.keyCode){
      case 38:
        moveDirection = -10
        break
      case 40:
        moveDirection = 10
        break
      case 39:
        moveDirection = 1
        break
      case 37:
        moveDirection = -1
        break
      default:
        return
    }
  
    if (wallCells.includes(pacman.divNo + moveDirection)){
      return
    } else {
      if (moveDirection !== pacman.move){
        pacman.move = moveDirection
      }
    }
   
  }
  
  window.addEventListener('keydown', validatePress)


  // ------------------------------------------- PACMAN EATS FRUIT -------------------------------------- 

  function eatFruit(){

    if (cells[pacman.divNo].classList.contains('fruit')){
      score += 100
      cells[pacman.divNo].classList.remove('fruit')
      scoreDisplay.innerHTML = score
    } else {
      cells[pacman.divNo].classList.remove('fruit')
    }
  }
  setInterval(eatFruit, 130)

  // ------------------------------------------- GHOST OBJECT  -------------------------------------- 

  const ghost = {
    prevDivNo: 0,
    divNo: 15,
    move: 0,
    target: 85
  }

  function moveGhost(){
  
    const upperDiv = ghost.divNo - 10
    const lowerDiv = ghost.divNo + 10
    const leftDiv = ghost.divNo - 1
    const rightDiv = ghost.divNo + 1
    let upperDistanceToTarget =  0
    let lowerDistanceToTarget =  0
    let leftDistanceToTarget =  0
    let rightDistanceToTarget =  0
    calculateSurroundingDistances()
    findShortestRoute()

    cells[ghost.divNo].classList.remove('greenGhost')
    ghost.prevDivNo = ghost.divNo
    ghost.divNo += ghost.move
    cells[ghost.divNo].classList.add('greenGhost')


    // ------- Calculating each cell around

    function calculateSurroundingDistances() {
      if (wallCells.includes(upperDiv) || cells[ghost.prevDivNo] === cells[upperDiv]){
        upperDistanceToTarget = 100000 
        console.log('upper= ' + upperDistanceToTarget)
      } else {
        upperDistanceToTarget = pythagorusTheory(ghost.target, upperDiv)
        console.log('upper= ' + upperDistanceToTarget)
      }

      if (wallCells.includes(lowerDiv) || cells[ghost.prevDivNo] === cells[lowerDiv]){
        lowerDistanceToTarget = 100000 
        console.log('lower = ' + lowerDistanceToTarget)
        
      } else {
        lowerDistanceToTarget = pythagorusTheory(ghost.target, lowerDiv)
        // console.log(lowerDistanceToTarget)
      }

      if (wallCells.includes(leftDiv) || cells[ghost.prevDivNo] === cells[leftDiv]){
        leftDistanceToTarget = 100000 
      } else {
        leftDistanceToTarget = pythagorusTheory(ghost.target, leftDiv)
        console.log('left= ' + leftDistanceToTarget)
      }

      if (wallCells.includes(rightDiv) || cells[ghost.prevDivNo] === cells[rightDiv]){
        rightDistanceToTarget = 100000 
      } else {
        rightDistanceToTarget = pythagorusTheory(ghost.target, rightDiv)
        console.log('right= ' + rightDistanceToTarget)
      }
    }
    

    // ------------- PYTHAGORAS --------------------

    function pythagorusTheory(target, possibleDiv) {
      const a = cells[target].offsetLeft - cells[possibleDiv].offsetLeft
      const b = cells[target].offsetTop - cells[possibleDiv].offsetTop
      const distance = Math.sqrt((a * a) + (b * b))
      return distance
    }

    // ----- Choosing the shortest route

    function findShortestRoute() {
      if (
        upperDistanceToTarget < lowerDistanceToTarget && 
      upperDistanceToTarget < leftDistanceToTarget && 
      upperDistanceToTarget < rightDistanceToTarget) {
        ghost.move = -10
        return
      }

      if (
        lowerDistanceToTarget < rightDistanceToTarget && 
      lowerDistanceToTarget < leftDistanceToTarget && 
      lowerDistanceToTarget < upperDistanceToTarget) {
        ghost.move = 10
        return
      } 

      if (
        rightDistanceToTarget < lowerDistanceToTarget && 
      rightDistanceToTarget < leftDistanceToTarget && 
      rightDistanceToTarget < upperDistanceToTarget) {
        ghost.move = 1
        return
      } 

      if (
        leftDistanceToTarget < lowerDistanceToTarget && 
      leftDistanceToTarget < rightDistanceToTarget && 
      leftDistanceToTarget < upperDistanceToTarget) {
        ghost.move = -1
        return
      } 

      if (upperDistanceToTarget !== 100000){
        ghost.move = -10
        return
      } else if (rightDistanceToTarget !== 100000){
        ghost.move = 1
        return
      } else if (lowerDistanceToTarget !== 100000){
        ghost.move = 10
        return
      } else {
        ghost.move = -1
        return
      }

    }

  }

  setInterval(moveGhost, 200)

  // ------------------------------------------- GHOST TARGETTING LOGIC -------------------------------------- 

  let chase = false
  let scattering = setInterval(scatterGhost, 150)
  let chasing = 0

  function ghostChase() {
    ghost.target = pacman.divNo
    console.log(ghost.target)
  }

  function scatterGhost(){
    ghost.target = 19
    console.log(ghost.target)
  }

  function toggleChase(){
    if (chase){
      clearInterval(chasing)
      chase = false
      scattering = setInterval(scatterGhost, 150)
      body.style.backgroundColor = 'green'
    } else {
      clearInterval(scattering)
      chase = true
      chasing = setInterval(ghostChase, 500)
      body.style.backgroundColor = 'pink'
    }
  }

  setInterval(toggleChase, 5000)







}

window.addEventListener('DOMContentLoaded', init)