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


}

window.addEventListener('DOMContentLoaded', init)