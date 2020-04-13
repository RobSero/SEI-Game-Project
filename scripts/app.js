function init() {


  // ------------------------------------------------------- GLOBAL VARIABLES  -------------------------------------- //



  let playing = false
  const width = 20
  const cellCount = width * width
  const cells = []
  const wallCells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,31,35,39,40,42,44,45,46,47,53,57,59,60,67,69,70,71,73,75,76,77,79,80,82,84,85,89,90,91,99,100,102,104,105,109,113,115,116,117,119,120,122,126,127,131,132,133,139,140,142,143,144,148,19,150,154,156,157,158,159,160,164,166,179,180,182,184,186,188,189,190,191,193,194,195,196,199,200,204,206,208,209,210,211,215,216,219,220,222,223,226,233,239,240,242,243,249,255,257,258,259,260,262,266,267,269,271,272,273,275,279,280,282,284,286,289,291,292,293,295,297,299,300,306,308,319,320,322,323,324,330,331,332,333,335,336,337,339,340,342,343,344,346,347,348,355,356,357,359,360,370,371,372,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399] const wallCells = [0,1,2,3,4,5,6,7,8,9,10,19,20,22,23,24,26,27,29,30,32,33,34,36,37,39,40,49,50,52,53,54,55,56,57,59,60,62,63,64,65,66,67,69,70,72,73,74,75,76,77,79,80,89,90,91,92,93,94,95,96,97,98,99]
  const fruitCells = [22,23,24,25,26,27,28,32,33,34,36,37,41,43,48,49,50,51,52,54,55,56,58,61,62,63,64,65,66,68,72,74,78,81,83,86,87,88,92,93,94,95,96,97,98,101,103,106,107,108,110,111,112,114,118,121,123,124,125,128,129,130,134,135,136,137,138,141,145,146,147,149,151,152,153,155,161,162,163,165,167,168,169,170,171,172,173,174,175,176,177,178,181,185,187,192,197,201,202,203,205,207,212,213,214,217,218,221,224,225,227,228,229,230,231,232,234,235,236,237,238,241,244,245,246,247,248,250,251,252,253,254,256,261,263,264,265,268,270,274,276,277,278,281,283,285,287,288,290,294,296,298,301,302,303,304,305,307,309,310,311,312,313,314,315,316,317,318,321,325,326,327,328,329,334,338,341,345,349,350,351,352,353,354,358,362,363,364,365,366,367,368,369,373,374,375,376,377]
  const bigFruitCells = [21,38,183,198,361,378]
  const startingPostion = 350
  let score = 0
  let chase = true
  let toggleChaseMode
  let scattering 
  let chasing
  const ghostHome = 170 
  
  // const styleSheet = document.getElementById('stylesheet').sheet

  // styleSheet.insertRule('body {background-color: yellow}')
  // styleSheet.deleteRule('.greenGhost { background-image: url(/assets/greenGhost.png)}')
  // styleSheet.insertRule('.greenGhost { background-image: url(/assets/yellowGhost.png)}')


  // ------------------------------------------------------- ELEMENTS  -------------------------------------- //


  const grid = document.querySelector('.grid')
  const startButton = document.getElementById('start')
  const scoreDisplay = document.getElementById('score-display')
  const body = document.body
  
  // ------------------------------------------------------- START GAME  -------------------------------------- //



  function startGame() {

    if (!playing){
      //build board
      playing = true
      buildBoard()
      //begin pacman movement
      setInterval(movePacMan, 130)
      setInterval(eatFruit, 130)
      setInterval(eatBigFruit, 130)
      setInterval(checkForWin, 130)
      //begin ghost movement
      setInterval(()=> {
        moveGhost(greenGhost)
      }, 100)
  
      setInterval(()=> {
        moveGhost(redGhost)
      }, 100)
    }
    //toggle between chase and scatter modes
    toggleChase(chase)
    toggleChaseMode = setInterval(() => {
      toggleChase(chase)
    }, 5000)
    //setInterval(checkForLose, 150)
  }

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
    state: 'normal',
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
    state: 'normal',
    upperDiv: 0,
    lowerDiv: 0,
    leftDiv: 0,
    rightDiv: 0,
    upperDistanceToTarget: 0,
    lowerDistanceToTarget: 0,
    leftDistanceToTarget: 0,
    rightDistanceToTarget: 0
  }

  const ghosts = [greenGhost,redGhost]

  // -------------------------------------------------------CREATE BOARD -------------------------------------- //

  function buildBoard() {

    function createCells(){
      for (let i = 0; i < cellCount; i++){
        const cell = document.createElement('div')
        cell.setAttribute('id', i)
        cell.textContent = i
        grid.appendChild(cell)
        cells.push(cell)
      }
    }

    // ----- ADD BUILD WALLS ON GRID
    function addCellWalls(){
      wallCells.forEach(item => {
        cells[item].classList.add('blueStuff')
      })
    }

    // ----- ADD FRUIT TO BOARD
    function addFruitToGrid(){
      fruitCells.forEach(fruit => {
        cells[fruit].classList.add('fruit')
      })
      cells[85].classList.remove('fruit')
    }
    

    // ----- ADD BIG FRUIT TO GRID
    function addBigFruitToGrid() {
      bigFruitCells.forEach(bigFruit => {
        cells[bigFruit].classList.add('bigFruit')
      })
    }




    createCells()
    addCellWalls()
    addFruitToGrid()
    addBigFruitToGrid()


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
        moveDirection = -width
        break
      case 40:
        moveDirection = width
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

    if (wallCells.includes(pacman.positionDivNo + moveDirection)){
      return
    } else {
      if (moveDirection !== pacman.move){
        pacman.move = moveDirection
      }
    }
  }



  // ------------------------------------------- PACMAN EATS NORMAL FRUIT -------------------------------------- 

  function eatFruit(){

    if (cells[pacman.divNo].classList.contains('fruit')){
      score += 100
      cells[pacman.divNo].classList.remove('fruit')
      scoreDisplay.innerHTML = score
    } else {
      cells[pacman.divNo].classList.remove('fruit')
    }
  }

  // ------------------------------------------- PACMAN EATS BIG FRUIT -------------------------------------- 

  function eatBigFruit(){

    if (cells[pacman.divNo].classList.contains('bigFruit')){
      score += 500
      cells[pacman.divNo].classList.remove('bigFruit')
      scoreDisplay.innerHTML = score
      bigFruitEaten()
    } else {
      cells[pacman.divNo].classList.remove('bigFruit')
    }
  }

  function scaredGhostState(){
  
    greenGhost.state = 'scared'
    redGhost.state = 'scared'
    console.log(`GreenGhost State: ${greenGhost.state}`)
    
  }


  // ------------------------------------------- MOVE GHOST  -------------------------------------- 

  function moveGhost(ghost){
    if (ghost.positionDivNo === ghostHome && ghost.state === 'eaten'){
      homeTimer(ghost)
      ghost.state = 'waiting'
      return
    }
    if (ghost.state === 'waiting'){
      return
    }
    ghost.upperDiv = ghost.positionDivNo - width
    ghost.lowerDiv = ghost.positionDivNo + width
    ghost.leftDiv = ghost.positionDivNo - 1
    ghost.rightDiv = ghost.positionDivNo + 1
    calculateSurroundingDistances(ghost)
    findShortestRoute(ghost)
    
    
    cells[ghost.positionDivNo].classList.remove(ghost.name)
    cells[ghost.positionDivNo].classList.remove('scaredGhost')
    cells[ghost.positionDivNo].classList.remove('eatenGhost')
    ghost.prevDivNo = ghost.positionDivNo
    ghost.positionDivNo += ghost.move
    cells[ghost.positionDivNo].classList.add( ghostIcon(ghost))


    function ghostIcon(ghost) {
      if (ghost.state === 'scared'){
        return 'scaredGhost'
      } else if (ghost.state === 'eaten') {
        console.log('yummy')
        
        return 'eatenGhost'
      } else {
        return ghost.name
      }
    }

    // ------- Calculating each cell around

    function calculateSurroundingDistances(ghost) {
      // console.log(ghost)
      
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
        ghost.move = - width
        return
        
        
      }

      if (
        ghost.lowerDistanceToTarget < ghost.rightDistanceToTarget && 
      ghost.lowerDistanceToTarget < ghost.leftDistanceToTarget && 
      ghost.lowerDistanceToTarget < ghost.upperDistanceToTarget) {
        ghost.move = width
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
        ghost.move = - width
        return
      } else if (ghost.rightDistanceToTarget !== 100000){
        ghost.move = 1
        return
      } else if (ghost.lowerDistanceToTarget !== 100000){
        ghost.move = width
        return
      } else {
        ghost.move = -1
        return
      }

    }

  }
  
  // ------------------------------------------- GHOST TARGETTING LOGIC -------------------------------------- 

  
  function toggleChase(isChasing){
   
    if (isChasing){
      clearInterval(chasing)
      chase = false
      scattering = setInterval(scatterGhostPath, 150)
      body.style.backgroundColor = 'green'
    } else {
      clearInterval(scattering)
      chase = true
      chasing = setInterval(ghostChasePath, 500)
      body.style.backgroundColor = 'pink'
    }
  }

  function ghostChasePath() {
    if (greenGhost.state === 'normal'){
      greenGhost.target = pacman.divNo
    }
    if (redGhost.state === 'normal'){
      redGhost.target = greenGhost.target - 11
    }
    // console.log(greenGhost.target)
  }

  function scatterGhostPath(){
    if (greenGhost.state === 'normal'){
      greenGhost.target = 19
    }
    if (redGhost.state === 'normal'){
      redGhost.target = 11
    }
    
    // console.log(greenGhost.target)
  }

  function scaredGhostPath(){
    if (greenGhost.state === 'scared') {
      greenGhost.target = Math.floor(Math.random() * 100)
      redGhost.target = Math.floor(Math.random() * 100)
    }
  }

  function eatenGhostPath() {
    if (greenGhost.state === 'eaten'){
      greenGhost.target = ghostHome
    }
    if (redGhost.state === 'eaten'){
      redGhost.target = ghostHome
    }
  }


  function bigFruitEaten() {
    setInterval(eatenGhostPath, 150)
    scaredGhostState()
    setInterval(scaredGhostPath, 150)
    setTimeout(()=> {
      if (greenGhost.state === 'scared'){
        greenGhost.state = 'normal'
      }
      if (redGhost.state === 'scared') {
        redGhost.state = 'normal'
      }
      console.log(`GreenGhost State: ${greenGhost.state}`)
      toggleChase(chase)
    }, 6000)
  }


  // ------------------------------------------- CHECK IF GHOSTS ARE EATEN -------------------------------------- 

  
  function checkIfEaten(ghost){
    if (pacman.divNo === ghost.positionDivNo && ghost.state === 'scared'){
      score += 500
      ghost.state = 'eaten'
      console.log(`${ghost.name} State: ${ghost.state}`)
    }
  }

  const eatenCheck = setInterval(() => {
    checkIfEaten(greenGhost)
    checkIfEaten(redGhost)
  },10)

  function homeTimer(ghost){
    setTimeout(()=> {
      ghost.state = 'normal'
      console.log(`${ghost.name} back to normal wooo`)
      
    }, 4000)
  }
  
   

  // ------------------------------------------- WIN / LOSE CONDITION -------------------------------------- 

  function checkForWin() {
    if (cells.every(cell => {
      return !(cell.classList.contains('fruit'))
    })) {
      alert('you win!')
    } 
  }

  function checkForLose() {
    ghosts.forEach(ghost => {
      if (pacman.positionDivNo === ghost.positionDivNo && ghost.state === 'normal') {
        alert('you lose!')
      }
    })
  }

  setInterval(checkForLose, 50)

  // ------------------------------------------- EVENTS  -------------------------------------- 

  startButton.addEventListener('click', () => {
    if (!playing) {
      startGame()
      window.addEventListener('keydown', validatePress)
    }
  })
  
}


window.addEventListener('DOMContentLoaded', init)