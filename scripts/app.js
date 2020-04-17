function init() {


  // ------------------------------------------------------- GLOBAL VARIABLES  ------------------------------------------------- //



  let playing = false
  //  ------------- grid variables ---------------
  const width = 20
  const cellCount = width * width
  let cells = []
  const wallCells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,31,35,39,40,42,44,45,46,47,53,57,59,60,67,69,70,71,73,75,76,77,79,80,82,84,85,89,90,91,99,100,102,104,105,109,113,115,116,117,119,120,122,126,127,131,132,133,139,140,142,144,148,19,150,154,156,157,158,159,160,164,166,179,180,182,184,186,188,189,190,191,193,194,195,196,199,200,204,206,208,209,210,211,215,216,219,220,222,223,226,233,239,240,242,243,249,255,257,258,259,260,262,266,267,269,271,272,273,275,279,280,282,284,286,289,291,292,293,295,297,299,300,306,308,319,320,322,323,324,330,331,332,333,335,336,337,339,340,342,343,344,346,347,348,355,356,357,359,360,370,371,372,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399]

  const fruitCells = [22,23,24,25,26,27,32,33,34,36,37,41,43,48,49,50,51,52,54,55,56,58,61,62,63,64,65,66,68,72,74,78,81,83,86,87,88,92,93,94,95,96,97,98,101,103,106,107,108,110,111,112,114,118,121,123,124,125,128,129,130,134,135,136,137,138,141,145,146,147,149,151,152,153,155,161,162,163,165,167,168,169,170,171,173,174,175,176,177,178,183,185,187,192,197,201,202,203,205,207,212,213,214,217,218,221,224,225,227,228,229,230,231,232,234,235,236,237,238,241,244,245,246,247,248,250,251,252,253,254,256,261,263,264,265,268,270,274,276,277,278,281,283,285,287,288,294,296,298,301,302,303,304,305,307,309,310,311,312,313,314,315,316,317,318,321,325,326,327,328,329,334,338,341,345,349,350,351,352,353,354,358,362,363,364,365,366,367,368,369,374,375,376,377]

  const bigFruitCells = [21,38,198,361,378]

  //  -------- grid traps variables -------------

  const trapDoor = [28,373] //secret door locations
  const holeTraps = [230,231,232,250,251,252] //holetrap locations
  let trapDoorCooldown = false //determines if secretdoor can be used

  //  -------- pacman ariables -------------

  const startingPostion = 350 // pacman spawn
  let score = 0
  const pacmanSpeed = 150 //interval speed of pacman movement
  let pacmanMoveInterval //assigned an interval to move pacman

  //  -------- ghost variables -------------

  let chase = true
  let toggleChaseMode //Assigned an interval to swap between modes
  let chaseOrScattering // controls which target the ghost is chasing based on chase status
  let eatenCheck //interval to check if ghost has been eaten by pacman
  const ghostHome = 170  // ghost home location & spawn point
  let scaredGhostCooldown
  




  // ----------------------------------------------------------- GET ELEMENTS  ---------------------------------------------------------- //


  const grid = document.querySelector('.grid')
  const gridWrapper = document.querySelector('.grid-wrapper')
  const controlWrapper = document.querySelector('.controls-wrapper')
  const startButton = document.getElementById('start')
  const scoreDisplay = document.getElementById('score-display')
  const mainMenu = document.getElementById('main-menu')
  const gameOverMenu = document.querySelector('.gameOver')
  const gameWinMenu = document.querySelector('.gameWon')
  const resetButton = document.querySelector('#restart')
  const resetButtonWin = document.querySelector('#restartWin')
  const endScore = document.getElementById('end-score')
  const loseMethod = document.querySelector('.loseMethod')

  //  -------- sprite animated stylesheet element -------------
    
  const spriteStyleSheet = document.createElement('style')

  //  -------- sound elements-------------

  const themeSongAudio = document.getElementById('theme-tune')
  const coinAudio = document.getElementById('audio-coin')
  const bigGemAudio = document.getElementById('audio-bigGem')
  const deathAudio = document.getElementById('audio-death')
  const cheerAudio = document.getElementById('audio-cheer')
  const eatAudio = document.getElementById('audio-eat')
  const fireAudio = document.getElementById('audio-fire')
  const openAudio = document.getElementById('audio-open')
  const fallAudio = document.getElementById('audio-fall')






  // ------------------------------------------------------- START GAME  -------------------------------------- //
  startButton.addEventListener('click', () => {
    //Positions pacman, hides main menu, shows grid and starts game function
    if (!playing) {
      ghosts.forEach(ghost => {
        clearInterval(ghost.speed)
      })
      ghosts.forEach(ghost => {
        ghost.positionDivNo = 170
        ghost.state = 'normal'
      })
      pacman.positionDivNo = startingPostion
      startGame()
      gridWrapper.style.display = 'flex'
      controlWrapper.style.display = 'flex'
      mainMenu.style.display = 'none'
      //starts listening for keypress
      window.addEventListener('keypress', validatePress)
    }
  })


  function startGame() {
    if (!playing){
      playing = true
      //reset cells
      cells = []
      //build board
      buildBoard()
      //begin pacman movement
      startPacmanLogic()
      //begin ghost logic and spawn
      startGhostLogic()
    }
  }

  function startPacmanLogic() {
    //set all interval checks going
    setInterval(eatFruit, 130)
    setInterval(eatBigFruit, 130)
    setInterval(checkForWin, 20)
    setInterval(checkForLose, 20)
    setInterval(secretDoorCheck,20)
    pacmanMoveInterval = setInterval(movePacMan, pacmanSpeed)
  }

  function startGhostLogic() {
    //start moving each ghost
    ghosts.forEach(ghost => {
      ghost.speed = setInterval(()=> {
        moveGhost(ghost)
      },300)
    })
    //toggle between chase mode and scatter mode
    toggleChase(chase)
    toggleChaseMode = setInterval(() => {
      toggleChase(chase)
    }, 8000)
    //start interval to check if ghost is eaten
    clearInterval(eatenCheck)
    eatenCheck = setInterval(checkIfEaten,40)

  }
  
    


  // -------------------------------------------------------BUILD CHARACTER OBJECTS  -------------------------------------- //


  const pacman = {
    positionDivNo: startingPostion,
    move: 0
  }
  
  const greenGhost = {
    name: 'greenGhost',
    prevDivNo: 0,
    positionDivNo: 170,
    move: 0,
    target: 19,
    initialTarget: 19,
    chaseTarget: pacman.positionDivNo,  //this ghost targets exactly pacman's cell during chase mode
    speed: '', // this will be assigned an interval to move
    state: 'normal', // the state will dictate the ghosts targetting behaviour
    upperDiv: 0,  // these are the cells around the ghost
    lowerDiv: 0,
    leftDiv: 0,
    rightDiv: 0,
    upperDistanceToTarget: 0,  // these are the distances which will be caluclated for each cell around the ghost
    lowerDistanceToTarget: 0,
    leftDistanceToTarget: 0,
    rightDistanceToTarget: 0
  }

  const redGhost = {
    name: 'redGhost',
    prevDivNo: 0,
    positionDivNo: 170,
    move: 0,
    target: 0,
    initialTarget: 0,
    chaseTarget: pacman.positionDivNo + 4, //this ghost targets pacman's cell id + 4 during chase mode
    speed: '',
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

  const yellowGhost = {
    name: 'yellowGhost',
    prevDivNo: 0,
    positionDivNo: 170,
    move: 0,
    target: 380,
    initialTarget: 380,
    chaseTarget: pacman.positionDivNo + pacman.move, //this ghost targets the cell where pacman will be moving to during chase mode
    speed: '',
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

  const pinkGhost = {
    name: 'pinkGhost',
    prevDivNo: 0,
    positionDivNo: 170,
    move: 0,
    target: 399,
    initialTarget: 399,
    chaseTarget: pacman.positionDivNo - 3,  //this ghost targets pacman's cell id - 3 during chase mode
    speed: '',
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

  const ghosts = [greenGhost,redGhost, yellowGhost, pinkGhost]

  // -------------------------------------------------------CREATE BOARD -------------------------------------- //

  function buildBoard() {
    // creates the board and adds in all the fruit and traps based on the global arrays
    createCells()
    addCellWalls()
    addFruitToGrid()
    addBigFruitToGrid()
    addTrapOne()
    addTrapTwo()
    addTrapThree()
    addSecretDoors()
    // start checks for if traps are triggered
    setInterval(checkForTrapTrigger,20)
    setInterval(checkForTrapDeath,20)

  }

  function createCells(){
    for (let i = 0; i < cellCount; i++){
      const cell = document.createElement('div')
      cell.setAttribute('id', i)
      // cell.textContent = i
      grid.appendChild(cell)
      cells.push(cell)
    }
    console.log(cells)
  }

  function addCellWalls(){
    wallCells.forEach(item => {
      cells[item].classList.add('walls')
    })
  }

  function addFruitToGrid(){
    fruitCells.forEach(fruit => {
      cells[fruit].classList.add('fruit')
    })
    cells[startingPostion].classList.remove('fruit')
  }

  function addBigFruitToGrid() {
    bigFruitCells.forEach(bigFruit => {
      cells[bigFruit].classList.add('bigFruit')
    })
  }

  function addTrapOne() {
    cells[181].classList.add('trapOne')
    //hardCoded value for trap, could be refactored
  }

  function addTrapTwo() {
    cells[172].classList.add('trapTwo')
    //hardCoded value for trap, could be refactored
  }

  function addTrapThree() {
    cells[290].classList.add('trapThree')
    cells[254].classList.add('trapThree')
    //hardCoded value for trap, could be refactored
  }

  function addSecretDoors() {
    cells[trapDoor[0]].classList.add('trapDoor')
    cells[trapDoor[1]].classList.add('trapDoor')
  }
  
  // -------------------------------------------------------PACMAN OBJECT AND MOVEMENT -------------------------------------- //

  //this function is on an interval set at the startGame section
  function movePacMan(){
    cells[pacman.positionDivNo].classList.remove('pacman')
    //  eg: CELLS[85]
    const newDiv = pacman.positionDivNo + pacman.move
    //     86      =     85   +   1

    if (!wallCells.includes(newDiv)){
      //                     86
      pacman.positionDivNo += pacman.move
      cells[pacman.positionDivNo].classList.add('pacman')
      // cells[86]
      // console.log(pacman.divNo + ' no clash can move')
    } else {
      cells[pacman.positionDivNo].classList.add('pacman')
      // console.log(pacman.divNo + ' CLASHED')
    }
  }

  // ------------------------------------------- VALIDATE KEY PRESS AND UPDATE PACMAN MOVE -------------------------------------- 

  function validatePress(event){
    // console.log(event.keyCode)
    event.preventDefault()
    //check if key is either W,a,s OR D
    if (playing){
      let moveDirection
      switch (event.keyCode){
        case 119:
          moveDirection = -width
          changeSprite('up')
          break
        case 115:
          moveDirection = width
          changeSprite('down')
          break
        case 100:
          moveDirection = 1 
          changeSprite('right')
          break
        case 97:
          moveDirection = -1
          changeSprite('left')
          break
        default:
          return
      }

      //checks if the key direction would move pacman into a wall
      if (wallCells.includes(pacman.positionDivNo + moveDirection)){
        return
      } else {
        if (moveDirection !== pacman.move){
          pacman.move = moveDirection
        }
      }
    }
  }

  
  // ------------------------------------------- PACMAN EATS NORMAL FRUIT -------------------------------------- 

  function eatFruit(){
    
    if (cells[pacman.positionDivNo].classList.contains('fruit')){
      scorePoints(100, pacman.positionDivNo)
      cells[pacman.positionDivNo].classList.remove('fruit')
      audio(coinAudio)
    }
    
  }

  // ------------------------------------------- PACMAN EATS BIG FRUIT -------------------------------------- 

  function eatBigFruit(){
    if (cells[pacman.positionDivNo].classList.contains('bigFruit')){
      scorePoints(500,pacman.positionDivNo)
      cells[pacman.positionDivNo].classList.remove('bigFruit')
      bigFruitEaten()
    } 
    
  }

  function bigFruitEaten() {
    audio(bigGemAudio)
    clearTimeout(scaredGhostCooldown) //resets the scared ghost timer
    scaredGhostState() // change ghost's state to scared
    // changes ghosts direction when big fruit eaten
    ghosts.forEach(ghost => {
      if (ghost.state === 'normal'){
        const curPosition = ghost.positionDivNo
        ghost.positionDivNo = ghost.prevDivNo
        ghost.prevDivNo = curPosition
        cells[ghost.prevDivNo].classList.remove(ghost.name)
        cells[ghost.prevDivNo].classList.remove('scaredGhost')
      }
    })
    //start the intervals to direct ghosts to their eaten or scared targets
    setInterval(eatenGhostPath, 150)
    
    setInterval(scaredGhostPath, 150)

    // begin a timer to return ghosts back to normal state
    scaredGhostCooldown = setTimeout(()=> {
      resetGhostState()
      toggleChase(chase)
    }, 6000) // hardCoded 6s value
  }


  function scaredGhostState(){
    ghosts.forEach(ghost => {
      ghost.state = 'scared'
    })
  }

  function resetGhostState(){
    ghosts.forEach(ghost => {
      if (ghost.state === 'scared'){ //should not turn ghosts back to normal if they are eaten
        ghost.state = 'normal'
      }
    })
  }


  // ------------------------------------------- MOVE GHOST  -------------------------------------- 
 
  // this functions is on interval set at the startGame section. Each ghost will use this function to move every 0.3s
  function moveGhost(ghost){

    //first check if the ghost is eaten or waiting to respawn - no movement if this is the case so return is used
    if (playing){
      if (ghost.positionDivNo === ghostHome && ghost.state === 'eaten'){
        homeTimer(ghost)
        ghost.state = 'waiting'
        return
      }
      if (ghost.state === 'waiting'){
        return
      }

      // ghosts need to get each cell's value around them
      getSurroundingCells(ghost)
      // the distance needs to be calculated from each cell around them in a direct line to their target cell
      calculateSurroundingDistances(ghost)
      // the shortest direct distance to their target is the move direction. This excludes wall cells
      findShortestRoute(ghost)
    
      //removes ghost class from current cell and adds ghost class to new cell
      cells[ghost.positionDivNo].classList.remove(ghost.name)
      cells[ghost.positionDivNo].classList.remove('scaredGhost')
      cells[ghost.positionDivNo].classList.remove('eatenGhost')
      ghost.prevDivNo = ghost.positionDivNo
      ghost.positionDivNo += ghost.move
      cells[ghost.positionDivNo].classList.add( ghostIcon(ghost))

    }
   

    function getSurroundingCells(ghost) {
      ghost.upperDiv = ghost.positionDivNo - width
      ghost.lowerDiv = ghost.positionDivNo + width
      ghost.leftDiv = ghost.positionDivNo - 1
      ghost.rightDiv = ghost.positionDivNo + 1
    }

    // ------- Calculating each cell around

    function calculateSurroundingDistances(ghost) {
      
      //calculate upper cell distance - checks if upper cell is a wall or if it was the last ghost position
      if (wallCells.includes(ghost.upperDiv) || cells[ghost.prevDivNo] === cells[ghost.upperDiv]){
        ghost.upperDistanceToTarget = 100000 // sets value very high if it is a wall or previous position
      } else {
        ghost.upperDistanceToTarget = pythagorusTheory(ghost.target, ghost.upperDiv)
      }

      //calculate lower cell distance - checks if lower cell is a wall or if it was the last ghost position
      if (wallCells.includes(ghost.lowerDiv) || cells[ghost.prevDivNo] === cells[ghost.lowerDiv]){
        ghost.lowerDistanceToTarget = 100000 
      } else {
        ghost.lowerDistanceToTarget = pythagorusTheory(ghost.target, ghost.lowerDiv)
        // console.log(lowerDistanceToTarget)
      }

      //calculate left cell distance - checks if left cell is a wall or if it was the last ghost position
      if (wallCells.includes(ghost.leftDiv) || cells[ghost.prevDivNo] === cells[ghost.leftDiv]){
        ghost.leftDistanceToTarget = 100000 
      } else {
        ghost.leftDistanceToTarget = pythagorusTheory(ghost.target, ghost.leftDiv)
        // console.log('left= ' + ghost.leftDistanceToTarget)
      }

      //calculate right cell distance - checks if right cell is a wall or if it was the last ghost position
      if (wallCells.includes(ghost.rightDiv) || cells[ghost.prevDivNo] === cells[ghost.rightDiv]){
        ghost.rightDistanceToTarget = 100000 
      } else {
        ghost.rightDistanceToTarget = pythagorusTheory(ghost.target, ghost.rightDiv)
        // console.log('right= ' + ghost.rightDistanceToTarget)
      }
    }
    
    // --------- uses pythagorus theory to calulate the direct distance from cell to target cell

    function pythagorusTheory(target, possibleDiv) {
      const a = cells[target].offsetLeft - cells[possibleDiv].offsetLeft // uses offset property based on the cell positions in relation to the browser window to find the x and y values
      const b = cells[target].offsetTop - cells[possibleDiv].offsetTop
      const distance = Math.sqrt((a * a) + (b * b)) // pythargorus theory: c2 = a2 + b2 if it is a right angle triangle
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

      // if two surrounding cells have the same distance, the ghost will prioritise moving up then right, then down, then left

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

    // this returns the correct class name to be applied to cell based on the ghost's state so the cell can be styled properly by css
    function ghostIcon(ghost) {
      if (ghost.state === 'scared'){
        return 'scaredGhost'
      } else if (ghost.state === 'eaten') {
        return 'eatenGhost'
      } else {
        return ghost.name
      }
    }

  }

  //this timer begins when the eaten ghost reaches it's home. 4s later they return to normal
  function homeTimer(ghost){
    setTimeout(()=> {
      ghost.state = 'normal'
      // console.log(`${ghost.name} back to normal wooo`)
    }, 4000)
  }
  
  // ------------------------------------------- GHOST TARGETTING LOGIC -------------------------------------- 

  
  function toggleChase(isChasing){
    if (playing){
      if (isChasing){
        clearInterval(chaseOrScattering)
        chase = false
        chaseOrScattering = setInterval(scatterGhostPath, 150)
      // body.style.backgroundColor = 'green'
      } else {
        clearInterval(chaseOrScattering)
        chase = true
        chaseOrScattering = setInterval(ghostChasePath, 500)
      // body.style.backgroundColor = 'pink'
      }
    }
  }

  function ghostChasePath() {
    if (playing){
      // if (greenGhost.state === 'normal'){
      //   greenGhost.target = pacman.positionDivNo
      // }
      // if (redGhost.state === 'normal'){
      //   redGhost.target = pacman.positionDivNo + 7
      // }
      // if (yellowGhost.state === 'normal'){
      //   yellowGhost.target = pacman.positionDivNo + pacman.move
      // }
      // if (pinkGhost.state === 'normal'){
      //   pinkGhost.target = pacman.positionDivNo + 10
      // }
      ghosts.forEach(ghost => {
        if (ghost.state === 'normal'){
          ghost.target = ghost.chaseTarget
        }
      })

    // console.log(greenGhost.target)
    }
  }

  function scatterGhostPath(){
    ghosts.forEach(ghost => {
      if (ghost.state === 'normal'){
        ghost.target = ghost.initialTarget
      }
    })
    // console.log(ghost.target)
  }

  function scaredGhostPath(){
    ghosts.forEach(ghost => {
      if (ghost.state === 'scared'){
        ghost.target = Math.floor(Math.random() * 100)
      }
    })
  }

  function eatenGhostPath() {
    ghosts.forEach(ghost => {
      if (ghost.state === 'eaten'){
        ghost.target = ghostHome
      }
    })
  }


  // ------------------------------------------- CHECK IF GHOSTS ARE EATEN -------------------------------------- 

  
  function checkIfEaten(){
    if (playing){
      ghosts.forEach(ghost => {
        if (pacman.positionDivNo === ghost.positionDivNo && ghost.state === 'scared'){
          scorePoints(500,ghost.positionDivNo)
          ghost.state = 'eaten'
          audio(eatAudio)
          // console.log(`${ghost.name} State: ${ghost.state}`)
        }
      })
    }
  }

  // ------------------------------------------- WIN / LOSE CONDITION -------------------------------------- 


  function checkForWin() {
    if (playing){
      if (cells.every(cell => {
        return !(cell.classList.contains('fruit'))
      })) {
        gameWin()
      }
    }
  }

  function checkForLose() {
    if (playing){
      ghosts.forEach(ghost => {
        if (pacman.positionDivNo === ghost.positionDivNo && ghost.state === 'normal') {
          gameOver('getting eaten')
        }
      })
    }
  }

  // ------------------------------------------- TRAPS -------------------------------------- 

  function checkForTrapTrigger(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('trapOne')){ // checks if trapOne is stepped on by pacman
        cells[181].classList.remove('trapOne')
        // console.log('activate once')
        fireTrapActivate(21,361,20)
        setTimeout(addTrapOne, 11000) // trap respawns after 11s. hardcoded value
      }
      if (cells[pacman.positionDivNo].classList.contains('trapTwo')){ // checks if trapTwo is stepped on by pacman
        cells[172].classList.remove('trapTwo')
        // console.log('activate once')
        fireTrapActivate(167,178,1)
        setTimeout(addTrapTwo, 11000) // trap respawns after 11s. hardcoded value
      }
      if (cells[pacman.positionDivNo].classList.contains('trapThree')){ // checks if trapThree is stepped on by pacman
        cells[pacman.positionDivNo].classList.remove('trapThree') 
        // console.log('activate hole trap once')
        holeTrapActivate()
      }

    }
  }

  function fireTrapActivate(fireStart,fireEnd,fireDirection) {
    
    cells[fireStart].classList.add('fire')
    cells[fireEnd].classList.add('fire')
    audio(fireAudio)

    const fireTrap = setInterval(() => {
      // incrementally adds/subtracts the value from the two cells which fire spawn and add classes to the next cell to create moving fire
      fireStart += fireDirection
      fireEnd -= fireDirection
      cells[fireStart].classList.add('fire')
      cells[fireEnd].classList.add('fire')
      if (fireStart === 201){ // if fire has reached the end, it will be removed incrementally too
        clearInterval(fireTrap)
        removeFire(21,361,fireDirection)
      }
      if (fireStart === 173){ // if fire has reached the end, it will be removed incrementally too
        clearInterval(fireTrap) 
        removeFire(167,178,fireDirection)
      }
    },150)
  }

  function removeFire(fireStart,fireEnd,fireDirection){
    // incrementally adds/subtracts the value from the two cells which fire spawn and removes classes to the next cell to create moving fire
    cells[fireStart].classList.remove('fire')
    cells[fireEnd].classList.remove('fire')

    const removeFireTrap = setInterval(() => {
      fireStart += fireDirection
      fireEnd -= fireDirection
      cells[fireStart].classList.remove('fire')
      cells[fireEnd].classList.remove('fire')
      if (fireStart === 181 || fireStart === 173){ // clear interval once all fire has been removed
        clearInterval(removeFireTrap)
      }
    },200)
  }

  function holeTrapActivate() {
    holeTraps.forEach(holeCell => {
      cells[holeCell].classList.add('hole') // adds a hole class to all cells in the holeArray global variable
    })
    audio(openAudio)
    setTimeout(()=> {
      holeTraps.forEach(holeCell => {
        cells[holeCell].classList.remove('hole') // removes hole class after 9s
      })
    }, 9000)
  }

  function checkForTrapDeath(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('fire')){ // checks if pacman's location is same as cells with fire class
        gameOver('burning')
      }
      if (cells[pacman.positionDivNo].classList.contains('hole')){ // checks if pacman's location is same as cells with hole class
        audio(fallAudio)
        gameOver('falling down a Hole')
      }
      ghosts.forEach(ghost => {
        if (cells[ghost.positionDivNo].classList.contains('fire') && ghost.state !== 'eaten'){ // checks if ghost's location is same as cells with fire class and they are not already eaten
          scorePoints(1000,ghost.positionDivNo)
          ghost.state = 'eaten' // kill ghost so it enters the eaten state
          cells[ghost.positionDivNo].classList.remove('scaredGhost') // clears cells of the ghost classes 
          cells[ghost.positionDivNo].classList.remove(ghost.name)
        }
        if (cells[ghost.positionDivNo].classList.contains('hole') && ghost.state !== 'eaten'){ // checks if ghost's location is same as cells with hole class and they are not already eaten
          scorePoints(1000,ghost.positionDivNo)
          audio(fallAudio)
          ghost.state = 'eaten' // kill ghost so it enters the eaten state
          cells[ghost.positionDivNo].classList.remove('scaredGhost')  // clears cells of the ghost classes 
          cells[ghost.positionDivNo].classList.remove(ghost.name)
        }
      })
    }
  }


  // ------------------------------------------- SECRET DOOR PASSAGEWAYS -------------------------------------- 

  function secretDoorCheck(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('trapDoor') && trapDoorCooldown === false){ // checks if pacman's cell is the same a the secret doors cell
        // console.log('trapdoor!')
        trapDoorCooldown = true //set a cooldown on the trapdoor so pacman does not get stuck by keep swapping between them. 
        setTimeout(() => {
          trapDoorCooldown = false // reset trapdown cooldown after 5s
        }, 5000)
        if (pacman.positionDivNo === 28){        
          pacman.positionDivNo = 373 // moves pacman to the other secret door location
          cells[28].classList.remove('pacman') 
          
        } else {   
          pacman.positionDivNo = 28 // moves pacman to the other secret door location
          cells[373].classList.remove('pacman')
        }
      }
    }
  }
  
  // ------------------------------------------- SCORING  -------------------------------------- 
  function scorePoints(pointsEarned, cellDivNo){
    score += pointsEarned
    scoreDisplay.innerHTML = score
    scoreDisplay.classList.add('scale') // gives a larger text css effect when points are gained, only for a quick moment to look like a  pop effect
    setTimeout(()=>{
      scoreDisplay.classList.remove('scale')
    },100)

    if (pointsEarned === 100) {
      cells[cellDivNo].innerHTML = '<p>100</p>' // shows the points earned in the cell briefly 
      setTimeout(()=>{
        cells[cellDivNo].innerHTML = ''
      },500)
    }
    if (pointsEarned === 500) {
      cells[cellDivNo].classList.add('largePointText')  // shows the points earned in the cell briefly. The 500 points have a new class added to make the text bigger and more exciting
      cells[cellDivNo].innerHTML = '<p>500</p>' 
      setTimeout(()=>{
        cells[cellDivNo].classList.remove('largePointText')
        cells[cellDivNo].innerHTML = ''
      },500)
    }
    
  }



  // ------------------------------------------- EVENTS  -------------------------------------- 

 
  
  function gameOver(deathMethod) { 
    playing = false // stops playing and clear the window
    clearAll()
    loseMethod.textContent = `Shame you died by ${deathMethod}`  // uses the parameter to say how you died
    endScore.textContent = score
    gameOverMenu.style.display = 'block'
    resetButton.addEventListener('click', reset)
    themeSongAudio.pause()
    audio(deathAudio)
  }

  function gameWin() {
    playing = false // stops playing and clear the window
    clearAll()
    endScore.textContent = score
    gameWinMenu.style.display = 'block'
    resetButtonWin.addEventListener('click', reset)
    themeSongAudio.pause()
    audio(cheerAudio)
  }

  //clears all values, and most intervals - some are fine to continue running 
  function reset(){
    score = 0
    scoreDisplay.innerHTML = score
    clearAll()  
    chase = true
    mainMenu.style.display = 'block'
    mainMenu.style.display = 'fixed'
    clearInterval(pacmanMoveInterval)
    clearInterval(toggleChaseMode)
    themeSongAudio.play()
  }

  function clearAll(){
    //resets grid and hides everything
    grid.innerHTML = ''
    gridWrapper.style.display = 'none'
    controlWrapper.style.display = 'none'
    mainMenu.style.display = 'none'
    mainMenu.style.display = 'none'
    gameOverMenu.style.display = 'none'
    gameWinMenu.style.display = 'none'
  }

  // grid.addEventListener('click', gameWin) 
  // use this above event listener for a cheat win. just click on the grid at any point to auto win

  // ------------------------------------------- SPRITE ANIMATION INDIE  -------------------------------------- 


  //there are 3 positions for each sprite, 3 images for running up, 3 images for running down, 3 images for running right (left is the same as right but to a scale of -1 to mirror it)
  let spriteNumber = 1 //this value is looped through 1-3 constantly to keep changing the sprite image on a quick interval.
  const spriteChangeSpeed = 600 // speed at which the sprite is cycled through the different images
  let pacmanAnimate = setInterval(()=>{ //initial sprite interval is set
    spriteAnimate('right')
  },spriteChangeSpeed)

  function changeSprite(direction){ //this is invoked on keypress.
    clearInterval(pacmanAnimate)
    spriteAnimate(direction) // clear the current sprite animations and start a new interval with the direction as the parameter
    pacmanAnimate = setInterval(()=>{
      spriteAnimate(direction)
    },spriteChangeSpeed)
  }

  function spriteAnimate(direction){
    const scale = direction === 'left' ? 'transform: scale(-1,1)' : 'transform: scale(1)'  // if direction is left or right, this changes the scale. scale -1 will mirror the image to run left

    if (direction === 'left' || direction === 'right'){
      spriteStyleSheet.innerHTML = `.pacman { background-image: url("bertbtbrtgbb"); background-size: contain; ${scale}}` //changes the stylesheet so the pacman class shows the left/right
    }
    if (direction === 'up') {
      spriteStyleSheet.innerHTML = '.pacman { background-image: url(.tgtgrgtgtrgtg); background-size: contain;}' // up moving sprite images, cycle thorugh spriteUp 1-3 images
    }
    if (direction === 'down') {
      spriteStyleSheet.innerHTML = '.pacman { background-image: url(.trgtgrgtrgtgg); background-size: contain;}' // down moving sprite images, cycle thorugh spriteDown 1-3 images
    }
    // console.log(`sprite ${spritePosition} is used and ${direction} direction`)
    document.head.appendChild(spriteStyleSheet) // append the stylesheet to the html and this removes the previous sprite stylesheet
    if (spriteNumber < 3){ //this cycles through 1-3 which keeps changing the sptite image added to the stylesheet above
      spriteNumber += 1
    } else {
      spriteNumber = 1
    }
    
  }


  // ------------------------------------------- SPRITE ANIMATION INDIE  -------------------------------------- 

  function audio(sound){
    sound.currentTime = 0
    sound.play()
  }

  function playTheme(){
    window.removeEventListener('click', playTheme)
    themeSongAudio.loop = true // constant loop of the epic theme tune! forever and ever
    themeSongAudio.play()
  }
  window.addEventListener('click', playTheme)
  

}
 


window.addEventListener('DOMContentLoaded', init)

