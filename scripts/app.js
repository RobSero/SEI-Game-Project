function init() {


  // ------------------------------------------------------- GLOBAL VARIABLES  -------------------------------------- //



  let playing = false
  const width = 20
  const cellCount = width * width
  let cells = []
  const wallCells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,29,30,31,35,39,40,42,44,45,46,47,53,57,59,60,67,69,70,71,73,75,76,77,79,80,82,84,85,89,90,91,99,100,102,104,105,109,113,115,116,117,119,120,122,126,127,131,132,133,139,140,142,144,148,19,150,154,156,157,158,159,160,164,166,179,180,182,184,186,188,189,190,191,193,194,195,196,199,200,204,206,208,209,210,211,215,216,219,220,222,223,226,233,239,240,242,243,249,255,257,258,259,260,262,266,267,269,271,272,273,275,279,280,282,284,286,289,291,292,293,295,297,299,300,306,308,319,320,322,323,324,330,331,332,333,335,336,337,339,340,342,343,344,346,347,348,355,356,357,359,360,370,371,372,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399]
  const fruitCells = [22,23,24,25,26,27,32,33,34,36,37,41,43,48,49,50,51,52,54,55,56,58,61,62,63,64,65,66,68,72,74,78,81,83,86,87,88,92,93,94,95,96,97,98,101,103,106,107,108,110,111,112,114,118,121,123,124,125,128,129,130,134,135,136,137,138,141,145,146,147,149,151,152,153,155,161,162,163,165,167,168,169,170,171,173,174,175,176,177,178,183,185,187,192,197,201,202,203,205,207,212,213,214,217,218,221,224,225,227,228,229,230,231,232,234,235,236,237,238,241,244,245,246,247,248,250,251,252,253,254,256,261,263,264,265,268,270,274,276,277,278,281,283,285,287,288,294,296,298,301,302,303,304,305,307,309,310,311,312,313,314,315,316,317,318,321,325,326,327,328,329,334,338,341,345,349,350,351,352,353,354,358,362,363,364,365,366,367,368,369,374,375,376,377]
  const bigFruitCells = [21,38,198,361,378]
  const trapDoor = [28,373]
  const holeTraps = [230,231,232,250,251,252]
  const startingPostion = 350
  let score = 0
  let chase = true
  let toggleChaseMode
  let scattering 
  let chasing
  const ghostHome = 170 
  let greenGhostSpeed
  let redGhostSpeed
  let pinkGhostSpeed
  let yellowGhostSpeed
  let pacmanMoveInterval
  const pacmanSpeed = 130
  
  // const styleSheet = document.getElementById('stylesheet').sheet

  // styleSheet.insertRule('body {background-color: yellow}')
  // styleSheet.deleteRule('.greenGhost { background-image: url(/assets/greenGhost.png)}')
  // styleSheet.insertRule('.greenGhost { background-image: url(/assets/yellowGhost.png)}')


  // ------------------------------------------------------- ELEMENTS  -------------------------------------- //


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
  const spriteStyleSheet = document.createElement('style')
  const themeSongAudio = document.getElementById('theme-tune')
  const coinAudio = document.getElementById('audio-coin')
  const bigGemAudio = document.getElementById('audio-bigGem')
  const deathAudio = document.getElementById('audio-death')
  const cheerAudio = document.getElementById('audio-cheer')
  const eatAudio = document.getElementById('audio-eat')
  const fireAudio = document.getElementById('audio-fire')
  const openAudio = document.getElementById('audio-open')
  const fallAudio = document.getElementById('audio-fall')

  // const autowin = document.getElementById('winbut')

  // ------------------------------------------------------- START GAME  -------------------------------------- //



  function startGame() {
    

    if (!playing){
      
      //build board
      playing = true
      
      buildBoard()
      //begin pacman movement
      pacmanMoveInterval = setInterval(movePacMan, pacmanSpeed)
      setInterval(eatFruit, 130)
      setInterval(CheckForBigFruitEaten, 130)
      setInterval(checkForWin, 130)
      //begin ghost movement
      greenGhostSpeed = setInterval(()=> {
        moveGhost(greenGhost)
      }, 300)
      redGhostSpeed = setInterval(()=> {
        moveGhost(redGhost)
      }, 300)
      pinkGhostSpeed = setInterval(()=> {
        moveGhost(yellowGhost)
      }, 300)
      yellowGhostSpeed = setInterval(()=> {
        moveGhost(pinkGhost)
      }, 300)
      

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
    positionDivNo: 170,
    move: 0,
    target: 0,
    initialTarget: 0,
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
    createCells()
    addCellWalls()
    addFruitToGrid()
    addBigFruitToGrid()
    addTrapOne()
    addTrapTwo()
    addTrapThree()
    addSecretDoors()
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

  // ----- ADD BUILD WALLS ON GRID
  function addCellWalls(){
    wallCells.forEach(item => {
      cells[item].classList.add('walls')
    })
  }

  // ----- ADD FRUIT TO BOARD
  function addFruitToGrid(){
    fruitCells.forEach(fruit => {
      cells[fruit].classList.add('fruit')
    })
    cells[startingPostion].classList.remove('fruit')
  }
  // ----- ADD BIG FRUIT TO GRID
  function addBigFruitToGrid() {
    bigFruitCells.forEach(bigFruit => {
      cells[bigFruit].classList.add('bigFruit')
    })
  }

  function addTrapOne() {
    cells[181].classList.add('trapOne')
  }

  function addTrapTwo() {
    cells[172].classList.add('trapTwo')
  }

  function addTrapThree() {
    cells[290].classList.add('trapThree')
    cells[254].classList.add('trapThree')
  }

  function addSecretDoors() {
    cells[28].classList.add('trapDoor')
    cells[373].classList.add('trapDoor')
  }
  
  // -------------------------------------------------------PACMAN OBJECT AND MOVEMENT -------------------------------------- //

  function movePacMan(){
    cells[pacman.positionDivNo].classList.remove('pacman')
    //  CELLS[85]
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
    event.preventDefault()
    if (playing){
      let moveDirection
      switch (event.keyCode){
        case 38:
          moveDirection = -width
          clearInterval(pacmanAnimate)
          spriteAnimate(2)
          pacmanAnimate = setInterval(()=>{
            spriteAnimate(2)
          },pacmanSpeed)
          break
        case 40:
          moveDirection = width
          break
        case 39:
          moveDirection = 1
          clearInterval(pacmanAnimate)
          spriteAnimate(1)
          pacmanAnimate = setInterval(()=>{
            spriteAnimate(1)
          },pacmanSpeed)
          break
        case 37:
          moveDirection = -1
          clearInterval(pacmanAnimate)
          spriteAnimate(0)
          pacmanAnimate = setInterval(()=>{
            spriteAnimate(0)
          },pacmanSpeed)
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
  }


  // ------------------------------------------- PACMAN EATS NORMAL FRUIT -------------------------------------- 

  function eatFruit(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('fruit')){
        scorePoints(100, pacman.positionDivNo)
        cells[pacman.positionDivNo].classList.remove('fruit')
        coinAudio.currentTime = 0
        coinAudio.play()
      }
    }
  }

  // ------------------------------------------- PACMAN EATS BIG FRUIT -------------------------------------- 

  function CheckForBigFruitEaten(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('bigFruit')){
        scorePoints(500,pacman.positionDivNo)
        cells[pacman.positionDivNo].classList.remove('bigFruit')
        scoreDisplay.innerHTML = score
        bigFruitEaten()
      } else {
        cells[pacman.positionDivNo].classList.remove('bigFruit')
      }
    }
  }

  function bigFruitEaten() {
    bigGemAudio.currentTime = 0
    bigGemAudio.play()
    ghosts.forEach(ghost => {
      if (ghost.state === 'normal'){
        const curPosition = ghost.positionDivNo
        ghost.positionDivNo = ghost.prevDivNo
        ghost.prevDivNo = curPosition
        cells[ghost.prevDivNo].classList.remove(ghost.name)
        cells[ghost.prevDivNo].classList.remove('scaredGhost')
      }
    })
    setInterval(eatenGhostPath, 150)
    scaredGhostState()
    setInterval(scaredGhostPath, 150)
    setTimeout(()=> {
      resetGhostState()
      toggleChase(chase)
    }, 6000)
  }


  function scaredGhostState(){
    ghosts.forEach(ghost => {
      ghost.state = 'scared'
    })
  }

  function resetGhostState(){
    ghosts.forEach(ghost => {
      if (ghost.state === 'scared'){
        ghost.state = 'normal'
      }
    })
  }


  // ------------------------------------------- MOVE GHOST  -------------------------------------- 

  function moveGhost(ghost){
    if (playing){
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

    }
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
    if (playing){
      if (isChasing){
        clearInterval(chasing)
        chase = false
        scattering = setInterval(scatterGhostPath, 150)
      // body.style.backgroundColor = 'green'
      } else {
        clearInterval(scattering)
        chase = true
        chasing = setInterval(ghostChasePath, 500)
      // body.style.backgroundColor = 'pink'
      }
    }
  }

  function ghostChasePath() {
    if (playing){
      if (greenGhost.state === 'normal'){
        greenGhost.target = pacman.positionDivNo
      }
      if (redGhost.state === 'normal'){
        redGhost.target = greenGhost.target - 11
      }
      if (yellowGhost.state === 'normal'){
        yellowGhost.target = pacman.positionDivNo + pacman.move
      }
      if (pinkGhost.state === 'normal'){
        pinkGhost.target = pacman.positionDivNo + 10
      }
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
          eatAudio.currentTime = 0
          eatAudio.play()
          console.log(`${ghost.name} State: ${ghost.state}`)
        }
      })
    }
  }

  const eatenCheck = setInterval(checkIfEaten,10)

  function homeTimer(ghost){
    setTimeout(()=> {
      ghost.state = 'normal'
      console.log(`${ghost.name} back to normal wooo`)
      
    }, 4000)
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

  setInterval(checkForLose, 50)
  setInterval(checkForWin,50)




  // ------------------------------------------- TRAPS -------------------------------------- 

  function checkForTrapTrigger(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('trapOne')){
        cells[181].classList.remove('trapOne')
        console.log('activate once')
        fireTrapActivate(21,361,20)
        setTimeout(addTrapOne, 11000)
      }
      if (cells[pacman.positionDivNo].classList.contains('trapTwo')){
        cells[172].classList.remove('trapTwo')
        console.log('activate once')
        fireTrapActivate(167,178,1)
        setTimeout(addTrapTwo, 11000)
      }
      if (cells[pacman.positionDivNo].classList.contains('trapThree')){
        cells[pacman.positionDivNo].classList.remove('trapThree')
        console.log('activate hole trap once')
        holeTrapActivate()
      }

    }
  }

  function fireTrapActivate(fireStart,fireEnd,fireDirection) {
    
    cells[fireStart].classList.add('fire')
    cells[fireEnd].classList.add('fire')
    fireAudio.currentTime = 0
    fireAudio.play()

    const fireTrap = setInterval(() => {
      fireStart += fireDirection
      fireEnd -= fireDirection
      cells[fireStart].classList.add('fire')
      cells[fireEnd].classList.add('fire')
      if (fireStart === 201){
        clearInterval(fireTrap)
        removeFire(21,361,fireDirection)
      }
      if (fireStart === 173){
        clearInterval(fireTrap)
        removeFire(167,178,fireDirection)
      }
    },150)
  }

  function removeFire(fireStart,fireEnd,fireDirection){
    
    cells[fireStart].classList.remove('fire')
    cells[fireEnd].classList.remove('fire')
    const removeFireTrap = setInterval(() => {
      fireStart += fireDirection
      fireEnd -= fireDirection
      cells[fireStart].classList.remove('fire')
      cells[fireEnd].classList.remove('fire')
      if (fireStart === 181 || fireStart === 173){
        clearInterval(removeFireTrap)
      }
    },200)
  }

  function checkForTrapDeath(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('fire')){
        gameOver('burning')
      }
      if (cells[pacman.positionDivNo].classList.contains('hole')){
        fallAudio.currentTime = 0
        fallAudio.play()
        gameOver('falling down a Hole')
      }
      ghosts.forEach(ghost => {
        if (cells[ghost.positionDivNo].classList.contains('fire') && ghost.state !== 'eaten'){
          scorePoints(500,ghost.positionDivNo)
          ghost.state = 'eaten'
          cells[ghost.positionDivNo].classList.remove('scaredGhost')
          cells[ghost.positionDivNo].classList.remove(ghost.name)
        }
        if (cells[ghost.positionDivNo].classList.contains('hole') && ghost.state !== 'eaten'){
          scorePoints(500,ghost.positionDivNo)
          fallAudio.currentTime = 0
          fallAudio.play()
          ghost.state = 'eaten'
          cells[ghost.positionDivNo].classList.remove('scaredGhost')
          cells[ghost.positionDivNo].classList.remove(ghost.name)
        }
      })
    }
  }

  function holeTrapActivate() {
    holeTraps.forEach(holeCell => {
      cells[holeCell].classList.add('hole')
    })
    openAudio.currentTime = 0
    openAudio.play()
    setTimeout(()=> {
      holeTraps.forEach(holeCell => {
        cells[holeCell].classList.remove('hole')
      })
    }, 9000)
  }


  // ------------------------------------------- SECRET DOOR PASSAGEWAYS -------------------------------------- 

  function secretDoorCheck(){
    if (playing){
      if (cells[pacman.positionDivNo].classList.contains('trapDoor')){
        console.log('trapdoor!')
        
        if (pacman.positionDivNo === 28){
          pacman.positionDivNo = 373
        } else {
          pacman.positionDivNo = 28
        }
      }
    }
  }
  setInterval(secretDoorCheck,20)



  // ------------------------------------------- SCORING  -------------------------------------- 
  function scorePoints(pointsEarned, cellDivNo){
    score += pointsEarned
    scoreDisplay.innerHTML = score
    scoreDisplay.classList.add('scale')
    if (pointsEarned === 100) {
      cells[cellDivNo].innerHTML = '<p>100</p>'
      setTimeout(()=>{
        cells[cellDivNo].innerHTML = ''
      },500)
    }
    if (pointsEarned === 500) {
      cells[cellDivNo].innerHTML = '<p>500</p>'
      setTimeout(()=>{
        cells[cellDivNo].innerHTML = ''
      },500)
    }
    setTimeout(()=>{
      scoreDisplay.classList.remove('scale')
    },100)
  }



  // ------------------------------------------- EVENTS  -------------------------------------- 

  startButton.addEventListener('click', () => {
    if (!playing) {
      cells = []
      clearInterval(greenGhostSpeed)
      clearInterval(redGhostSpeed)
      clearInterval(yellowGhostSpeed)
      clearInterval(pinkGhostSpeed)
      clearInterval(pacmanMoveInterval)
      clearInterval(toggleChaseMode)
      chase = true
      ghosts.forEach(ghost => {
        ghost.positionDivNo = 170
        ghost.state = 'normal'
      })
      pacman.positionDivNo = startingPostion
      startGame()
      gridWrapper.style.display = 'flex'
      controlWrapper.style.display = 'flex'
      mainMenu.style.display = 'none'
      window.addEventListener('keydown', validatePress)
    }
  })
  
  function gameOver(deathMethod) {
    playing = false
    grid.innerHTML = ''
    loseMethod.textContent = `Shame you died by ${deathMethod}`
    endScore.textContent = score
    gridWrapper.style.display = 'none'
    controlWrapper.style.display = 'none'
    mainMenu.style.display = 'none'
    gameOverMenu.style.display = 'block'
    resetButton.addEventListener('click', reset)
    themeSongAudio.pause()
    deathAudio.CurrentTime = 0
    deathAudio.play()
  }

  function gameWin() {
    playing = false
    grid.innerHTML = ''
    endScore.textContent = score
    gridWrapper.style.display = 'none'
    controlWrapper.style.display = 'none'
    mainMenu.style.display = 'none'
    gameWinMenu.style.display = 'block'
    resetButtonWin.addEventListener('click', reset)
    themeSongAudio.pause()
    cheerAudio.CurrentTime = 0
    cheerAudio.play()
  }

  function reset(){
    score = 0
    scoreDisplay.innerHTML = score
    gridWrapper.style.display = 'none'
    controlWrapper.style.display = 'none'
    mainMenu.style.display = 'block'
    mainMenu.style.display = 'fixed'
    gameOverMenu.style.display = 'none'
    gameWinMenu.style.display = 'none'
    themeSongAudio.play()
  }

  grid.addEventListener('click', gameWin)

  // function RESETT() {
  //   cells = []
  //   startGame()
  //   clearInterval(greenGhostSpeed)
  //   clearInterval(redGhostSpeed)
  //   clearInterval(yellowGhostSpeed)
  //   clearInterval(pinkGhostSpeed)
  //   clearInterval(pacmanSpeed)
  //   clearInterval(toggleChaseMode)
  //   chase = true
  //   ghosts.forEach(ghost => {
  //     ghost.positionDivNo = 170
  //     ghost.state = 'normal'
  //   })
  //   pacman.positionDivNo = startingPostion
  // }

  // testReset.addEventListener('click', RESETT)
  //clearBut.addEventListener('click', gameOver)
  function playTheme(){
    window.removeEventListener('click', playTheme)
    themeSongAudio.loop = true
    themeSongAudio.play()
  }
  window.addEventListener('click', playTheme)
  
  // autowin.addEventListener('click', gameWin)


  // ------------------------------------------- SPRITE ANIMATION INDIE  -------------------------------------- 

  

  let spritePosition = 1

  function spriteAnimate(direction){
    const scale = direction === 0 ? 'transform: scale(-1,1)' : 'transform: scale(1)' 
    if (direction === 0 || direction === 1){
      spriteStyleSheet.innerHTML = `.pacman { background-image: url("../assets/sprite${spritePosition}.png"); background-size: contain; ${scale}}`
    }
    if (direction === 2) {
      spriteStyleSheet.innerHTML = `.pacman { background-image: url("../assets/spriteUp${spritePosition}.png"); background-size: contain;}`
    }
    console.log(`sprite ${spritePosition} is used and ${direction} direction`)
    document.body.appendChild(spriteStyleSheet)
    if (spritePosition < 3){
      spritePosition += 1
    } else {
      spritePosition = 1
    }
    
  }

  let pacmanAnimate = setInterval(()=>{
    spriteAnimate(2)
  },pacmanSpeed)

 
}
 


window.addEventListener('DOMContentLoaded', init)

