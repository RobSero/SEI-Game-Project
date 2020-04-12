function init() {
 
  const width = 10
  const cellCount = width * width
  const cells = []
  const wallCells = [0,1,2,3,4,5,6,7,8,9,10,19,20,22,23,24,26,27,29,30,32,33,34,36,37,39,40,49,50,52,53,54,55,56,57,59,60,62,63,64,65,66,67,69,70,72,73,74,75,76,77,79,80,89,90,91,92,93,94,95,96,97,98,99]
  const scoreDisplay = document.getElementById('score-display')
 

  // ------------------------------------------------------- ELEMENTS  -------------------------------------- //


  const grid = document.querySelector('.grid')
  const startButton = document.getElementById('start')
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






  // -------------------------------------------------------BUILD CHARACTER OBJECTS  -------------------------------------- //


  const pacman = {
    divNo: 85,
    move: 0
  }
  

  const greenGhost = {
    name: 'greenGhost',
    prevDivNo: 0,
    positionDivNo: 15,
    move: 0,
    target: 85,
    upperDiv: 0,
    lowerDiv: 0,
    leftDiv: 0,
    rightDiv: 0,
    upperDistanceToTarget: 0,
    lowerDistanceToTarget: 0,
    leftDistanceToTarget: 0,
    rightDistanceToTarget: 0
  }

  const redGhost = {
    name: 'redGhost',
    prevDivNo: 0,
    positionDivNo: 81,
    move: 0,
    target: 11,
    upperDiv: 0,
    lowerDiv: 0,
    leftDiv: 0,
    rightDiv: 0,
    upperDistanceToTarget: 0,
    lowerDistanceToTarget: 0,
    leftDistanceToTarget: 0,
    rightDistanceToTarget: 0
  }


  // -------------------------------------------------------PACMAN OBJECT AND MOVEMENT -------------------------------------- //

  


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

  function moveGhost(ghost){
  
    ghost.upperDiv = ghost.positionDivNo - 10
    ghost.lowerDiv = ghost.positionDivNo + 10
    ghost.leftDiv = ghost.positionDivNo - 1
    ghost.rightDiv = ghost.positionDivNo + 1
    calculateSurroundingDistances(ghost)
    findShortestRoute(ghost)
    cells[ghost.positionDivNo].classList.remove(ghost.name)
    ghost.prevDivNo = ghost.positionDivNo
    ghost.positionDivNo += ghost.move
    cells[ghost.positionDivNo].classList.add(ghost.name)


    // ------- Calculating each cell around

    function calculateSurroundingDistances(ghost) {
      console.log(ghost)
      
      if (wallCells.includes(ghost.upperDiv) || cells[ghost.prevDivNo] === cells[ghost.upperDiv]){
        ghost.upperDistanceToTarget = 100000 
        // console.log('upper= ' + ghost.upperDistanceToTarget)
      } else {
        ghost.upperDistanceToTarget = pythagorusTheory(ghost.target, ghost.upperDiv)
        // console.log('upper= ' + ghost.upperDistanceToTarget)
      }

      if (wallCells.includes(ghost.lowerDiv) || cells[ghost.prevDivNo] === cells[ghost.lowerDiv]){
        ghost.lowerDistanceToTarget = 100000 
        // console.log('lower = ' + ghost.lowerDistanceToTarget)
        
      } else {
        ghost.lowerDistanceToTarget = pythagorusTheory(ghost.target, ghost.lowerDiv)
        // console.log(lowerDistanceToTarget)
      }

      if (wallCells.includes(ghost.leftDiv) || cells[ghost.prevDivNo] === cells[ghost.leftDiv]){
        ghost.leftDistanceToTarget = 100000 
      } else {
        ghost.leftDistanceToTarget = pythagorusTheory(ghost.target, ghost.leftDiv)
        // console.log('left= ' + ghost.leftDistanceToTarget)
      }

      if (wallCells.includes(ghost.rightDiv) || cells[ghost.prevDivNo] === cells[ghost.rightDiv]){
        ghost.rightDistanceToTarget = 100000 
      } else {
        ghost.rightDistanceToTarget = pythagorusTheory(ghost.target, ghost.rightDiv)
        // console.log('right= ' + ghost.rightDistanceToTarget)
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

    function findShortestRoute(ghost) {
      if (
        ghost.upperDistanceToTarget < ghost.lowerDistanceToTarget && 
      ghost.upperDistanceToTarget < ghost.leftDistanceToTarget && 
      ghost.upperDistanceToTarget < ghost.rightDistanceToTarget) {
        ghost.move = -10
        return
      }

      if (
        ghost.lowerDistanceToTarget < ghost.rightDistanceToTarget && 
      ghost.lowerDistanceToTarget < ghost.leftDistanceToTarget && 
      ghost.lowerDistanceToTarget < ghost.upperDistanceToTarget) {
        ghost.move = 10
        return
      } 

      if (
        ghost.rightDistanceToTarget < ghost.lowerDistanceToTarget && 
      ghost.rightDistanceToTarget < ghost.leftDistanceToTarget && 
      ghost.rightDistanceToTarget < ghost.upperDistanceToTarget) {
        ghost.move = 1
        return
      } 

      if (
        ghost.leftDistanceToTarget < ghost.lowerDistanceToTarget && 
      ghost.leftDistanceToTarget < ghost.rightDistanceToTarget && 
      ghost.leftDistanceToTarget < ghost.upperDistanceToTarget) {
        ghost.move = -1
        return
      } 

      if (ghost.upperDistanceToTarget !== 100000){
        ghost.move = -10
        return
      } else if (ghost.rightDistanceToTarget !== 100000){
        ghost.move = 1
        return
      } else if (ghost.lowerDistanceToTarget !== 100000){
        ghost.move = 10
        return
      } else {
        ghost.move = -1
        return
      }

    }

  }
  
  


  setInterval(()=> {
    moveGhost(greenGhost)
  }, 200)

  setInterval(()=> {
    moveGhost(redGhost)
  }, 350)

  // ------------------------------------------- GHOST TARGETTING LOGIC -------------------------------------- 

  let chase = false
  let scattering = setInterval(scatterGhost, 150)
  let chasing = 0
 
 
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
 
  function ghostChase() {
    greenGhost.target = pacman.divNo
    // console.log(greenGhost.target)
    redGhost.target = greenGhost.target - 11
  }
 
  function scatterGhost(){
    greenGhost.target = 19
    redGhost.target = 11
    // console.log(greenGhost.target)
  }
 
   
 
  const toggleChaseMode = setInterval(toggleChase, 5000)

  // ------------------------------------------- WIN CONDITION -------------------------------------- 


  function checkForLose() {
    if (pacman.divNo === ghost.divNo) {
      clearInterval(toggleChaseMode)
      clearInterval(scattering)
      clearInterval(chasing)
      clearInterval(moveGhost)
      clearInterval(movePacMan)
      alert('you lose')
      
    }
  }

  //setInterval(checkForLose, 150)





}

window.addEventListener('DOMContentLoaded', init)